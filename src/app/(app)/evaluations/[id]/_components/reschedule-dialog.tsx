"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { rescheduleEvaluationAction } from "@/app/actions/evaluations";
import type { ActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toDatetimeLocalValue } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <CalendarClock />}
      {pending ? "Salvando..." : "Reagendar"}
    </Button>
  );
}

export function RescheduleDialog({
  id,
  currentDatetime,
}: {
  id: string;
  currentDatetime: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const action = rescheduleEvaluationAction.bind(null, id);
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    action,
    null,
  );

  React.useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Avaliação reagendada com sucesso.");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <CalendarClock className="h-4 w-4" />
          Reagendar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reagendar avaliação</DialogTitle>
          <DialogDescription>
            Informe a nova data/hora e o motivo do reagendamento.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="datetime">Nova data e hora</Label>
            <Input
              id="datetime"
              name="datetime"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(currentDatetime)}
              required
              aria-invalid={Boolean(fieldErrors?.datetime)}
            />
            {fieldErrors?.datetime ? (
              <p className="text-xs text-destructive">{fieldErrors.datetime[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do reagendamento</Label>
            <Textarea
              id="reason"
              name="reason"
              rows={4}
              maxLength={500}
              required
              placeholder="Explique brevemente o motivo..."
              aria-invalid={Boolean(fieldErrors?.reason)}
            />
            {fieldErrors?.reason ? (
              <p className="text-xs text-destructive">{fieldErrors.reason[0]}</p>
            ) : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
