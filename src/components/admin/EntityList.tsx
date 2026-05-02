import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { adminApi } from "@/lib/admin-api";
import type { ModelDef } from "@/lib/admin-models";
import { EntityEditor } from "./EntityEditor";

type Row = Record<string, unknown> & { id?: string };

interface Props {
  model: ModelDef;
}

function preview(value: unknown, max = 80): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ").slice(0, max);
  const s = String(value);
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

export function EntityList({ model }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.list<Row>(model.slug);
      setRows(data);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [model.slug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleSubmit = async (data: Row) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editing?.id) {
        await adminApi.update(model.slug, editing.id, data);
      } else {
        await adminApi.create(model.slug, data);
      }
      setEditing(null);
      setCreating(false);
      await refresh();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item permanently?")) return;
    setDeletingId(id);
    try {
      await adminApi.remove(model.slug, id);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const dialogOpen = creating || editing !== null;
  const closeDialog = () => {
    if (submitting) return;
    setCreating(false);
    setEditing(null);
    setSubmitError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">{model.label}</h2>
          <p className="text-xs text-foreground/60">
            {loading ? "Loading…" : `${rows.length} item${rows.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {model.canCreate && (
          <Button
            size="sm"
            onClick={() => {
              setCreating(true);
              setSubmitError(null);
            }}
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> New
          </Button>
        )}
      </div>

      {loadError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-foreground/50">
          No items yet.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {rows.map((row) => {
            const id = String(row.id ?? "");
            const title = preview(row[model.titleField], 60) || id;
            const subtitle = model.subtitleField
              ? preview(row[model.subtitleField], 80)
              : null;
            const img = model.imageField
              ? (row[model.imageField] as string | null | undefined)
              : null;
            return (
              <li
                key={id}
                className="flex items-center gap-4 p-3 hover:bg-surface-2/50"
              >
                {model.imageField && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
                    {img ? (
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="h-4 w-4 text-foreground/30" />
                    )}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{title}</div>
                  {subtitle && (
                    <div className="truncate text-xs text-foreground/55">
                      {subtitle}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(row);
                      setSubmitError(null);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {model.canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(id)}
                      disabled={deletingId === id}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      {deletingId === id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${model.label.replace(/s$/, "")}` : `New ${model.label.replace(/s$/, "")}`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Changes are saved directly to the live backend.
            </DialogDescription>
          </DialogHeader>
          <EntityEditor
            model={model}
            initial={editing}
            submitting={submitting}
            error={submitError}
            onSubmit={handleSubmit}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
