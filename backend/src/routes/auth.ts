import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { signAdminToken, verifyAdminCredentials, requireAdmin } from "../lib/auth.js";

export const authRouter = Router();

// Aggressive rate limit on login to slow down brute force.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(200),
});

authRouter.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signAdminToken(parsed.data.email.toLowerCase().trim());
    res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || "12h" });
  } catch (e) {
    next(e);
  }
});

authRouter.get("/me", requireAdmin, (req, res) => {
  const admin = (req as typeof req & { admin?: { sub: string } }).admin;
  res.json({ email: admin?.sub, role: "admin" });
});
