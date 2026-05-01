import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects as seedProjects } from "@/lib/seed-data";
import type { ProjectType } from "@/types/portfolio";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Sameh Naim" },
      {
        name: "description",
        content:
          "Selected Moodle plugins, SaaS apps, school management systems, and WordPress work by Sameh Naim.",
      },
      { property: "og:title", content: "Projects — Sameh Naim" },
      {
        property: "og:description",
        content:
          "Moodle plugins, SaaS, school management systems, and WordPress projects.",
      },
    ],
  }),
  component: ProjectsPage,
});

const filters: Array<{ label: string; value: ProjectType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Moodle plugins", value: "Moodle plugin" },
  { label: "SaaS", value: "SaaS app" },
  { label: "School management", value: "School management system" },
  { label: "WordPress", value: "WordPress plugin" },
];

function ProjectsPage() {
  const [active, setActive] = useState<ProjectType | "all">("all");

  const list = useMemo(
    () =>
      active === "all"
        ? seedProjects
        : seedProjects.filter((p) => p.project_type === active),
    [active]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-wider text-primary">
          Case studies
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
        <p className="mt-3 text-muted-foreground">
          A selection of Moodle plugins, integrations, and full-stack apps I've
          built for educational organizations.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={active === f.value ? "default" : "outline"}
            onClick={() => setActive(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.id}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group block"
            >
              <Card className="h-full border-border/60 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge>{p.project_type}</Badge>
                    <Badge variant="outline" className="capitalize">{p.status}</Badge>
                  </div>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{p.short_description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech_stack.slice(0, 5).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
