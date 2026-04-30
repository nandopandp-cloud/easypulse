import { NextRequest, NextResponse } from "next/server";

import { requireSession } from "@/lib/auth";
import { listAllEvaluationsForExport, STATUS_LABEL } from "@/lib/evaluations";
import { evaluationFiltersSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

function toCsvCell(value: string | null | undefined) {
  const v = (value ?? "").toString();
  if (/[",\n;]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const filters = evaluationFiltersSchema.parse(params);

  const items = await listAllEvaluationsForExport(session, filters);

  const header = [
    "Avaliação",
    "Escola",
    "Região",
    "Local",
    "Data e hora",
    "Status",
    "Motivo do reagendamento",
    "Responsável",
    "E-mail responsável",
    "Criada em",
  ];

  const rows = items.map((ev) => [
    ev.evaluationName,
    ev.schoolName,
    ev.region,
    ev.location,
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(ev.datetime),
    STATUS_LABEL[ev.status],
    ev.rescheduleReason ?? "",
    ev.user.name,
    ev.user.email,
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(ev.createdAt),
  ]);

  const csv = [header, ...rows]
    .map((cols) => cols.map(toCsvCell).join(","))
    .join("\n");

  const body = `﻿${csv}`;
  const filename = `avaliacoes-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
