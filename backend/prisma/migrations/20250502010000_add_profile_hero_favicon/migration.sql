-- Add heroImageUrl and faviconUrl to UserProfile
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "faviconUrl" TEXT NOT NULL DEFAULT '';
