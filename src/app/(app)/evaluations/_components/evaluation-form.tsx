"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { EvaluationStatus } from "@prisma/client";

import {
  createEvaluationAction,
  updateEvaluationAction,
} from "@/app/actions/evaluations";
import type { ActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/evaluation-status";

type EvaluationFormValues = {
  schoolName: string;
  region: string;
  location: string;
  evaluationName: string;
  datetime: string;
  status: EvaluationStatus;
  rescheduleReason: string;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar avaliação"}
    </Button>
  );
}

export function EvaluationForm({
  initial,
  evaluationId,
}: {
  initial: EvaluationFormValues;
  evaluationId?: string;
}) {
  const isEdit = Boolean(evaluationId);
  const action = isEdit
    ? updateEvaluationAction.bind(null, evaluationId!)
    : createEvaluationAction;

  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    action,
    null,
  );
  const [status, setStatus] = React.useState<EvaluationStatus>(initial.status);

  React.useEffect(() => {
    if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const requiresReason = status === EvaluationStatus.RESCHEDULED;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="evaluationName">Nome da avaliação *</Label>
          <Input
            id="evaluationName"
            name="evaluationName"
            defaultValue={initial.evaluationName}
            required
            aria-invalid={Boolean(fieldErrors?.evaluationName)}
          />
          {fieldErrors?.evaluationName ? (
            <p className="text-xs text-destructive">
              {fieldErrors.evaluationName[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolName">Escola *</Label>
          <Input
            id="schoolName"
            name="schoolName"
            defaultValue={initial.schoolName}
            required
            aria-invalid={Boolean(fieldErrors?.schoolName)}
          />
          {fieldErrors?.schoolName ? (
            <p className="text-xs text-destructive">{fieldErrors.schoolName[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Região *</Label>
          <Input
            id="region"
            name="region"
            defaultValue={initial.region}
            required
            aria-invalid={Boolean(fieldErrors?.region)}
          />
          {fieldErrors?.region ? (
            <p className="text-xs text-destructive">{fieldErrors.region[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Local *</Label>
          <Input
            id="location"
            name="location"
            placeholder="Ex.: Sala 12, Bloco B"
            defaultValue={initial.location}
            required
            aria-invalid={Boolean(fieldErrors?.location)}
          />
          {fieldErrors?.location ? (
            <p className="text-xs text-destructive">{fieldErrors.location[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="datetime">Data e hora *</Label>
          <Input
            id="datetime"
            name="datetime"
            type="datetime-local"
            defaultValue={initial.datetime}
            required
            aria-invalid={Boolean(fieldErrors?.datetime)}
          />
          {fieldErrors?.datetime ? (
            <p className="text-xs text-destructive">{fieldErrors.datetime[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            name="status"
            value={status}
            onValueChange={(v) => setStatus(v as EvaluationStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
        </div>

        {requiresReason ? (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="rescheduleReason">Motivo do reagendamento *</Label>
            <Textarea
              id="rescheduleReason"
              name="rescheduleReason"
              defaultValue={initial.rescheduleReason}
              required
              rows={4}
              maxLength={500}
              aria-invalid={Boolean(fieldErrors?.rescheduleReason)}
              placeholder="Explique brevemente o motivo do reagendamento..."
            />
            {fieldErrors?.rescheduleReason ? (
              <p className="text-xs text-destructive">
                {fieldErrors.rescheduleReason[0]}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Obrigatório quando o status for &quot;Reagendada&quot;.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button asChild type="button" variant="outline">
          <Link href={isEdit ? `/evaluations/${evaluationId}` : "/evaluations"}>
            Cancelar
          </Link>
        </Button>
      </div>
    </form>
  );
}
