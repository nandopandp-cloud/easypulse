"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  pageSize,
  totalPages,
  total,
}: {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`/evaluations?${params.toString()}`);
  }

  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
      <p className="text-muted-foreground">
        Mostrando <span className="font-medium tabular-nums">{start}</span>–
        <span className="font-medium tabular-nums">{end}</span> de{" "}
        <span className="font-medium tabular-nums">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <span className="px-2 text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
