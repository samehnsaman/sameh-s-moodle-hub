import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile, submitContact } from "@/lib/api-client";
import { useDataSource } from "@/hooks/useDataSource";
import type { ContactPayload, UserProfile } from "@/types/portfolio";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Hire a Moodle, LMS & WordPress Developer — Contact Sameh Naim" },
      {
        name: "description",
        content:
          "Hire a freelance Moodle developer, LMS specialist, or WordPress / web developer. Contact Sameh Naim about your Moodle plugin, LMS integration, or WordPress project.",
      },
      {
        name: "keywords",
        content:
          "hire Moodle developer, hire LMS developer, hire WordPress developer, freelance web developer contact",
      },
      { property: "og:title", content: "Hire a Moodle, LMS & WordPress Developer" },
      {
        property: "og:description",
        content:
          "Tell me about your Moodle, LMS, or WordPress project. I reply within one business day.",
      },
    ],
  }),
  component: ContactPage,
});

const projectTypes = [
  "Moodle plugin",
  "School management system",
  "Timetable integration",
  "Other",
] as const;

const budgetRanges = [
  "< $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  project_type: z.enum(projectTypes).optional(),
  budget_range: z.enum(budgetRanges).optional(),
  message: z.string().trim().min(10, "Tell me a little more (10+ chars)").max(2000),
});

type FormState = {
  name: string;
  email: string;
  organization: string;
  project_type: string;
  budget_range: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  organization: "",
  project_type: "",
  budget_range: "",
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { mode, baseUrl } = useDataSource();
  const apiReady = mode === "api" && Boolean(baseUrl);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      project_type: form.project_type || undefined,
      budget_range: form.budget_range || undefined,
      organization: form.organization || undefined,
    });
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload: ContactPayload = {
        name: parsed.data.name,
        email: parsed.data.email,
        organization: parsed.data.organization || undefined,
        project_type: parsed.data.project_type as ContactPayload["project_type"],
        budget_range: parsed.data.budget_range,
        message: parsed.data.message,
      };
      const res = await submitContact(payload);
      if (res.success) {
        setSent(true);
        setForm(initial);
        toast.success("Message sent — I'll reply within one business day.");
      } else {
        toast.error(res.message ?? "Couldn't send your message right now.");
      }
    } catch {
      toast.error("Network error — please try again or email me directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-wider text-primary">
          Let's talk
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Contact
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tell me a little about your project. I'll reply within one business day.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_280px]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {!apiReady && (
            <div className="flex gap-3 rounded-md border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                The contact API isn't configured on this preview yet. Submitting
                will show a friendly message — for now please email{" "}
                <a className="font-semibold underline" href="mailto:hello@samehnaim.dev">
                  hello@samehnaim.dev
                </a>
                .
              </div>
            </div>
          )}

          {sent && (
            <div className="flex gap-3 rounded-md border border-emerald-300/60 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>Thanks! Your message is on its way. I'll get back to you shortly.</div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" error={errors.name} required>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                required
              />
            </Field>
            <Field label="Email" error={errors.email} required>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@school.edu"
                maxLength={255}
                required
              />
            </Field>
          </div>

          <Field label="Organization" error={errors.organization}>
            <Input
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
              placeholder="School / company name"
              maxLength={200}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project type" error={errors.project_type}>
              <Select
                value={form.project_type}
                onValueChange={(v) => update("project_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Budget range" error={errors.budget_range}>
              <Select
                value={form.budget_range}
                onValueChange={(v) => update("budget_range", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Message" error={errors.message} required>
            <Textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="What are you trying to build or fix?"
              rows={6}
              maxLength={2000}
              required
            />
          </Field>

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </form>

        <aside className="space-y-5 rounded-xl border border-border/60 bg-secondary/40 p-5 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase text-muted-foreground">Email</div>
            <a
              href="mailto:hello@samehnaim.dev"
              className="mt-1 inline-flex items-center gap-2 font-medium hover:text-primary"
            >
              <Mail className="h-4 w-4" /> hello@samehnaim.dev
            </a>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-muted-foreground">Location</div>
            <div className="mt-1 inline-flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4" /> Cairo, Egypt
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-muted-foreground">Response</div>
            <div className="mt-1 font-medium">Within 1 business day</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
