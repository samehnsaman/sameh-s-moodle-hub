// Shared types between frontend (Lovable) and backend (your VPS).
// Keep this in sync with backend/src/types/portfolio.ts.

export type SkillLevel = "expert" | "advanced" | "intermediate";

export type SkillCategory =
  | "Moodle & LMS"
  | "Backend"
  | "Frontend"
  | "DevOps & Cloud";

export type ProjectType =
  | "Moodle plugin"
  | "School management system"
  | "SaaS app"
  | "WordPress plugin";

export type ProjectStatus = "live" | "in progress" | "planned";

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  title: string;
  short_bio: string;
  long_bio: string;
  avatar_url: string;
  hero_image_url?: string;
  favicon_url?: string;
  ga_tracking_id?: string;
  years_experience: number;
  email: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string;
  target_clients: string[];
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  problem: string;
  solution: string;
  outcomes: string[];
  tech_stack: string[];
  role: string;
  start_date: string; // ISO
  end_date: string | null;
  status: ProjectStatus;
  featured: boolean;
  project_type: ProjectType;
  live_url?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
  image_url?: string | null;
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  organization: string;
}

export type PluginCategory = "Moodle plugin" | "WordPress plugin" | "Other";

export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: PluginCategory | string;
  url: string;
  repo_url?: string | null;
  download_url?: string | null;
  version?: string | null;
  icon_url?: string | null;
  featured: boolean;
  order: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  organization?: string;
  project_type?: ProjectType | "Other";
  budget_range?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  id?: string;
  errors?: Record<string, string>;
  message?: string;
}
