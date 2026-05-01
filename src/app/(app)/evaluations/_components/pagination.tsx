"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  if (total === 0) return null;

  function goTo(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`/evaluations?${params.toString()}`);
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
      <p className="text-muted-foreground">
        <span className="font-medium tabular-nums text-foreground">{start}</span>
        {" – "}
        <span className="font-medium tabular-nums text-foreground">{end}</span>
        {" de "}
        <span className="font-medium tabular-nums text-foreground">{total}</span>
        {" registros"}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          return (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              className={cn("h-8 w-8", p === page && "pointer-events-none")}
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
