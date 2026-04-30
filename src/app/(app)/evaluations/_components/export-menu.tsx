"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ExportMenu({
  query,
  disabled,
}: {
  query: string;
  disabled?: boolean;
}) {
  const csvHref = `/api/evaluations/export/csv${query ? `?${query}` : ""}`;
  const pdfHref = `/api/evaluations/export/pdf${query ? `?${query}` : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Download />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={csvHref} download>
            <FileSpreadsheet className="h-4 w-4" />
            Exportar como CSV
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={pdfHref} target="_blank" rel="noreferrer">
            <FileText className="h-4 w-4" />
            Exportar como PDF
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
