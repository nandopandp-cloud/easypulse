import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, MapPin, Pencil, User } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getEvaluationForUser, STATUS_LABEL } from "@/lib/evaluations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="self-start">
          <Link href="/evaluations">
            <ArrowLeft />
            Voltar para a lista
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <RescheduleDialog
            id={evaluation.id}
            currentDatetime={evaluation.datetime.toISOString()}
          />
          <Button asChild variant="outline">
            <Link href={`/evaluations/${evaluation.id}/edit`}>
              <Pencil />
              Editar
            </Link>
          </Button>
          <DeleteEvaluationButton id={evaluation.id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{evaluation.evaluationName}</CardTitle>
              <CardDescription>{evaluation.schoolName}</CardDescription>
            </div>
            <StatusBadge status={evaluation.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
            label="Data e hora"
            value={formatDateTime(evaluation.datetime)}
          />
          <Field
            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
            label="Região"
            value={evaluation.region}
          />
          <Field
            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
            label="Local"
            value={evaluation.location}
          />
          <Field
            icon={<User className="h-4 w-4 text-muted-foreground" />}
            label="Responsável"
            value={`${evaluation.user.name} (${evaluation.user.email})`}
          />
          {evaluation.status === "RESCHEDULED" && evaluation.rescheduleReason ? (
            <div className="sm:col-span-2">
              <Separator className="my-2" />
              <p className="text-sm font-medium">Motivo do reagendamento</p>
              <p className="text-sm text-muted-foreground">
                {evaluation.rescheduleReason}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {evaluation.events.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
            <CardDescription>
              Linha do tempo das alterações desta avaliação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative ml-2 space-y-4 border-l pl-5">
              {evaluation.events.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[11px] top-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm font-medium">
                    {labelForAction(event.action)}
                    {event.toStatus ? (
                      <>
                        {" — "}
                        <span className="text-muted-foreground">
                          {event.fromStatus
                            ? `${STATUS_LABEL[event.fromStatus]} → `
                            : ""}
                          {STATUS_LABEL[event.toStatus]}
                        </span>
                      </>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(event.createdAt)} · por {event.actor.name}
                  </p>
                  {event.reason ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      “{event.reason}”
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-muted/30 p-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

function labelForAction(action: string) {
  switch (action) {
    case "CREATED":
      return "Avaliação criada";
    case "UPDATED":
      return "Dados atualizados";
    case "STATUS_CHANGED":
      return "Status alterado";
    case "RESCHEDULED":
      return "Reagendada";
    default:
      return action;
  }
}
