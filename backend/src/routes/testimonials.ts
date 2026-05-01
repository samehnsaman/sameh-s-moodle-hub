import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const testimonialsRouter = Router();

testimonialsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    res.json(
      rows.map((t) => ({
        id: t.id,
        quote: t.quote,
        author: t.author,
        organization: t.organization,
      }))
    );
  } catch (e) {
    next(e);
  }
});
