// Field schemas drive the generic admin editor form (src/components/admin/EntityEditor.tsx).
// Field names use Prisma camelCase (matches what /api/admin/:slug accepts/returns).

import type { AdminSlug } from "@/lib/admin-api";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "stringArray";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // for select
  placeholder?: string;
  help?: string;
  rows?: number; // textarea
}

export interface ModelDef {
  slug: AdminSlug;
  label: string;
  /** Field used as the row title in the list view */
  titleField: string;
  /** Optional secondary line (e.g. category, slug, email) */
  subtitleField?: string;
  /** Field rendered as a small thumbnail in the list view (URL string) */
  imageField?: string;
  /** Whether new rows can be created from the UI */
  canCreate: boolean;
  /** Whether rows can be deleted from the UI */
  canDelete: boolean;
  fields: FieldDef[];
}

export const MODELS: ModelDef[] = [
  {
    slug: "projects",
    label: "Projects",
    titleField: "name",
    subtitleField: "slug",
    imageField: "imageUrl",
    canCreate: true,
    canDelete: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, placeholder: "kebab-case-unique" },
      { name: "shortDescription", label: "Short description", type: "textarea", required: true, rows: 2 },
      { name: "longDescription", label: "Long description", type: "textarea", required: true, rows: 5 },
      { name: "problem", label: "Problem", type: "textarea", required: true, rows: 3 },
      { name: "solution", label: "Solution", type: "textarea", required: true, rows: 3 },
      { name: "outcomes", label: "Outcomes", type: "stringArray", help: "One outcome per line" },
      { name: "techStack", label: "Tech stack", type: "stringArray", help: "One technology per line" },
      { name: "role", label: "Your role", type: "text", required: true },
      { name: "startDate", label: "Start date", type: "date", required: true },
      { name: "endDate", label: "End date", type: "date" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["live", "in progress", "planned"],
      },
      { name: "featured", label: "Featured", type: "boolean" },
      {
        name: "projectType",
        label: "Project type",
        type: "select",
        required: true,
        options: [
          "Moodle plugin",
          "School management system",
          "SaaS app",
          "WordPress plugin",
        ],
      },
      { name: "imageUrl", label: "Cover image URL", type: "url", help: "Shown on Featured Work cards" },
      { name: "liveUrl", label: "Live URL", type: "url" },
      { name: "demoUrl", label: "Demo URL", type: "url" },
      { name: "githubUrl", label: "GitHub URL", type: "url" },
    ],
  },
  {
    slug: "plugins",
    label: "Plugins",
    titleField: "name",
    subtitleField: "category",
    imageField: "iconUrl",
    canCreate: true,
    canDelete: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Moodle plugin", "WordPress plugin", "Other"],
      },
      { name: "url", label: "Primary URL", type: "url", required: true },
      { name: "repoUrl", label: "Repo URL", type: "url" },
      { name: "downloadUrl", label: "Download URL", type: "url" },
      { name: "version", label: "Version", type: "text" },
      { name: "iconUrl", label: "Icon URL", type: "url" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "order", label: "Display order", type: "number" },
    ],
  },
  {
    slug: "services",
    label: "Services",
    titleField: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "shortDescription", label: "Short description", type: "textarea", required: true, rows: 2 },
      { name: "detailedDescription", label: "Detailed description", type: "textarea", required: true, rows: 5 },
      { name: "targetClients", label: "Target clients", type: "stringArray", help: "One per line" },
      { name: "icon", label: "Icon (lucide name)", type: "text" },
    ],
  },
  {
    slug: "skills",
    label: "Skills",
    titleField: "name",
    subtitleField: "category",
    canCreate: true,
    canDelete: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Moodle & LMS", "Backend", "Frontend", "DevOps & Cloud"],
      },
      {
        name: "level",
        label: "Level",
        type: "select",
        required: true,
        options: ["expert", "advanced", "intermediate"],
      },
      { name: "icon", label: "Icon", type: "text" },
    ],
  },
  {
    slug: "testimonials",
    label: "Testimonials",
    titleField: "author",
    subtitleField: "organization",
    canCreate: true,
    canDelete: true,
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true, rows: 4 },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text", required: true },
      { name: "order", label: "Display order", type: "number" },
    ],
  },
  {
    slug: "profile",
    label: "Profile",
    titleField: "name",
    subtitleField: "title",
    imageField: "avatarUrl",
    canCreate: false, // singleton — edit existing only
    canDelete: false,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "shortBio", label: "Short bio", type: "textarea", required: true, rows: 2 },
      { name: "longBio", label: "Long bio", type: "textarea", required: true, rows: 6 },
      { name: "avatarUrl", label: "Avatar URL", type: "url" },
      { name: "heroImageUrl", label: "Hero image URL", type: "url", help: "Replaces the big SN tile on the home page" },
      { name: "faviconUrl", label: "Favicon URL", type: "url", help: "Browser tab icon (PNG/SVG/ICO)" },
      { name: "gaTrackingId", label: "Google Analytics ID", type: "text", placeholder: "G-XXXXXXXXXX", help: "GA4 Measurement ID (starts with G-) or legacy UA-XXXXXXXX. Leave empty to disable analytics." },
      { name: "yearsExperience", label: "Years of experience", type: "number", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "githubUrl", label: "GitHub URL", type: "url" },
      { name: "linkedinUrl", label: "LinkedIn URL", type: "url" },
    ],
  },
  {
    slug: "messages",
    label: "Messages",
    titleField: "name",
    subtitleField: "email",
    canCreate: false,
    canDelete: true,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "organization", label: "Organization", type: "text" },
      { name: "projectType", label: "Project type", type: "text" },
      { name: "budgetRange", label: "Budget range", type: "text" },
      { name: "message", label: "Message", type: "textarea", rows: 6 },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["new", "in_progress", "closed"],
      },
    ],
  },
];

export function getModel(slug: AdminSlug): ModelDef {
  const m = MODELS.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown admin model: ${slug}`);
  return m;
}
