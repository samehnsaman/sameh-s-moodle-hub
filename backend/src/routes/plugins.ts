import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const pluginsRouter = Router();

function serialize(p: Awaited<ReturnType<typeof prisma.plugin.findFirst>>) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    url: p.url,
    repo_url: p.repoUrl,
    download_url: p.downloadUrl,
    version: p.version,
    icon_url: p.iconUrl,
    featured: p.featured,
    order: p.order,
  };
}

pluginsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.plugin.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    res.json(rows.map(serialize));
  } catch (e) {
    next(e);
  }
});
