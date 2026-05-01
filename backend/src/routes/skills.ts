import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { skillsQuerySchema } from "../lib/validation.js";

export const skillsRouter = Router();

skillsRouter.get("/", async (req, res, next) => {
  try {
    const parsed = skillsQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: "Invalid query" });
    const where = parsed.data.category ? { category: parsed.data.category } : {};
    const rows = await prisma.skill.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    res.json(rows);
  } catch (e) {
    next(e);
  }
});
