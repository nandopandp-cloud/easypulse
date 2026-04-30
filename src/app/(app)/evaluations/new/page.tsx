import { EvaluationStatus } from "@prisma/client";

import { requireSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EvaluationForm } from "@/app/(app)/evaluations/_components/evaluation-form";
import { toDatetimeLocalValue } from "@/lib/utils";

export default async function NewEvaluationPage() {
  await requireSession();

  const initial = {
    schoolName: "",
    region: "",
    location: "",
    evaluationName: "",
    datetime: toDatetimeLocalValue(
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    ),
    status: EvaluationStatus.SCHEDULED,
    rescheduleReason: "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Nova avaliação
        </h1>
        <p className="text-muted-foreground">
          Registre uma avaliação de pulso preenchendo os campos abaixo.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da avaliação</CardTitle>
          <CardDescription>Campos com * são obrigatórios.</CardDescription>
        </CardHeader>
        <CardContent>
          <EvaluationForm initial={initial} />
        </CardContent>
      </Card>
    </div>
  );
}
