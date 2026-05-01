import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const servicesRouter = Router();

servicesRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
    res.json(
      rows.map((s) => ({
        id: s.id,
        title: s.title,
        short_description: s.shortDescription,
        detailed_description: s.detailedDescription,
        target_clients: s.targetClients,
        icon: s.icon,
      }))
    );
  } catch (e) {
    next(e);
  }
});
