import { PrismaClient } from "@prisma/client";

// Build DATABASE_URL from DB_* parts if not provided explicitly.
function buildDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (DB_HOST && DB_PORT && DB_USER && DB_PASSWORD && DB_NAME) {
    return `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(
      DB_PASSWORD
    )}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;
  }
  return undefined;
}

const url = buildDatabaseUrl();
if (url) process.env.DATABASE_URL = url;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
