import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EvaluationStatus } from "@prisma/client";

import { requireSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { EvaluationForm } from "@/app/(app)/evaluations/_components/evaluation-form";
import { toDatetimeLocalValue } from "@/lib/utils";

export default async function NewEvaluationPage() {
  await requireSession();

  const initial = {
    schoolName: "",
    region: "",
    location: "",
    evaluationName: "",
    datetime: toDatetimeLocalValue(new Date(Date.now() + 1000 * 60 * 60 * 24)),
    status: EvaluationStatus.SCHEDULED,
    rescheduleReason: "",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
        <Link href="/evaluations">
          <ArrowLeft className="h-4 w-4" />
          Avaliações
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova avaliação</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Registre uma avaliação de pulso preenchendo os campos abaixo.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <EvaluationForm initial={initial} />
      </div>
    </div>
  );
}
