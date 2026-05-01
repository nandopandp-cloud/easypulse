import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getEvaluationForUser } from "@/lib/evaluations";
import { Button } from "@/components/ui/button";
import { EvaluationForm } from "@/app/(app)/evaluations/_components/evaluation-form";
import { toDatetimeLocalValue } from "@/lib/utils";

export default async function EditEvaluationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireSession();
  const evaluation = await getEvaluationForUser(session, params.id);
  if (!evaluation) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
        <Link href={`/evaluations/${evaluation.id}`}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar avaliação</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {evaluation.evaluationName}
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <EvaluationForm
          evaluationId={evaluation.id}
          initial={{
            schoolName: evaluation.schoolName,
            region: evaluation.region,
            location: evaluation.location,
            evaluationName: evaluation.evaluationName,
            datetime: toDatetimeLocalValue(evaluation.datetime),
            status: evaluation.status,
            rescheduleReason: evaluation.rescheduleReason ?? "",
          }}
        />
      </div>
    </div>
  );
}
