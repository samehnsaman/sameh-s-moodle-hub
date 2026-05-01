// Generic CRUD for editable content. All endpoints require admin JWT.
//
// Models exposed: plugin, project, service, skill, testimonial, profile, contactMessage (read/delete only)
//
// POST   /api/admin/:model        create
// PATCH  /api/admin/:model/:id    update
// DELETE /api/admin/:model/:id    delete
// GET    /api/admin/:model        list (full, no public filtering)
// GET    /api/admin/:model/:id    fetch one
//
// We keep validation light here — admin is trusted. Zod still guards shape.

import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../lib/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

const allowed = [
  "plugin",
  "project",
  "service",
  "skill",
  "testimonial",
  "userProfile",
  "contactMessage",
] as const;
type ModelKey = (typeof allowed)[number];

// Map URL slug -> Prisma delegate name
const slugMap: Record<string, ModelKey> = {
  plugins: "plugin",
  projects: "project",
  services: "service",
  skills: "skill",
  testimonials: "testimonial",
  profile: "userProfile",
  messages: "contactMessage",
};

function getDelegate(slug: string) {
  const key = slugMap[slug];
  if (!key) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[key] as {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findUnique: (args: { where: { id: string } }) => Promise<unknown>;
    create: (args: { data: unknown }) => Promise<unknown>;
    update: (args: { where: { id: string }; data: unknown }) => Promise<unknown>;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
  };
}

const idParam = z.object({ id: z.string().min(1).max(64) });

adminRouter.get("/:slug", async (req, res, next) => {
  try {
    const d = getDelegate(req.params.slug);
    if (!d) return res.status(404).json({ error: "Unknown model" });
    const rows = await d.findMany({ orderBy: { createdAt: "desc" } });
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/:slug/:id", async (req, res, next) => {
  try {
    const d = getDelegate(req.params.slug);
    if (!d) return res.status(404).json({ error: "Unknown model" });
    const params = idParam.safeParse(req.params);
    if (!params.success) return res.status(400).json({ error: "Bad id" });
    const row = await d.findUnique({ where: { id: params.data.id } });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/:slug", async (req, res, next) => {
  try {
    const d = getDelegate(req.params.slug);
    if (!d) return res.status(404).json({ error: "Unknown model" });
    if (req.params.slug === "messages")
      return res.status(405).json({ error: "Use /api/contact to create messages" });
    const created = await d.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

adminRouter.patch("/:slug/:id", async (req, res, next) => {
  try {
    const d = getDelegate(req.params.slug);
    if (!d) return res.status(404).json({ error: "Unknown model" });
    const params = idParam.safeParse(req.params);
    if (!params.success) return res.status(400).json({ error: "Bad id" });
    const updated = await d.update({ where: { id: params.data.id }, data: req.body });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminRouter.delete("/:slug/:id", async (req, res, next) => {
  try {
    const d = getDelegate(req.params.slug);
    if (!d) return res.status(404).json({ error: "Unknown model" });
    const params = idParam.safeParse(req.params);
    if (!params.success) return res.status(400).json({ error: "Bad id" });
    await d.delete({ where: { id: params.data.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
