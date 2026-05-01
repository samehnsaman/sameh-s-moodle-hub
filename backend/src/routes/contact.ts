import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { contactSchema } from "../lib/validation.js";

export const contactRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 messages per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages — please try again later." },
});

contactRouter.post("/", limiter, async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0] ?? "form");
        if (!errors[k]) errors[k] = issue.message;
      }
      return res.status(400).json({ success: false, errors });
    }
    const data = parsed.data;
    const created = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        organization: data.organization,
        projectType: data.project_type,
        budgetRange: data.budget_range,
        message: data.message,
      },
    });
    res.status(201).json({ success: true, id: created.id });
  } catch (e) {
    next(e);
  }
});
