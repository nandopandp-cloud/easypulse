"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardList, X } from "lucide-react";
import type { Evaluation, User } from "@prisma/client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { AssignDialog } from "@/app/(app)/evaluations/_components/assign-dialog";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type EvaluationWithUser = Evaluation & {
  user: Pick<User, "id" | "name" | "email">;
};
type UserOption = { id: string; name: string; email: string };

export function EvaluationsTable({
  items,
  showOwnerColumn,
  users,
}: {
  items: EvaluationWithUser[];
  showOwnerColumn: boolean;
  users?: UserOption[];
}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const allIds = items.map((e) => e.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card py-20 text-center shadow-sm">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted">
          <ClipboardList className="h-7 w-7 text-muted-foreground/60" />
        </span>
        <div>
          <p className="font-semibold">Nenhuma avaliação encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste os filtros ou crie a primeira avaliação.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/evaluations/new">Nova avaliação</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* ── Bulk action toolbar ─────────────────────── */}
      {showOwnerColumn && someSelected && users && (
        <div className="fade-up flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-medium text-primary">
            {selected.size} {selected.size === 1 ? "selecionada" : "selecionadas"}
          </span>
          <div className="flex flex-1 items-center gap-2">
            <AssignDialog
              selectedIds={Array.from(selected)}
              users={users}
              onSuccess={clearSelection}
            />
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Limpar seleção"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Mobile cards ────────────────────────────── */}
      <div className="grid gap-2 md:hidden">
        {items.map((ev, i) => (
          <div
            key={ev.id}
            className={cn(
              "fade-up group relative flex items-center gap-3 rounded-xl border bg-card p-3.5 shadow-sm transition-all",
              selected.has(ev.id) && "border-primary/40 bg-primary/5",
            )}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {showOwnerColumn && (
              <button
                type="button"
                onClick={() => toggle(ev.id)}
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition-colors",
                  selected.has(ev.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 hover:border-primary",
                )}
                aria-label="Selecionar"
              >
                {selected.has(ev.id) && (
                  <svg viewBox="0 0 10 8" className="h-3 w-3 fill-current">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )}
            <Link
              href={`/evaluations/${ev.id}`}
              className="flex flex-1 items-center gap-3 min-w-0"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary">
                <CalendarClock className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{ev.evaluationName}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {ev.schoolName} · {ev.region}
                </p>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {formatDateTime(ev.datetime)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <StatusBadge status={ev.status} />
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:text-muted-foreground" />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ── Desktop table ────────────────────────────── */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              {showOwnerColumn && (
                <th className="w-10 px-4 py-3.5">
                  <button
                    type="button"
                    onClick={toggleAll}
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded border-2 transition-colors",
                      allSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 hover:border-primary",
                    )}
                    aria-label={allSelected ? "Desmarcar todos" : "Selecionar todos"}
                  >
                    {allSelected && (
                      <svg viewBox="0 0 10 8" className="h-3 w-3 fill-current">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {someSelected && !allSelected && (
                      <span className="block h-0.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </button>
                </th>
              )}
              {["Avaliação", "Escola", "Região", "Data e hora", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
              {showOwnerColumn && (
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Responsável
                </th>
              )}
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((ev, i) => (
              <tr
                key={ev.id}
                className={cn(
                  "fade-up group transition-colors hover:bg-muted/30",
                  selected.has(ev.id) && "bg-primary/5 hover:bg-primary/8",
                )}
                style={{ animationDelay: `${i * 25}ms` }}
              >
                {showOwnerColumn && (
                  <td className="w-10 px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggle(ev.id)}
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded border-2 transition-colors",
                        selected.has(ev.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 hover:border-primary",
                      )}
                      aria-label="Selecionar linha"
                    >
                      {selected.has(ev.id) && (
                        <svg viewBox="0 0 10 8" className="h-3 w-3 fill-current">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </td>
                )}
                <td className="px-4 py-3.5">
                  <p className="font-medium leading-tight">{ev.evaluationName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ev.location}</p>
                </td>
                <td className="px-4 py-3.5 text-sm">{ev.schoolName}</td>
                <td className="px-4 py-3.5 text-sm">{ev.region}</td>
                <td className="px-4 py-3.5 text-sm tabular-nums text-muted-foreground">
                  {formatDateTime(ev.datetime)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={ev.status} />
                </td>
                {showOwnerColumn && (
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium leading-tight">{ev.user.name}</p>
                    <p className="text-xs text-muted-foreground">{ev.user.email}</p>
                  </td>
                )}
                <td className="px-4 py-3.5 text-right">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs opacity-60 transition-opacity group-hover:opacity-100"
                  >
                    <Link href={`/evaluations/${ev.id}`}>
                      Ver
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
