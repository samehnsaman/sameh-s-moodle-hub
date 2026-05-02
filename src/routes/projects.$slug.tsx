import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useDataSource";
import { getProjectBySlug } from "@/lib/api-client";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — Sameh Naim" }] };
    const meta = [
      { title: `${p.name} — ${p.project_type} | Sameh Naim` },
      { name: "description", content: p.short_description },
      {
        name: "keywords",
        content: `${p.project_type}, ${p.tech_stack.slice(0, 8).join(", ")}, Moodle, LMS, WordPress, web development`,
      },
      { property: "og:title", content: `${p.name} — ${p.project_type}` },
      { property: "og:description", content: p.short_description },
      { property: "og:type", content: "article" },
      ...(p.image_url
        ? [
            { property: "og:image", content: p.image_url },
            { name: "twitter:image", content: p.image_url },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        : []),
    ];
    return {
      meta,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.name,
            description: p.short_description,
            about: p.project_type,
            keywords: p.tech_stack.join(", "),
            author: { "@type": "Person", name: "Sameh Naim" },
            ...(p.image_url ? { image: p.image_url } : {}),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-bold">Project not found</h1>
      <p className="mt-2 text-muted-foreground">That case study doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project: loaderProject } = Route.useLoaderData();
  const params = Route.useParams();
  // Re-fetch when data source changes so editors see DB updates without nav.
  const { data: live } = useFetch(() => getProjectBySlug(params.slug), [params.slug]);
  const p = live ?? loaderProject;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to="/projects">
          <ArrowLeft className="mr-1 h-4 w-4" /> All projects
        </Link>
      </Button>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge>{p.project_type}</Badge>
        <Badge variant="outline" className="capitalize">{p.status}</Badge>
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{p.name}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{p.short_description}</p>

      <dl className="mt-8 grid gap-4 rounded-lg border border-border/60 bg-secondary/40 p-5 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Role</dt>
          <dd className="mt-1 text-sm font-medium">{p.role}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Period</dt>
          <dd className="mt-1 text-sm font-medium">
            {formatDate(p.start_date)} — {p.end_date ? formatDate(p.end_date) : "Ongoing"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Type</dt>
          <dd className="mt-1 text-sm font-medium">{p.project_type}</dd>
        </div>
      </dl>

      <Section title="Overview">
        <p>{p.long_description}</p>
      </Section>

      <Section title="Problem">
        <p>{p.problem}</p>
      </Section>

      <Section title="Solution">
        <p>{p.solution}</p>
      </Section>

      <Section title="Outcomes">
        <ul className="list-disc space-y-1.5 pl-5">
          {p.outcomes.map((o: string) => <li key={o}>{o}</li>)}
        </ul>
      </Section>

      <Section title="Tech stack">
        <div className="flex flex-wrap gap-1.5">
          {p.tech_stack.map((t: string) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
      </Section>

      {(p.live_url || p.demo_url || p.github_url) && (
        <Section title="Links">
          <div className="flex flex-wrap gap-3">
            {p.live_url && (
              <Button asChild variant="outline">
                <a href={p.live_url} target="_blank" rel="noreferrer">
                  Live site <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            )}
            {p.demo_url && (
              <Button asChild variant="outline">
                <a href={p.demo_url} target="_blank" rel="noreferrer">
                  Demo <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            )}
            {p.github_url && (
              <Button asChild variant="outline">
                <a href={p.github_url} target="_blank" rel="noreferrer">
                  <Github className="mr-1.5 h-3.5 w-3.5" /> GitHub
                </a>
              </Button>
            )}
          </div>
        </Section>
      )}

      <div className="mt-12 rounded-xl border border-border/60 bg-secondary/40 p-6 text-center">
        <h3 className="text-xl font-semibold">Have a similar project in mind?</h3>
        <p className="mt-1 text-sm text-muted-foreground">Let's talk about how I can help.</p>
        <Button asChild className="mt-4">
          <Link to="/contact">Get in touch</Link>
        </Button>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-base leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
