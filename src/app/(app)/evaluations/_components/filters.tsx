"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterState = {
  q: string;
  status: string;
  region: string;
  school: string;
};

export function EvaluationsFilters({
  initial,
  statusOptions,
}: {
  initial: FilterState;
  statusOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = React.useState<FilterState>(initial);
  const [pending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const hasFilters =
    state.q || state.status !== "ALL" || state.region || state.school;

  function applyFilters(next: FilterState) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (next.q) params.set("q", next.q); else params.delete("q");
    if (next.status && next.status !== "ALL") params.set("status", next.status);
    else params.delete("status");
    if (next.region) params.set("region", next.region); else params.delete("region");
    if (next.school) params.set("school", next.school); else params.delete("school");
    startTransition(() => router.push(`/evaluations?${params.toString()}`));
  }

  function reset() {
    const empty = { q: "", status: "ALL", region: "", school: "" };
    setState(empty);
    startTransition(() => router.push("/evaluations"));
  }

  return (
    <div className="space-y-3">
      {/* Search + toggle row */}
      <div className="flex gap-2">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters(state);
          }}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Buscar avaliação, escola, região..."
            className="h-10 pl-9 pr-4"
            value={state.q}
            onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
          />
        </form>
        <Button
          type="button"
          variant={open ? "default" : "outline"}
          size="sm"
          className="h-10 gap-2"
          onClick={() => setOpen((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasFilters && (
            <span className="grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
              !
            </span>
          )}
        </Button>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 gap-1.5"
            onClick={reset}
            disabled={pending}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </Button>
        )}
      </div>

      {/* Expandable filters */}
      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters(state);
          }}
          className="fade-up grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-3"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <Select
              value={state.status}
              onValueChange={(v) => setState((s) => ({ ...s, status: v }))}
            >
              <SelectTrigger className="h-9 bg-background">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Região</p>
            <Input
              placeholder="Ex.: Zona Leste"
              className="h-9 bg-background"
              value={state.region}
              onChange={(e) => setState((s) => ({ ...s, region: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Escola</p>
            <Input
              placeholder="Ex.: EMEF Cecília"
              className="h-9 bg-background"
              value={state.school}
              onChange={(e) => setState((s) => ({ ...s, school: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 sm:col-span-3">
            <Button type="submit" size="sm" disabled={pending}>
              <Search className="h-3.5 w-3.5" />
              Aplicar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
