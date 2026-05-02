-- Add Google Analytics tracking ID to UserProfile (admin-editable)
ALTER TABLE "UserProfile" ADD COLUMN "gaTrackingId" TEXT NOT NULL DEFAULT '';
