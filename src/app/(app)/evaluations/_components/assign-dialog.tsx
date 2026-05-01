"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, UserCheck, ChevronDown, Search, X } from "lucide-react";
import { toast } from "sonner";

import { assignEvaluationsAction, listSchoolsByState } from "@/app/actions/assign";
import type { ActionResult } from "@/app/actions/auth";
import { BR_STATES } from "@/lib/br-states";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type User = { id: string; name: string; email: string };

function SubmitButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || count === 0} className="min-w-[180px]">
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <UserCheck className="h-4 w-4" />
      )}
      {pending
        ? "Atribuindo..."
        : count === 1
          ? "Atribuir avaliação"
          : `Atribuir ${count} avaliações`}
    </Button>
  );
}

export function AssignDialog({
  selectedIds,
  users,
  onSuccess,
  trigger,
}: {
  selectedIds: string[];
  users: User[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    assignEvaluationsAction,
    null,
  );

  // State / school / user selection
  const [selectedState, setSelectedState] = React.useState("");
  const [schools, setSchools] = React.useState<string[]>([]);
  const [loadingSchools, setLoadingSchools] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState("");
  const [userSearch, setUserSearch] = React.useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  async function handleStateChange(uf: string) {
    setSelectedState(uf);
    setSelectedSchool("");
    setSchools([]);
    if (!uf) return;
    setLoadingSchools(true);
    try {
      const list = await listSchoolsByState(uf);
      setSchools(list);
    } finally {
      setLoadingSchools(false);
    }
  }

  React.useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(
        selectedIds.length === 1
          ? "Avaliação atribuída com sucesso."
          : `${selectedIds.length} avaliações atribuídas com sucesso.`,
      );
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error(state.error);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      setSelectedState("");
      setSchools([]);
      setSelectedSchool("");
      setSelectedUser("");
      setUserSearch("");
    }
  }

  const selectedUserObj = users.find((u) => u.id === selectedUser);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" disabled={selectedIds.length === 0}>
            <UserCheck className="h-4 w-4" />
            Atribuir
            {selectedIds.length > 0 && (
              <span className="ml-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {selectedIds.length}
              </span>
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
              <UserCheck className="h-4 w-4 text-primary" />
            </span>
            Atribuir avaliações
          </DialogTitle>
          <DialogDescription className="mt-1">
            {selectedIds.length === 1
              ? "Selecione o estado, escola e usuário responsável pela avaliação."
              : `Atribuindo ${selectedIds.length} avaliações selecionadas para um usuário.`}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="divide-y">
          {/* Hidden ids */}
          {selectedIds.map((id) => (
            <input key={id} type="hidden" name="evaluationIds" value={id} />
          ))}

          <div className="space-y-5 px-6 py-5">
            {/* Step 1 — Estado */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  1
                </span>
                Estado
              </Label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o estado..." />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {BR_STATES.map((s) => (
                    <SelectItem key={s.uf} value={s.uf}>
                      <span className="font-mono text-xs text-muted-foreground">
                        {s.uf}
                      </span>
                      <span className="ml-2">{s.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 2 — Escola */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                    selectedState
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  2
                </span>
                Escola
                {loadingSchools && (
                  <Loader2 className="ml-1 h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </Label>
              <Select
                value={selectedSchool}
                onValueChange={setSelectedSchool}
                disabled={!selectedState || loadingSchools}
                name="school"
              >
                <SelectTrigger className="h-10">
                  <SelectValue
                    placeholder={
                      !selectedState
                        ? "Selecione o estado primeiro"
                        : loadingSchools
                          ? "Carregando escolas..."
                          : schools.length === 0
                            ? "Nenhuma escola neste estado"
                            : "Selecione a escola..."
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedState && !loadingSchools && schools.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhuma avaliação cadastrada para este estado. A atribuição
                  continuará sem filtro de escola.
                </p>
              )}
            </div>

            {/* Step 3 — Usuário */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  3
                </span>
                Usuário responsável
              </Label>

              <input type="hidden" name="userId" value={selectedUser} />

              {/* Search box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  className="h-9 pl-8 text-sm"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => setUserSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* User list */}
              <div className="max-h-44 overflow-y-auto rounded-lg border bg-background">
                {filteredUsers.length === 0 ? (
                  <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                    Nenhum usuário encontrado.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        setSelectedUser((prev) => (prev === user.id ? "" : user.id))
                      }
                      className={cn(
                        "flex w-full items-center gap-3 border-b px-3 py-2.5 text-left text-sm last:border-0 transition-colors hover:bg-muted/60",
                        selectedUser === user.id && "bg-primary/8",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                          selectedUser === user.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {user.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0]?.toUpperCase())
                          .join("")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium leading-tight">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {selectedUser === user.id && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {selectedUserObj && (
                <p className="text-xs text-muted-foreground">
                  Selecionado:{" "}
                  <span className="font-medium text-foreground">
                    {selectedUserObj.name}
                  </span>{" "}
                  · {selectedUserObj.email}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" size="sm">
                Cancelar
              </Button>
            </DialogClose>
            <SubmitButton count={selectedIds.length} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
