import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useDataSource";
import { getProfile, getProjects } from "@/lib/api-client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Sameh Naim — Moodle Developer, LMS & WordPress Specialist" },
      {
        name: "description",
        content:
          "About Sameh Naim — freelance Moodle developer, LMS specialist, and WordPress / full-stack web developer based in Cairo, Egypt with 8+ years building e-learning platforms.",
      },
      {
        name: "keywords",
        content:
          "Moodle developer, LMS specialist, WordPress developer, web developer Cairo, e-learning consultant, EdTech freelancer",
      },
      { property: "og:title", content: "About Sameh Naim — Moodle, LMS & WordPress Developer" },
      {
        property: "og:description",
        content:
          "Freelance Moodle and LMS developer with deep WordPress and full-stack web development experience.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: profile } = useFetch(() => getProfile());
  const { data: projects } = useFetch(() => getProjects());

  // Build a simple timeline from projects (newest first)
  const milestones = [...(projects ?? [])]
    .sort((a, b) => (a.start_date < b.start_date ? 1 : -1))
    .map((p) => ({
      year: new Date(p.start_date).getFullYear(),
      title: p.name,
      description: p.short_description,
      type: p.project_type,
    }));

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-sm font-semibold uppercase tracking-wider text-primary">
        About
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Hi, I'm {profile.name.split(" ")[0]}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {profile.title} · {profile.location}
      </p>

      <div className="prose prose-slate mt-8 max-w-none text-base leading-relaxed text-foreground/90">
        <p>{profile.long_bio}</p>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Milestones</h2>
      <ol className="mt-6 space-y-6 border-l border-border pl-6">
        {milestones.map((m, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              {m.year} · {m.type}
            </div>
            <div className="mt-0.5 text-base font-semibold">{m.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 rounded-xl border border-border/60 bg-secondary/40 p-6 text-center">
        <h3 className="text-xl font-semibold">Want to work together?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell me about your Moodle project, school system, or integration challenge.
        </p>
        <Button asChild className="mt-4">
          <Link to="/contact">Get in touch</Link>
        </Button>
      </div>
    </div>
  );
}
