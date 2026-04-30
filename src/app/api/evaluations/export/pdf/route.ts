import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { requireSession } from "@/lib/auth";
import { listAllEvaluationsForExport, STATUS_LABEL } from "@/lib/evaluations";
import { evaluationFiltersSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const filters = evaluationFiltersSchema.parse(params);
  const items = await listAllEvaluationsForExport(session, filters);

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EasyPulse — Relatório de Avaliações", 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(
    `Gerado em ${generatedAt} · ${items.length} registro(s) · Usuário: ${session.name}`,
    40,
    58,
  );

  const filterLabels: string[] = [];
  if (filters.q) filterLabels.push(`busca: "${filters.q}"`);
  if (filters.status && filters.status !== "ALL")
    filterLabels.push(`status: ${STATUS_LABEL[filters.status]}`);
  if (filters.region) filterLabels.push(`região: ${filters.region}`);
  if (filters.school) filterLabels.push(`escola: ${filters.school}`);
  if (filterLabels.length) {
    doc.text(`Filtros: ${filterLabels.join(" · ")}`, 40, 74);
  }

  autoTable(doc, {
    startY: filterLabels.length ? 90 : 76,
    head: [
      [
        "Avaliação",
        "Escola",
        "Região",
        "Local",
        "Data e hora",
        "Status",
        "Responsável",
      ],
    ],
    body: items.map((ev) => [
      ev.evaluationName,
      ev.schoolName,
      ev.region,
      ev.location,
      new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(ev.datetime),
      STATUS_LABEL[ev.status],
      ev.user.name,
    ]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
    alternateRowStyles: { fillColor: [243, 244, 246] },
    margin: { left: 40, right: 40 },
  });

  const buffer = Buffer.from(doc.output("arraybuffer"));
  const filename = `avaliacoes-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
