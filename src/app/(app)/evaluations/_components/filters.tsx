"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  function applyFilters(next: FilterState) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (next.q) params.set("q", next.q);
    else params.delete("q");
    if (next.status && next.status !== "ALL") params.set("status", next.status);
    else params.delete("status");
    if (next.region) params.set("region", next.region);
    else params.delete("region");
    if (next.school) params.set("school", next.school);
    else params.delete("school");

    startTransition(() => {
      router.push(`/evaluations?${params.toString()}`);
    });
  }

  function reset() {
    const empty = { q: "", status: "ALL", region: "", school: "" };
    setState(empty);
    startTransition(() => {
      router.push("/evaluations");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(state);
      }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
    >
      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="q">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="q"
            name="q"
            placeholder="Nome da avaliação, escola, região..."
            className="pl-9"
            value={state.q}
            onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={state.status}
          onValueChange={(value) => setState((s) => ({ ...s, status: value }))}
        >
          <SelectTrigger id="status">
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

      <div className="space-y-2">
        <Label htmlFor="region">Região</Label>
        <Input
          id="region"
          name="region"
          placeholder="Ex.: Zona Leste"
          value={state.region}
          onChange={(e) => setState((s) => ({ ...s, region: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">Escola</Label>
        <Input
          id="school"
          name="school"
          placeholder="Ex.: EMEF Cecília"
          value={state.school}
          onChange={(e) => setState((s) => ({ ...s, school: e.target.value }))}
        />
      </div>

      <div className="flex items-end gap-2 md:col-span-2 lg:col-span-5">
        <Button type="submit" disabled={pending}>
          <Search />
          Aplicar filtros
        </Button>
        <Button type="button" variant="outline" onClick={reset} disabled={pending}>
          <RotateCcw />
          Limpar
        </Button>
      </div>
    </form>
  );
}
