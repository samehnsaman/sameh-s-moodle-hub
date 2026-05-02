import { useEffect } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AdminOnlyDataSourceSwitch } from "@/components/site/AdminOnlyDataSourceSwitch";
import { useFetch } from "@/hooks/useDataSource";
import { getProfile } from "@/lib/api-client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sameh Naim — Moodle Developer, LMS & WordPress Expert" },
      {
        name: "description",
        content:
          "Freelance Moodle developer, LMS specialist, and full-stack web developer. Custom Moodle plugins, WordPress development, school management systems, and LMS integrations.",
      },
      {
        name: "keywords",
        content:
          "Moodle developer, Moodle plugin development, LMS development, LMS integration, WordPress developer, WordPress plugin, web development, full-stack developer, school management system, e-learning, EdTech, Moodle expert, freelance developer, Cairo Egypt",
      },
      { name: "author", content: "Sameh Naim" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Sameh Naim" },
      { property: "og:title", content: "Sameh Naim — Moodle Developer, LMS & WordPress Expert" },
      {
        property: "og:description",
        content:
          "Custom Moodle plugins, LMS integrations, WordPress development, and school management systems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sameh Naim — Moodle Developer, LMS & WordPress Expert" },
      {
        name: "twitter:description",
        content:
          "Custom Moodle plugins, LMS integrations, and WordPress development.",
      },
      { name: "theme-color", content: "#0b0b0f" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sameh Naim",
          jobTitle: "Freelance Moodle Developer & Full-Stack Engineer",
          url: typeof window !== "undefined" ? window.location.origin : undefined,
          address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
          knowsAbout: [
            "Moodle",
            "Moodle plugin development",
            "LMS",
            "Learning Management Systems",
            "WordPress",
            "WordPress plugin development",
            "PHP",
            "Web development",
            "School management systems",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { data: profile } = useFetch(() => getProfile());

  // Dynamic favicon
  useEffect(() => {
    const href = profile?.favicon_url;
    if (!href || typeof document === "undefined") return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [profile?.favicon_url]);

  // Canonical URL (per-page)
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + window.location.pathname;
  });

  // Google Analytics (GA4) — injected only when an ID is configured in admin.
  useEffect(() => {
    const id = profile?.ga_tracking_id?.trim();
    if (!id || typeof document === "undefined") return;
    if (document.getElementById("ga-loader")) return;

    const s1 = document.createElement("script");
    s1.id = "ga-loader";
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.id = "ga-init";
    s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
    document.head.appendChild(s2);
  }, [profile?.ga_tracking_id]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
      <AdminOnlyDataSourceSwitch />
    </div>
  );
}
