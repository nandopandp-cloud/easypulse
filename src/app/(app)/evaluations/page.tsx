import Link from "next/link";
import { Plus } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { listEvaluations, STATUS_OPTIONS } from "@/lib/evaluations";
import { evaluationFiltersSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { EvaluationsFilters } from "@/app/(app)/evaluations/_components/filters";
import { EvaluationsTable } from "@/app/(app)/evaluations/_components/evaluations-table";
import { Pagination } from "@/app/(app)/evaluations/_components/pagination";
import { ExportMenu } from "@/app/(app)/evaluations/_components/export-menu";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function flattenParams(searchParams: SearchParams) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") out[k] = v;
    else if (Array.isArray(v) && v.length) out[k] = v[0];
  }
  return out;
}

export default async function EvaluationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireSession();
  const filters = evaluationFiltersSchema.parse(flattenParams(searchParams));
  const { items, total, page, totalPages, pageSize } = await listEvaluations(
    session,
    filters,
  );

  const exportQuery = new URLSearchParams();
  if (filters.q) exportQuery.set("q", filters.q);
  if (filters.status && filters.status !== "ALL") exportQuery.set("status", filters.status);
  if (filters.region) exportQuery.set("region", filters.region);
  if (filters.school) exportQuery.set("school", filters.school);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Avaliações
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {session.role === "ADMIN"
              ? "Todas as avaliações da rede."
              : "Avaliações que você criou."}
            {total > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums">
                {total}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportMenu query={exportQuery.toString()} disabled={total === 0} />
          <Button asChild size="sm">
            <Link href="/evaluations/new">
              <Plus className="h-4 w-4" />
              Nova
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <EvaluationsFilters
        initial={{
          q: filters.q ?? "",
          status: filters.status ?? "ALL",
          region: filters.region ?? "",
          school: filters.school ?? "",
        }}
        statusOptions={STATUS_OPTIONS}
      />

      {/* Table */}
      <EvaluationsTable items={items} showOwnerColumn={session.role === "ADMIN"} />

      {/* Pagination */}
      <Pagination page={page} pageSize={pageSize} totalPages={totalPages} total={total} />
    </div>
  );
}
