import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useDataSource";
import {
  getProfile,
  getProjects,
  getServices,
  getSkills,
  getTestimonials,
} from "@/lib/api-client";
import {
  Reveal,
  MotionDiv,
  fadeUp,
  stagger,
} from "@/components/site/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Moodle Developer & LMS Expert | WordPress & Web Development — Sameh Naim" },
      {
        name: "description",
        content:
          "Freelance Moodle developer and LMS specialist. I build custom Moodle plugins, WordPress sites and plugins, school management systems, and full-stack web development for schools, universities, and EdTech companies.",
      },
      {
        name: "keywords",
        content:
          "Moodle, Moodle developer, Moodle plugin development, LMS, LMS integration, WordPress, WordPress developer, WordPress plugin, web development, full-stack, e-learning, EdTech, school management system",
      },
      { property: "og:title", content: "Moodle Developer & LMS Expert | WordPress & Web Development" },
      {
        property: "og:description",
        content:
          "Custom Moodle plugins, LMS integrations, WordPress development, and school management systems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Moodle Developer & LMS Expert | WordPress & Web Development" },
      { name: "twitter:description", content: "Custom Moodle plugins, LMS integrations, and WordPress development." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: profile } = useFetch(() => getProfile());
  const { data: projects } = useFetch(() => getProjects());
  const { data: services } = useFetch(() => getServices());
  const { data: skills } = useFetch(() => getSkills());
  const { data: testimonials } = useFetch(() => getTestimonials());

  const featured = (projects ?? []).filter((p) => p.featured).slice(0, 4);
  const techStack = Array.from(
    new Set((skills ?? []).map((s) => s.name).concat(["Moodle", "AWS", "Docker", "Linux"]))
  ).slice(0, 18);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[150px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute left-1/4 top-2/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[120px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-24 sm:px-6 md:grid-cols-12 md:py-32">
          <MotionDiv
            className="md:col-span-7"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge
                variant="outline"
                className="gap-1.5 border-gold/40 bg-gold/10 text-gold"
              >
                <Sparkles className="h-3 w-3" />
                Available for new projects
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
            >
              <span className="text-gold">Harmonizing</span> Code,
              <br />
              <span className="text-primary">Crafting</span> Experiences.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[60ch] text-lg text-foreground/70"
            >
              Freelance Moodle developer & full-stack engineer in {profile?.location ?? "Cairo, Egypt"}.
              Transforming complex LMS challenges into elegant, scalable
              solutions for schools and universities.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gold px-8 text-gold-foreground shadow-[0_18px_50px_-15px_color-mix(in_oklab,var(--color-gold)_55%,transparent)] hover:bg-gold/90"
              >
                <Link to="/contact">
                  Let's Build Together <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/20 bg-transparent px-8 hover:bg-surface-2"
              >
                <Link to="/projects">View Work</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 text-sm text-foreground/60"
            >
              📍 {profile?.location ?? "Cairo, Egypt"} · {profile?.years_experience ?? 8}+ years experience
            </motion.div>
          </MotionDiv>

          <MotionDiv
            className="relative md:col-span-5"
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-surface/50 backdrop-blur">
              {profile?.hero_image_url ? (
                <img
                  src={profile.hero_image_url}
                  alt={`${profile?.name ?? "Sameh Naim"} — portrait`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="border border-foreground/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: (i % 7) * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-display text-7xl font-bold text-foreground drop-shadow-lg">
                        SN
                      </div>
                      <div className="mt-2 text-sm uppercase tracking-[0.3em] text-foreground/80">
                        Moodle · Full-Stack
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <motion.div
              aria-hidden
              className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gold/30 blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </MotionDiv>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-20 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
              What I do
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              My Expertise, <span className="text-gold">Harmonized.</span>
            </h2>
          </Reveal>

          <Reveal className="mb-12">
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center backdrop-blur-sm sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                New
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                Custom Moodle Mobile Apps
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
                I build branded Moodle mobile apps (iOS & Android) ready to be
                published on the App Store and Google Play under{" "}
                <span className="font-semibold text-foreground">your own developer account</span>
                {" "}— your branding, your store presence, your users.
              </p>
            </div>
          </Reveal>

          <MotionDiv
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid gap-8 md:grid-cols-3"
          >
            {(services ?? []).slice(0, 3).map((s, i) => (
              <motion.div
                key={s.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-8 backdrop-blur-sm"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="font-display text-4xl font-bold text-gold">
                  0{i + 1}
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold">
                  {s.title}
                </h3>
                <p className="mt-3 text-foreground/70">{s.short_description}</p>
              </motion.div>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="relative py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-20 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
              Selected work
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Featured <span className="text-gold">Works</span>
            </h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group block h-full"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-sm transition-colors hover:border-gold/40"
                  >
                    {p.image_url ? (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-surface-2">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-8">
                      <div className="mb-6 flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/20 text-primary-glow">
                          {p.project_type}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {p.status}
                        </Badge>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-2xl font-bold sm:text-3xl">
                          {p.name}
                        </h3>
                        <ArrowUpRight className="h-6 w-6 shrink-0 text-foreground/40 transition-all group-hover:text-gold group-hover:rotate-12" />
                      </div>
                      <p className="mt-4 text-foreground/70">{p.short_description}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {p.tech_stack.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-gold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {(p.live_url || p.demo_url || p.github_url) && (
                        <div className="mt-6 flex flex-wrap gap-3 border-t border-border/60 pt-4 text-xs">
                          {p.live_url && (
                            <span className="text-foreground/60">
                              <span className="text-gold">●</span> Live
                            </span>
                          )}
                          {p.demo_url && (
                            <span className="text-foreground/60">
                              <span className="text-gold">●</span> Demo
                            </span>
                          )}
                          {p.github_url && (
                            <span className="text-foreground/60">
                              <span className="text-gold">●</span> Source
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-foreground/20 bg-transparent px-8 hover:bg-surface-2"
            >
              <Link to="/projects">All projects <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* TECH STACK — marquee */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
              Toolbox
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Tech I work with
            </h2>
          </Reveal>

          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...techStack, ...techStack].map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium text-foreground/80 backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-20 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
              Kind words
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              What clients say
            </h2>
          </Reveal>

          <MotionDiv
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {(testimonials ?? []).map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl border border-border bg-surface/40 p-8 backdrop-blur-sm"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div
                  itemProp="itemReviewed"
                  itemScope
                  itemType="https://schema.org/Organization"
                  style={{ display: "none" }}
                >
                  <meta itemProp="name" content={profile?.name ?? "Sameh Naim"} />
                </div>
                <div className="font-display text-5xl leading-none text-gold">"</div>
                <div
                  className="mt-2 flex gap-1"
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                  aria-label="Rated 5 out of 5 stars"
                >
                  <meta itemProp="ratingValue" content="5" />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-3 text-foreground/80" itemProp="reviewBody">{t.quote}</p>
                <div
                  className="mt-6 border-t border-border pt-4 text-sm"
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <div className="font-semibold" itemProp="name">{t.author}</div>
                  <div className="text-foreground/60" itemProp="worksFor">{t.organization}</div>
                </div>
              </motion.div>
            ))}
          </MotionDiv>

          {(testimonials ?? []).length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  name: profile?.name ?? "Sameh Naim",
                  jobTitle: "Moodle Developer & LMS Expert",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "5",
                    bestRating: "5",
                    worstRating: "1",
                    reviewCount: (testimonials ?? []).length,
                  },
                  review: (testimonials ?? []).map((t) => ({
                    "@type": "Review",
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                      bestRating: "5",
                    },
                    author: { "@type": "Person", name: t.author },
                    reviewBody: t.quote,
                  })),
                }),
              }}
            />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 px-6 py-20 text-center backdrop-blur-sm sm:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ background: "var(--gradient-hero)" }}
              />
              <div className="relative">
                <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  Ready to <span className="text-gold">Harmonize</span>?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/70">
                  Tell me what you're trying to do. I'll reply within one business
                  day with a clear, honest opinion on whether I can help.
                </p>
                <div className="mt-10">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-gold px-10 text-gold-foreground hover:bg-gold/90"
                  >
                    <Link to="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
