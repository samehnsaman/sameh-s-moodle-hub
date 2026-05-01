// Runtime-toggleable data source.
//
// The site can read content from either:
//   - "mock" — bundled seed data in src/lib/seed-data.ts (default in preview)
//   - "api"  — your self-hosted backend (see backend/ folder)
//
// Mode + base URL are persisted in localStorage so editors can flip the
// switch without redeploying. The build-time VITE_API_BASE_URL env var
// provides the default API URL when present.

export type DataMode = "mock" | "api";

const MODE_KEY = "portfolio.dataSource.mode";
const URL_KEY = "portfolio.dataSource.baseUrl";
export const DATA_SOURCE_EVENT = "portfolio:data-source-changed";

const ENV_BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env
      ?.VITE_API_BASE_URL) ||
  "";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getDataMode(): DataMode {
  if (!isBrowser()) return ENV_BASE_URL ? "api" : "mock";
  const stored = localStorage.getItem(MODE_KEY) as DataMode | null;
  if (stored === "api" || stored === "mock") return stored;
  return ENV_BASE_URL ? "api" : "mock";
}

export function getApiBaseUrl(): string {
  if (!isBrowser()) return ENV_BASE_URL;
  return localStorage.getItem(URL_KEY) ?? ENV_BASE_URL;
}

export function setDataSource(mode: DataMode, baseUrl?: string) {
  if (!isBrowser()) return;
  localStorage.setItem(MODE_KEY, mode);
  if (baseUrl !== undefined) {
    if (baseUrl) localStorage.setItem(URL_KEY, baseUrl.replace(/\/$/, ""));
    else localStorage.removeItem(URL_KEY);
  }
  window.dispatchEvent(new CustomEvent(DATA_SOURCE_EVENT));
}

export function getEnvDefaultBaseUrl(): string {
  return ENV_BASE_URL;
}
