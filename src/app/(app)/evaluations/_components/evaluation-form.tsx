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
    <Button type="submit" size="lg" disabled={pending} className="min-w-[180px]">
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar avaliação"}
    </Button>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
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
    if (state && !state.ok) toast.error(state.error);
  }, [state]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const requiresReason = status === EvaluationStatus.RESCHEDULED;

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {/* Section: identification */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Identificação</h3>
          <p className="text-xs text-muted-foreground">Nome e escola da avaliação</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="evaluationName">Nome da avaliação *</Label>
            <Input
              id="evaluationName"
              name="evaluationName"
              defaultValue={initial.evaluationName}
              placeholder="Ex.: Pulso de Leitura — 5º ano"
              className="h-11"
              required
              aria-invalid={Boolean(fieldErrors?.evaluationName)}
            />
            <FieldError msg={fieldErrors?.evaluationName?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolName">Escola *</Label>
            <Input
              id="schoolName"
              name="schoolName"
              defaultValue={initial.schoolName}
              placeholder="Ex.: EMEF Monteiro Lobato"
              className="h-11"
              required
              aria-invalid={Boolean(fieldErrors?.schoolName)}
            />
            <FieldError msg={fieldErrors?.schoolName?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Região *</Label>
            <Input
              id="region"
              name="region"
              defaultValue={initial.region}
              placeholder="Ex.: Zona Leste"
              className="h-11"
              required
              aria-invalid={Boolean(fieldErrors?.region)}
            />
            <FieldError msg={fieldErrors?.region?.[0]} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Section: scheduling */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Agendamento</h3>
          <p className="text-xs text-muted-foreground">Local, data/hora e status</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <Input
              id="location"
              name="location"
              defaultValue={initial.location}
              placeholder="Ex.: Sala 12, Bloco B"
              className="h-11"
              required
              aria-invalid={Boolean(fieldErrors?.location)}
            />
            <FieldError msg={fieldErrors?.location?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="datetime">Data e hora *</Label>
            <Input
              id="datetime"
              name="datetime"
              type="datetime-local"
              defaultValue={initial.datetime}
              className="h-11"
              required
              aria-invalid={Boolean(fieldErrors?.datetime)}
            />
            <FieldError msg={fieldErrors?.datetime?.[0]} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as EvaluationStatus)}
            >
              <SelectTrigger id="status" className="h-11">
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

          {requiresReason && (
            <div className="fade-up space-y-2 sm:col-span-2">
              <Label htmlFor="rescheduleReason">Motivo do reagendamento *</Label>
              <Textarea
                id="rescheduleReason"
                name="rescheduleReason"
                defaultValue={initial.rescheduleReason}
                rows={3}
                maxLength={500}
                placeholder="Explique brevemente o motivo..."
                required
                aria-invalid={Boolean(fieldErrors?.rescheduleReason)}
              />
              <FieldError msg={fieldErrors?.rescheduleReason?.[0]} />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t pt-6">
        <SubmitButton isEdit={isEdit} />
        <Button asChild type="button" variant="outline" size="lg">
          <Link href={isEdit ? `/evaluations/${evaluationId}` : "/evaluations"}>
            Cancelar
          </Link>
        </Button>
      </div>
    </form>
  );
}
