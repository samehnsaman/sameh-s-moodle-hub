import { createFileRoute } from "@tanstack/react-router";

// Static routes we always want indexed. Project detail pages aren't enumerated
// here because they live in the backend DB and change at runtime — search engines
// will discover them via internal links from /projects.
const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/plugins",
  "/contact",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().slice(0, 10);
        const urls = STATIC_PATHS.map(
          (p) =>
            `  <url><loc>${origin}${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
