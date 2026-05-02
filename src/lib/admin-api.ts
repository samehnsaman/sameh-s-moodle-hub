// Typed wrapper around the backend's generic admin CRUD routes:
//   GET    /api/admin/:slug
//   GET    /api/admin/:slug/:id
//   POST   /api/admin/:slug
//   PATCH  /api/admin/:slug/:id
//   DELETE /api/admin/:slug/:id
//
// Slugs (from backend/src/routes/admin.ts):
//   plugins | projects | services | skills | testimonials | profile | messages

import { getAdminToken, clearAdminSession } from "./admin-auth";
import { getApiBaseUrl } from "./data-source";

export type AdminSlug =
  | "plugins"
  | "projects"
  | "services"
  | "skills"
  | "testimonials"
  | "profile"
  | "messages";

function base(): string {
  const b = getApiBaseUrl();
  if (b) return b.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

async function req<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${base()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 || res.status === 403) {
    clearAdminSession();
    throw new Error("Session expired — please sign in again.");
  }
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string; message?: string };
      msg = j.error || j.message || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const adminApi = {
  list: <T = Record<string, unknown>>(slug: AdminSlug) =>
    req<T[]>("GET", `/api/admin/${slug}`),
  get: <T = Record<string, unknown>>(slug: AdminSlug, id: string) =>
    req<T>("GET", `/api/admin/${slug}/${encodeURIComponent(id)}`),
  create: <T = Record<string, unknown>>(slug: AdminSlug, data: unknown) =>
    req<T>("POST", `/api/admin/${slug}`, data),
  update: <T = Record<string, unknown>>(
    slug: AdminSlug,
    id: string,
    data: unknown,
  ) => req<T>("PATCH", `/api/admin/${slug}/${encodeURIComponent(id)}`, data),
  remove: (slug: AdminSlug, id: string) =>
    req<void>("DELETE", `/api/admin/${slug}/${encodeURIComponent(id)}`),
};
