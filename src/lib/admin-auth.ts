// Admin auth: stores the JWT issued by the backend `/api/auth/login` endpoint
// and exposes helpers to check / refresh / clear the session.
//
// The token lives in localStorage (admin browser only). It is sent as a Bearer
// header on admin-only API calls. There is NO admin state in the URL or in
// cookies, so non-admin visitors cannot accidentally see admin UI.

import { getApiBaseUrl } from "./data-source";

const TOKEN_KEY = "portfolio.admin.token";
const EMAIL_KEY = "portfolio.admin.email";
export const ADMIN_AUTH_EVENT = "portfolio:admin-auth-changed";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getAdminToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminEmail(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function isAdminLoggedIn(): boolean {
  return Boolean(getAdminToken());
}

function emit() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENT));
}

export function setAdminSession(token: string, email: string) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
  emit();
}

export function clearAdminSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  emit();
}

function adminApiBase(): string {
  // Prefer the configured API base; fall back to same-origin (works behind
  // Traefik where /api routes to the backend on samykhalil.me).
  const base = getApiBaseUrl();
  if (base) return base.replace(/\/$/, "");
  if (isBrowser()) return window.location.origin;
  return "";
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function adminLogin(email: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${adminApiBase()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      token?: string;
      error?: string;
    };
    if (!res.ok || !body.token) {
      return { ok: false, error: body.error || `Login failed (${res.status})` };
    }
    setAdminSession(body.token, email.trim().toLowerCase());
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function adminLogout() {
  clearAdminSession();
}

// Validate the current token against the backend. Returns true if still valid.
export async function verifyAdminToken(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch(`${adminApiBase()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (res.ok) return true;
    if (res.status === 401 || res.status === 403) clearAdminSession();
    return false;
  } catch {
    // Network error — assume token is still valid; user can retry.
    return true;
  }
}
