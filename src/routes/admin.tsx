import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LogIn, LogOut, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  adminLogin,
  adminLogout,
  verifyAdminToken,
} from "@/lib/admin-auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { DataSourceSwitch } from "@/components/site/DataSourceSwitch";
import { MODELS } from "@/lib/admin-models";
import { EntityList } from "@/components/admin/EntityList";
import { getDataMode } from "@/lib/data-source";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Sameh Naim" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { mounted, loggedIn, email } = useAdminAuth();
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      setVerifying(true);
      verifyAdminToken().finally(() => setVerifying(false));
    }
  }, [loggedIn]);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full px-4 py-12 ${loggedIn ? "max-w-6xl" : "max-w-2xl"}`}>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Admin</h1>
          <p className="text-sm text-foreground/60">
            Restricted area — manage site content and data source.
          </p>
        </div>
      </div>

      {!loggedIn ? <LoginPanel /> : <DashboardPanel email={email} verifying={verifying} />}

      <div className="mt-8 text-center">
        <Link to="/" className="text-xs text-foreground/50 hover:text-foreground">
          ← Back to site
        </Link>
      </div>

      {/* Only mount the data-source switch on the admin page when logged in. */}
      {loggedIn && <DataSourceSwitch />}
    </div>
  );
}

function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await adminLogin(email, password);
    setSubmitting(false);
    if (!res.ok) setError(res.error || "Invalid credentials");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div>
        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 bg-background"
          placeholder="admin@samehnaim.dev"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 bg-background"
        />
      </div>
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Sign in
          </>
        )}
      </Button>
      <p className="text-[11px] leading-relaxed text-foreground/50">
        Credentials are validated against the backend (<code>POST /api/auth/login</code>),
        rate-limited to 10 attempts per 15 minutes per IP. Token is stored only in
        your browser's localStorage and expires after 12 hours.
      </p>
    </form>
  );
}

function DashboardPanel({
  email,
  verifying,
}: {
  email: string | null;
  verifying: boolean;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-foreground/60">
            Signed in as
          </div>
          <div className="mt-0.5 font-medium">{email || "admin"}</div>
        </div>
        <div className="flex items-center gap-2">
          {verifying && <Loader2 className="h-4 w-4 animate-spin text-foreground/40" />}
          <Button variant="outline" size="sm" onClick={() => adminLogout()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background/60 p-4 text-xs leading-relaxed text-foreground/70">
        <p className="font-semibold text-foreground">Editing content</p>
        <p className="mt-1">
          Content (profile, projects, services, skills, testimonials, plugins)
          is edited through the backend admin API. Use the{" "}
          <strong>Data Source switch</strong> at the bottom-right to toggle
          between mock data and live API mode for previewing.
        </p>
        <p className="mt-2">
          Full curl examples are in the project <code>README.md</code> under
          “Admin login from the command line”.
        </p>
      </div>
    </div>
  );
}
