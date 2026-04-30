"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteEvaluationAction } from "@/app/actions/evaluations";
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

export function DeleteEvaluationButton({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await deleteEvaluationAction(id);
      if (result && !result.ok) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir avaliação?</DialogTitle>
          <DialogDescription>
            Esta ação não poderá ser desfeita. A avaliação e seu histórico serão
            removidos permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
            type="button"
          >
            {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {pending ? "Excluindo..." : "Sim, excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
