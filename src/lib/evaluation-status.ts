import { EvaluationStatus } from "@prisma/client";

export const STATUS_LABEL: Record<EvaluationStatus, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  RESCHEDULED: "Reagendada",
};

export const STATUS_OPTIONS = (Object.keys(STATUS_LABEL) as EvaluationStatus[]).map(
  (value) => ({ value, label: STATUS_LABEL[value] }),
);
