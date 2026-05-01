import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  profile,
  projects,
  services,
  skills,
  testimonials,
} from "@/lib/seed-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sameh Naim — Freelance Moodle Developer & Full-Stack Engineer" },
      {
        name: "description",
        content:
          "I build custom Moodle plugins, LMS integrations, and school management systems for schools, universities, and training centers.",
      },
      { property: "og:title", content: "Sameh Naim — Freelance Moodle Developer" },
      {
        property: "og:description",
        content:
          "Custom Moodle plugins, LMS integrations, and school management systems.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const techStack = Array.from(
    new Set(skills.map((s) => s.name).concat(["Moodle", "AWS", "Docker", "Linux"]))
  ).slice(0, 18);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border/60"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 md:py-36">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3" />
              Available for new projects
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Freelance Moodle Developer
              <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                & Full-Stack Engineer
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              I help schools, universities, and training centers get the most
              out of Moodle — from custom plugins and theme work to LMS
              integrations and full school management systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/projects">
                  View Projects <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Hire Me</Link>
              </Button>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              📍 {profile.location} · {profile.years_experience}+ years experience
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">
            What I do
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Services
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick what fits — or combine them. Most engagements start with a
            free 30-minute scoping call.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="border-border/60 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.short_description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="ghost">
            <Link to="/services">All services & skills <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">
                Selected work
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Featured projects
              </h2>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/projects">All projects</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <Card className="h-full border-border/60 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="default">{p.project_type}</Badge>
                      <Badge variant="outline" className="capitalize">{p.status}</Badge>
                    </div>
                    <CardTitle className="text-xl">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{p.short_description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech_stack.slice(0, 4).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">
            Toolbox
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Tech stack
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t) => (
            <Badge key={t} variant="outline" className="rounded-full px-3 py-1.5 text-sm">
              {t}
            </Badge>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">
              Kind words
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What clients say
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="pt-6">
                  <p className="text-sm leading-relaxed">"{t.quote}"</p>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">{t.author}</div>
                    <div className="text-muted-foreground">{t.organization}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div
          className="overflow-hidden rounded-2xl border border-border/60 px-6 py-12 text-center sm:px-12"
          style={{ background: "var(--gradient-primary)" }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Have a Moodle project in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Tell me what you're trying to do. I'll reply within one business day with
            a clear, honest opinion on whether I can help.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
