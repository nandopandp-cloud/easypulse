import Link from "next/link";
import type { Evaluation, User } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
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
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-medium">Nenhuma avaliação encontrada.</p>
          <p className="text-sm text-muted-foreground">
            Ajuste os filtros ou crie sua primeira avaliação.
          </p>
          <Button asChild>
            <Link href="/evaluations/new">Nova avaliação</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {items.map((ev) => (
          <Link
            key={ev.id}
            href={`/evaluations/${ev.id}`}
            className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{ev.evaluationName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {ev.schoolName}
                </p>
              </div>
              <StatusBadge status={ev.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <dt className="text-muted-foreground">Região</dt>
              <dd className="text-right">{ev.region}</dd>
              <dt className="text-muted-foreground">Local</dt>
              <dd className="text-right">{ev.location}</dd>
              <dt className="text-muted-foreground">Data</dt>
              <dd className="text-right tabular-nums">
                {formatDateTime(ev.datetime)}
              </dd>
              {showOwnerColumn ? (
                <>
                  <dt className="text-muted-foreground">Responsável</dt>
                  <dd className="truncate text-right">{ev.user.name}</dd>
                </>
              ) : null}
            </dl>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Avaliação</th>
              <th className="px-4 py-3 font-medium">Escola</th>
              <th className="px-4 py-3 font-medium">Região</th>
              <th className="px-4 py-3 font-medium">Data e hora</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {showOwnerColumn ? (
                <th className="px-4 py-3 font-medium">Responsável</th>
              ) : null}
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((ev) => (
              <tr key={ev.id} className="hover:bg-accent/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/evaluations/${ev.id}`}
                    className="font-medium hover:underline"
                  >
                    {ev.evaluationName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{ev.location}</p>
                </td>
                <td className="px-4 py-3">{ev.schoolName}</td>
                <td className="px-4 py-3">{ev.region}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatDateTime(ev.datetime)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ev.status} />
                </td>
                {showOwnerColumn ? (
                  <td className="px-4 py-3">
                    <span className="block">{ev.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {ev.user.email}
                    </span>
                  </td>
                ) : null}
                <td className="px-4 py-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/evaluations/${ev.id}`}>Detalhes</Link>
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
