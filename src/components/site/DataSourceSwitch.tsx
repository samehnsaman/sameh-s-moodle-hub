import { useEffect, useState } from "react";
import { Database, FlaskConical, Settings2, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type DataMode,
  getApiBaseUrl,
  getDataMode,
  getEnvDefaultBaseUrl,
  setDataSource,
} from "@/lib/data-source";
import { useDataSource } from "@/hooks/useDataSource";

export function DataSourceSwitch() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [draftMode, setDraftMode] = useState<DataMode>("mock");
  const [draftUrl, setDraftUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const { mode, baseUrl } = useDataSource();

  // Mount client-side only to avoid SSR/hydration mismatch.
  useEffect(() => {
    setMounted(true);
    setDraftMode(getDataMode());
    setDraftUrl(getApiBaseUrl());
  }, []);

  if (!mounted) return null;

  const envDefault = getEnvDefaultBaseUrl();
  const isLive = mode === "api" && Boolean(baseUrl);

  const apply = () => {
    setDataSource(draftMode, draftUrl);
    setOpen(false);
  };

  const testConnection = async () => {
    if (!draftUrl) {
      setStatus("error");
      setStatusMsg("Enter an API base URL first.");
      return;
    }
    setStatus("checking");
    setStatusMsg("");
    try {
      const url = `${draftUrl.replace(/\/$/, "")}/healthz`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setStatus("ok");
      setStatusMsg("Connected ✓");
    } catch (e) {
      setStatus("error");
      setStatusMsg(e instanceof Error ? e.message : "Connection failed");
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open data source settings"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur transition-all hover:scale-105"
      >
        {isLive ? (
          <>
            <Database className="h-3.5 w-3.5 text-gold" />
            <span>Live API</span>
          </>
        ) : (
          <>
            <FlaskConical className="h-3.5 w-3.5 text-primary-glow" />
            <span>Mock data</span>
          </>
        )}
        <Settings2 className="h-3.5 w-3.5 opacity-60" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-end sm:p-6">
          <div
            className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="font-display text-base font-bold">Data Source</div>
                <div className="text-xs text-foreground/60">
                  Switch between mock content and your live backend.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-foreground/60 hover:bg-surface-2"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              {/* Mode toggle */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  Mode
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-surface-2 p-1">
                  <button
                    type="button"
                    onClick={() => setDraftMode("mock")}
                    className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      draftMode === "mock"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <FlaskConical className="h-4 w-4" /> Mock
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftMode("api")}
                    className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      draftMode === "api"
                        ? "bg-gold text-gold-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <Database className="h-4 w-4" /> Live API
                  </button>
                </div>
              </div>

              {/* API URL input */}
              <div>
                <Label htmlFor="api-url" className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  API base URL
                </Label>
                <Input
                  id="api-url"
                  type="url"
                  placeholder="https://api.your-vps.com"
                  value={draftUrl}
                  onChange={(e) => {
                    setDraftUrl(e.target.value);
                    setStatus("idle");
                  }}
                  className="mt-2 bg-background"
                  disabled={draftMode === "mock"}
                />
                {envDefault && (
                  <p className="mt-1.5 text-[11px] text-foreground/50">
                    Build default: <code className="text-foreground/70">{envDefault}</code>
                  </p>
                )}
                {draftMode === "api" && (
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={testConnection}
                      disabled={status === "checking"}
                    >
                      {status === "checking" ? "Testing…" : "Test connection"}
                    </Button>
                    {status === "ok" && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> {statusMsg}
                      </span>
                    )}
                    {status === "error" && (
                      <span className="inline-flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" /> {statusMsg}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-md border border-border bg-background/60 p-3 text-[11px] leading-relaxed text-foreground/60">
                Both modes serve the same content shape (profile, skills, services,
                projects, testimonials, contact). Editing in your DB is reflected
                here as soon as you switch to <strong>Live API</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                  onClick={apply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
