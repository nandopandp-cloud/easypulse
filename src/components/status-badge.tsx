import { EvaluationStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/lib/evaluation-status";

const STYLES: Record<EvaluationStatus, string> = {
  SCHEDULED:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  IN_PROGRESS:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  RESCHEDULED:
    "bg-slate-50 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20",
};

const DOT: Record<EvaluationStatus, string> = {
  SCHEDULED: "bg-blue-500",
  IN_PROGRESS: "bg-amber-500",
  COMPLETED: "bg-emerald-500",
  RESCHEDULED: "bg-slate-500",
};

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        STYLES[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[status])} />
      {STATUS_LABEL[status]}
    </span>
  );
}
