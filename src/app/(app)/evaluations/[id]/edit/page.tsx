import { notFound } from "next/navigation";
import Link from "next/link";

import { requireSession } from "@/lib/auth";
import { getEvaluationForUser } from "@/lib/evaluations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationForm } from "@/app/(app)/evaluations/_components/evaluation-form";
import { toDatetimeLocalValue } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default async function EditEvaluationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireSession();
  const evaluation = await getEvaluationForUser(session, params.id);
  if (!evaluation) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/evaluations/${evaluation.id}`}>
          <ArrowLeft />
          Voltar para a avaliação
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Editar avaliação
        </h1>
        <p className="text-muted-foreground">{evaluation.evaluationName}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da avaliação</CardTitle>
          <CardDescription>
            Atualize as informações desta avaliação.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
