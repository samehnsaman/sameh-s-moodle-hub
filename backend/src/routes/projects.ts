import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { projectsQuerySchema } from "../lib/validation.js";

export const projectsRouter = Router();

function serialize(p: Awaited<ReturnType<typeof prisma.project.findFirst>>) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    short_description: p.shortDescription,
    long_description: p.longDescription,
    problem: p.problem,
    solution: p.solution,
    outcomes: p.outcomes,
    tech_stack: p.techStack,
    role: p.role,
    start_date: p.startDate.toISOString(),
    end_date: p.endDate ? p.endDate.toISOString() : null,
    status: p.status,
    featured: p.featured,
    project_type: p.projectType,
    live_url: p.liveUrl,
    demo_url: p.demoUrl,
    github_url: p.githubUrl,
    image_url: (p as { imageUrl?: string | null }).imageUrl ?? null,
  };
}

projectsRouter.get("/", async (req, res, next) => {
  try {
    const parsed = projectsQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: "Invalid query" });
    const where: Record<string, unknown> = {};
    if (parsed.data.type) where.projectType = parsed.data.type;
    if (parsed.data.featured !== undefined) where.featured = parsed.data.featured;
    const rows = await prisma.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
    });
    res.json(rows.map(serialize));
  } catch (e) {
    next(e);
  }
});

projectsRouter.get("/:slug", async (req, res, next) => {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) return res.status(400).json({ error: "Missing slug" });
    const p = await prisma.project.findUnique({ where: { slug } });
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(serialize(p));
  } catch (e) {
    next(e);
  }
});
