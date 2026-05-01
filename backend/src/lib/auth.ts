// JWT-based admin auth. Single admin account whose credentials live in env.
// Why not in DB? One admin, simpler ops, no password reset flow needed.
// Password is compared with bcrypt against ADMIN_PASSWORD_HASH if set,
// otherwise against ADMIN_PASSWORD in plain (hashed at boot).

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  // eslint-disable-next-line no-console
  console.warn(
    "[auth] JWT_SECRET is missing or too short (<32 chars). Admin login is DISABLED."
  );
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  // eslint-disable-next-line no-console
  console.warn(
    "[auth] ADMIN_EMAIL or ADMIN_PASSWORD missing. Admin login is DISABLED."
  );
}

// Pre-hash the configured admin password once at boot for constant-time compare.
const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD
  ? bcrypt.hashSync(ADMIN_PASSWORD, 10)
  : "";

export function authEnabled(): boolean {
  return Boolean(JWT_SECRET && JWT_SECRET.length >= 32 && ADMIN_EMAIL && ADMIN_PASSWORD_HASH);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  if (!authEnabled()) return false;
  if (email.toLowerCase().trim() !== ADMIN_EMAIL) {
    // Still run a bcrypt compare to keep timing similar
    await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    return false;
  }
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export interface AdminTokenPayload {
  sub: string; // admin email
  role: "admin";
}

export function signAdminToken(email: string): string {
  return jwt.sign({ sub: email, role: "admin" } satisfies AdminTokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!authEnabled()) {
    res.status(503).json({ error: "Admin auth not configured on server" });
    return;
  }
  const header = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }
  try {
    const decoded = jwt.verify(match[1], JWT_SECRET) as AdminTokenPayload;
    if (decoded.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    (req as Request & { admin?: AdminTokenPayload }).admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
