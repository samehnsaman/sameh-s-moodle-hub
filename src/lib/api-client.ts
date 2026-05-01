// Centralized API client.
// Reads from either bundled seed data or your live backend, based on the
// runtime mode set in src/lib/data-source.ts (toggle via the on-screen
// "Data Source" switch). All page components should import data through
// this module — never directly from seed-data.

import type {
  ContactPayload,
  ContactResponse,
  Plugin,
  Project,
  ProjectType,
  Service,
  Skill,
  SkillCategory,
  Testimonial,
  UserProfile,
} from "@/types/portfolio";
import {
  plugins as seedPlugins,
  profile as seedProfile,
  projects as seedProjects,
  services as seedServices,
  skills as seedSkills,
  testimonials as seedTestimonials,
} from "./seed-data";
import { getApiBaseUrl, getDataMode } from "./data-source";

function useApi(): { mode: "api"; baseUrl: string } | { mode: "mock" } {
  const mode = getDataMode();
  const baseUrl = getApiBaseUrl();
  if (mode === "api" && baseUrl) return { mode: "api", baseUrl };
  return { mode: "mock" };
}

async function apiGet<T>(baseUrl: string, path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getProfile(): Promise<UserProfile> {
  const src = useApi();
  if (src.mode === "mock") return seedProfile;
  return apiGet<UserProfile>(src.baseUrl, "/api/profile");
}

export async function getSkills(category?: SkillCategory): Promise<Skill[]> {
  const src = useApi();
  if (src.mode === "mock") {
    return category ? seedSkills.filter((s) => s.category === category) : seedSkills;
  }
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiGet<Skill[]>(src.baseUrl, `/api/skills${q}`);
}

export async function getServices(): Promise<Service[]> {
  const src = useApi();
  if (src.mode === "mock") return seedServices;
  return apiGet<Service[]>(src.baseUrl, "/api/services");
}

export interface ProjectFilters {
  type?: ProjectType;
  featured?: boolean;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const src = useApi();
  if (src.mode === "mock") {
    return seedProjects.filter((p) => {
      if (filters.type && p.project_type !== filters.type) return false;
      if (filters.featured !== undefined && p.featured !== filters.featured) return false;
      return true;
    });
  }
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.featured !== undefined) params.set("featured", String(filters.featured));
  const q = params.toString() ? `?${params}` : "";
  return apiGet<Project[]>(src.baseUrl, `/api/projects${q}`);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const src = useApi();
  if (src.mode === "mock") {
    return seedProjects.find((p) => p.slug === slug) ?? null;
  }
  try {
    return await apiGet<Project>(src.baseUrl, `/api/projects/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const src = useApi();
  if (src.mode === "mock") return seedTestimonials;
  try {
    return await apiGet<Testimonial[]>(src.baseUrl, "/api/testimonials");
  } catch {
    return seedTestimonials;
  }
}

export async function getPlugins(): Promise<Plugin[]> {
  const src = useApi();
  if (src.mode === "mock") return seedPlugins;
  try {
    return await apiGet<Plugin[]>(src.baseUrl, "/api/plugins");
  } catch {
    return seedPlugins;
  }
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  const src = useApi();
  if (src.mode === "mock") {
    return {
      success: false,
      message:
        "The contact backend isn't configured on this preview. Please email me directly at hello@samehnaim.dev.",
    };
  }
  const res = await fetch(`${src.baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as ContactResponse;
}

// Back-compat for existing callers
export const isApiConfigured = true;
