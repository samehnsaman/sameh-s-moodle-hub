import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { FieldDef, ModelDef } from "@/lib/admin-models";

type Row = Record<string, unknown>;

interface Props {
  model: ModelDef;
  initial: Row | null; // null = create mode
  submitting: boolean;
  error: string | null;
  onSubmit: (data: Row) => void;
  onCancel: () => void;
}

function toIsoDateInput(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v.slice(0, 10);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return "";
}

function fromForm(field: FieldDef, raw: string | boolean | string[]): unknown {
  if (field.type === "boolean") return Boolean(raw);
  if (field.type === "number") {
    if (raw === "" || raw === null || raw === undefined) return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }
  if (field.type === "stringArray") {
    if (Array.isArray(raw)) return raw;
    return String(raw)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (field.type === "date") {
    if (!raw) return null;
    return new Date(String(raw)).toISOString();
  }
  if (raw === "" || raw === null || raw === undefined) {
    return field.required ? "" : null;
  }
  return raw;
}

function initialFormValue(field: FieldDef, value: unknown): string | boolean {
  if (field.type === "boolean") return Boolean(value);
  if (field.type === "stringArray") {
    if (Array.isArray(value)) return value.join("\n");
    return "";
  }
  if (field.type === "date") return toIsoDateInput(value);
  if (value === null || value === undefined) return "";
  return String(value);
}

export function EntityEditor({
  model,
  initial,
  submitting,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const seed: Record<string, string | boolean> = {};
    for (const f of model.fields) {
      seed[f.name] = initialFormValue(f, initial?.[f.name]);
    }
    return seed;
  });

  const update = (name: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const out: Row = {};
    for (const f of model.fields) {
      const v = fromForm(f, form[f.name] ?? "");
      // Skip empty optional values on create; send null on update so backend can clear them.
      if (v === null && !initial && !f.required) continue;
      out[f.name] = v;
    }
    onSubmit(out);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {model.fields.map((f) => (
          <div
            key={f.name}
            className={
              f.type === "textarea" || f.type === "stringArray"
                ? "sm:col-span-2"
                : ""
            }
          >
            <Label htmlFor={f.name} className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              {f.label}
              {f.required && <span className="text-destructive"> *</span>}
            </Label>

            {f.type === "textarea" || f.type === "stringArray" ? (
              <Textarea
                id={f.name}
                rows={f.rows ?? 4}
                required={f.required && !initial}
                value={String(form[f.name] ?? "")}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="mt-2 bg-background"
              />
            ) : f.type === "boolean" ? (
              <div className="mt-3 flex items-center gap-2">
                <Switch
                  id={f.name}
                  checked={Boolean(form[f.name])}
                  onCheckedChange={(v) => update(f.name, v)}
                />
                <span className="text-sm text-foreground/70">
                  {form[f.name] ? "Yes" : "No"}
                </span>
              </div>
            ) : f.type === "select" ? (
              <Select
                value={String(form[f.name] ?? "")}
                onValueChange={(v) => update(f.name, v)}
              >
                <SelectTrigger id={f.name} className="mt-2 bg-background">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {f.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={f.name}
                type={
                  f.type === "url"
                    ? "url"
                    : f.type === "email"
                      ? "email"
                      : f.type === "number"
                        ? "number"
                        : f.type === "date"
                          ? "date"
                          : "text"
                }
                required={f.required && !initial}
                value={String(form[f.name] ?? "")}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="mt-2 bg-background"
              />
            )}
            {f.help && (
              <p className="mt-1.5 text-[11px] text-foreground/50">{f.help}</p>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-gold text-gold-foreground hover:bg-gold/90"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initial ? "Save changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
