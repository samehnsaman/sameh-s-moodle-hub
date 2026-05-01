import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services, skills } from "@/lib/seed-data";
import type { SkillCategory } from "@/types/portfolio";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Skills — Sameh Naim" },
      {
        name: "description",
        content:
          "Moodle development, LMS integrations, school management systems, and DevOps services. Skills across PHP, Node.js, MySQL, AWS, and Linux.",
      },
      { property: "og:title", content: "Services & Skills — Sameh Naim" },
      {
        property: "og:description",
        content:
          "Moodle development, LMS integrations, and full-stack engineering services.",
      },
    ],
  }),
  component: ServicesPage,
});

const categoryOrder: SkillCategory[] = [
  "Moodle & LMS",
  "Backend",
  "Frontend",
  "DevOps & Cloud",
];

function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-wider text-primary">
          What I offer
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Services & Skills
        </h1>
        <p className="mt-3 text-muted-foreground">
          End-to-end Moodle and LMS work, plus the full-stack and DevOps skills
          to back it up.
        </p>
      </div>

      {/* Services */}
      <section className="mb-20">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Services</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <Card key={s.id} className="border-border/60">
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {s.detailed_description}
                </p>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">
                    Ideal for
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.target_clients.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Skills</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {categoryOrder.map((cat) => {
            const list = skills.filter((s) => s.category === cat);
            if (list.length === 0) return null;
            return (
              <Card key={cat} className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">{cat}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((s) => (
                      <Badge
                        key={s.id}
                        variant={s.level === "expert" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {s.name}
                        <span className="ml-1.5 opacity-70">· {s.level}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="mt-16 rounded-xl border border-border/60 bg-secondary/40 p-6 text-center">
        <h3 className="text-xl font-semibold">Need something specific?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          If it's not listed, just ask — I take on most Moodle and full-stack
          work.
        </p>
        <Button asChild className="mt-4">
          <Link to="/contact">Start a conversation</Link>
        </Button>
      </div>
    </div>
  );
}
