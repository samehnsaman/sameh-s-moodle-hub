import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Github, Puzzle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useDataSource";
import { getPlugins } from "@/lib/api-client";
import { Reveal, fadeUp, stagger } from "@/components/site/motion";

export const Route = createFileRoute("/plugins")({
  head: () => ({
    meta: [
      { title: "Moodle & WordPress Plugins by Sameh Naim" },
      {
        name: "description",
        content:
          "Open-source and commercial Moodle plugins and WordPress plugins built by Sameh Naim — blocks, local plugins, integrations, and more for LMS and web development.",
      },
      {
        name: "keywords",
        content:
          "Moodle plugins, Moodle blocks, Moodle local plugin, WordPress plugins, LMS plugins, web development plugins",
      },
      { property: "og:title", content: "Moodle & WordPress Plugins by Sameh Naim" },
      {
        property: "og:description",
        content:
          "Browse Moodle and WordPress plugins I've built and shipped.",
      },
    ],
  }),
  component: PluginsPage,
});

function PluginsPage() {
  const { data, loading, error } = useFetch(() => getPlugins());
  const plugins = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mb-12 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">
            Things I&apos;ve shipped
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Plugins
          </h1>
          <p className="mt-3 text-muted-foreground">
            A growing collection of plugins I&apos;ve built — Moodle, WordPress,
            and other platforms. Click through to download, view source, or
            learn more.
          </p>
        </div>
      </Reveal>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading plugins…</p>
      )}
      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load plugins from the backend.
        </p>
      )}

      {!loading && plugins.length === 0 && (
        <div className="rounded-xl border border-border/60 bg-secondary/30 p-8 text-center">
          <Puzzle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No plugins published yet. Check back soon.
          </p>
        </div>
      )}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid gap-5 md:grid-cols-2"
      >
        {plugins.map((p) => (
          <motion.div key={p.id} variants={fadeUp}>
            <Card className="group h-full border-border/60 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-gold/20 text-primary">
                      <Puzzle className="h-5 w-5" />
                    </span>
                    <div>
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary" className="text-xs">
                          {p.category}
                        </Badge>
                        {p.version && (
                          <Badge variant="outline" className="text-xs">
                            v{p.version}
                          </Badge>
                        )}
                        {p.featured && (
                          <Badge className="gap-1 bg-gold text-gold-foreground text-xs">
                            <Star className="h-3 w-3" /> Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="gap-1.5">
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      Visit <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  {p.download_url && (
                    <Button asChild size="sm" variant="outline" className="gap-1.5">
                      <a
                        href={p.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" /> Download
                      </a>
                    </Button>
                  )}
                  {p.repo_url && (
                    <Button asChild size="sm" variant="outline" className="gap-1.5">
                      <a
                        href={p.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" /> Source
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
