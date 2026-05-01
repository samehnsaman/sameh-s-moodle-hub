// Centralized API client.
// - If VITE_API_BASE_URL is set, the client makes real HTTP calls to your backend.
// - Otherwise it serves the seed data bundled in src/lib/seed-data.ts so the
//   site works immediately on Lovable with no backend configured.

import type {
  ContactPayload,
  ContactResponse,
  Project,
  ProjectType,
  Service,
  Skill,
  SkillCategory,
  UserProfile,
} from "@/types/portfolio";
import {
  profile as seedProfile,
  projects as seedProjects,
  services as seedServices,
  skills as seedSkills,
} from "./seed-data";

const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env
      ?.VITE_API_BASE_URL) ||
  "";

export const isApiConfigured = Boolean(API_BASE_URL);

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getProfile(): Promise<UserProfile> {
  if (!isApiConfigured) return seedProfile;
  return apiGet<UserProfile>("/api/profile");
}

export async function getSkills(category?: SkillCategory): Promise<Skill[]> {
  if (!isApiConfigured) {
    return category ? seedSkills.filter((s) => s.category === category) : seedSkills;
  }
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiGet<Skill[]>(`/api/skills${q}`);
}

export async function getServices(): Promise<Service[]> {
  if (!isApiConfigured) return seedServices;
  return apiGet<Service[]>("/api/services");
}

export interface ProjectFilters {
  type?: ProjectType;
  featured?: boolean;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  if (!isApiConfigured) {
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
  return apiGet<Project[]>(`/api/projects${q}`);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isApiConfigured) {
    return seedProjects.find((p) => p.slug === slug) ?? null;
  }
  try {
    return await apiGet<Project>(`/api/projects/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  if (!isApiConfigured) {
    return {
      success: false,
      message:
        "The contact backend isn't configured on this preview. Please email me directly at hello@samehnaim.dev.",
    };
  }
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as ContactResponse;
}
