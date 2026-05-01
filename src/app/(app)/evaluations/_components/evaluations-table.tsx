import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardList } from "lucide-react";
import type { Evaluation, User } from "@prisma/client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

type EvaluationWithUser = Evaluation & {
  user: Pick<User, "id" | "name" | "email">;
};

export function EvaluationsTable({
  items,
  showOwnerColumn,
}: {
  items: EvaluationWithUser[];
  showOwnerColumn: boolean;
}) {
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
    <>
      {/* ── Mobile cards ────────────────────────────── */}
      <div className="grid gap-2.5 md:hidden">
        {items.map((ev, i) => (
          <Link
            key={ev.id}
            href={`/evaluations/${ev.id}`}
            className="group fade-up flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary">
                <CalendarClock className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{ev.evaluationName}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {ev.schoolName} · {ev.region}
                </p>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {formatDateTime(ev.datetime)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <StatusBadge status={ev.status} />
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Desktop table ────────────────────────────── */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Avaliação
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Escola
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Região
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Data e hora
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              {showOwnerColumn && (
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Responsável
                </th>
              )}
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((ev, i) => (
              <tr
                key={ev.id}
                className="group fade-up transition-colors hover:bg-muted/30"
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <td className="px-5 py-4">
                  <p className="font-medium leading-tight">{ev.evaluationName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ev.location}</p>
                </td>
                <td className="px-5 py-4 text-sm">{ev.schoolName}</td>
                <td className="px-5 py-4 text-sm">{ev.region}</td>
                <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                  {formatDateTime(ev.datetime)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={ev.status} />
                </td>
                {showOwnerColumn && (
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium">{ev.user.name}</p>
                    <p className="text-xs text-muted-foreground">{ev.user.email}</p>
                  </td>
                )}
                <td className="px-5 py-4 text-right">
                  <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
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
    </>
  );
}
