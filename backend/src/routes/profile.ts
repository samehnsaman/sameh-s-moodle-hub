import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const profileRouter = Router();

profileRouter.get("/", async (_req, res, next) => {
  try {
    const profile = await prisma.userProfile.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({
      id: profile.id,
      name: profile.name,
      location: profile.location,
      title: profile.title,
      short_bio: profile.shortBio,
      long_bio: profile.longBio,
      avatar_url: profile.avatarUrl,
      hero_image_url: profile.heroImageUrl,
      favicon_url: profile.faviconUrl,
      ga_tracking_id: (profile as { gaTrackingId?: string }).gaTrackingId ?? "",
      years_experience: profile.yearsExperience,
      email: profile.email,
      github_url: profile.githubUrl,
      linkedin_url: profile.linkedinUrl,
    });
  } catch (e) {
    next(e);
  }
});
