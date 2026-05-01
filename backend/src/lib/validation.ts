import { z } from "zod";

export const projectTypeEnum = z.enum([
  "Moodle plugin",
  "School management system",
  "Timetable integration",
  "SaaS app",
  "WordPress plugin",
  "Other",
]);

export const budgetRangeEnum = z.enum([
  "< $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
]);

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  organization: z.string().trim().max(200).optional(),
  project_type: projectTypeEnum.optional(),
  budget_range: budgetRangeEnum.optional(),
  message: z.string().trim().min(10).max(2000),
});

export const skillsQuerySchema = z.object({
  category: z
    .enum(["Moodle & LMS", "Backend", "Frontend", "DevOps & Cloud"])
    .optional(),
});

export const projectsQuerySchema = z.object({
  type: z
    .enum([
      "Moodle plugin",
      "School management system",
      "SaaS app",
      "WordPress plugin",
    ])
    .optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});
