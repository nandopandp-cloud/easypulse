import { EvaluationStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/evaluation-status";

const VARIANT: Record<
  EvaluationStatus,
  "default" | "secondary" | "destructive" | "success" | "warning" | "info"
> = {
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  RESCHEDULED: "secondary",
};

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  return <Badge variant={VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
