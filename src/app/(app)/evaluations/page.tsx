import Link from "next/link";
import { Plus } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { listEvaluations, STATUS_OPTIONS } from "@/lib/evaluations";
import { evaluationFiltersSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  if (filters.status && filters.status !== "ALL")
    exportQuery.set("status", filters.status);
  if (filters.region) exportQuery.set("region", filters.region);
  if (filters.school) exportQuery.set("school", filters.school);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Avaliações
          </h1>
          <p className="text-muted-foreground">
            {session.role === "ADMIN"
              ? "Todas as avaliações da rede educacional."
              : "Avaliações que você criou."}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportMenu query={exportQuery.toString()} disabled={total === 0} />
          <Button asChild>
            <Link href="/evaluations/new">
              <Plus />
              Nova avaliação
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Refine sua busca por status, região, escola ou texto livre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EvaluationsFilters
            initial={{
              q: filters.q ?? "",
              status: filters.status ?? "ALL",
              region: filters.region ?? "",
              school: filters.school ?? "",
            }}
            statusOptions={STATUS_OPTIONS}
          />
        </CardContent>
      </Card>

      <EvaluationsTable
        items={items}
        showOwnerColumn={session.role === "ADMIN"}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
