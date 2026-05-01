import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  Pencil,
  User,
  Building2,
  Clock,
} from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getEvaluationForUser, STATUS_LABEL } from "@/lib/evaluations";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { RescheduleDialog } from "@/app/(app)/evaluations/[id]/_components/reschedule-dialog";
import { DeleteEvaluationButton } from "@/app/(app)/evaluations/[id]/_components/delete-button";

export const dynamic = "force-dynamic";

export default async function EvaluationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireSession();
  const evaluation = await getEvaluationForUser(session, params.id);
  if (!evaluation) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2 self-start gap-1.5">
          <Link href="/evaluations">
            <ArrowLeft className="h-4 w-4" />
            Avaliações
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <RescheduleDialog
            id={evaluation.id}
            currentDatetime={evaluation.datetime.toISOString()}
          />
          <Button asChild variant="outline" size="sm">
            <Link href={`/evaluations/${evaluation.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeleteEvaluationButton id={evaluation.id} />
        </div>
      </div>

      {/* Hero card */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Header stripe */}
        <div className="border-b bg-muted/30 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Avaliação
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight">
                {evaluation.evaluationName}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {evaluation.schoolName}
              </p>
            </div>
            <StatusBadge status={evaluation.status} />
          </div>
        </div>

        {/* Fields grid */}
        <div className="grid gap-px bg-border sm:grid-cols-2">
          <Field
            icon={CalendarClock}
            label="Data e hora"
            value={formatDateTime(evaluation.datetime)}
          />
          <Field
            icon={Building2}
            label="Escola"
            value={evaluation.schoolName}
          />
          <Field
            icon={MapPin}
            label="Região"
            value={evaluation.region}
          />
          <Field
            icon={MapPin}
            label="Local"
            value={evaluation.location}
          />
          <Field
            icon={User}
            label="Responsável"
            value={evaluation.user.name}
            sub={evaluation.user.email}
          />
          <Field
            icon={Clock}
            label="Criada em"
            value={formatDateTime(evaluation.createdAt)}
          />
        </div>

        {/* Reschedule reason */}
        {evaluation.status === "RESCHEDULED" && evaluation.rescheduleReason && (
          <div className="border-t bg-amber-50/60 px-6 py-4 dark:bg-amber-500/5">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Motivo do reagendamento
            </p>
            <p className="mt-1 text-sm text-foreground">
              {evaluation.rescheduleReason}
            </p>
          </div>
        )}
      </div>

      {/* History timeline */}
      {evaluation.events.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Histórico</h2>
            <p className="text-sm text-muted-foreground">
              Linha do tempo das alterações desta avaliação.
            </p>
          </div>
          <div className="px-6 py-5">
            <ol className="space-y-5">
              {evaluation.events.map((event, i) => (
                <li key={event.id} className="relative flex gap-4">
                  {/* Line */}
                  {i < evaluation.events.length - 1 && (
                    <span className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
                  )}
                  <span className="relative mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-primary/30 bg-primary/10">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium leading-tight">
                      {labelForAction(event.action)}
                      {event.toStatus && (
                        <span className="ml-2 text-muted-foreground font-normal">
                          {event.fromStatus
                            ? `${STATUS_LABEL[event.fromStatus]} → `
                            : ""}
                          {STATUS_LABEL[event.toStatus]}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)} · {event.actor.name}
                    </p>
                    {event.reason && (
                      <p className="mt-1.5 rounded-lg bg-muted/50 px-3 py-2 text-xs italic text-muted-foreground">
                        &ldquo;{event.reason}&rdquo;
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-card px-6 py-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function labelForAction(action: string) {
  const map: Record<string, string> = {
    CREATED: "Avaliação criada",
    UPDATED: "Dados atualizados",
    STATUS_CHANGED: "Status alterado",
    RESCHEDULED: "Reagendada",
  };
  return map[action] ?? action;
}
