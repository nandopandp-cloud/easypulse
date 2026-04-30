import "server-only";

import { Prisma, EvaluationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/auth";
import type { EvaluationFilters } from "@/lib/validators";

export { STATUS_LABEL, STATUS_OPTIONS } from "@/lib/evaluation-status";

export function buildEvaluationsWhere(
  session: SessionPayload,
  filters: EvaluationFilters,
): Prisma.EvaluationWhereInput {
  const where: Prisma.EvaluationWhereInput = {};

  if (session.role !== "ADMIN") {
    where.userId = session.sub;
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.region) {
    where.region = { contains: filters.region, mode: "insensitive" };
  }

  if (filters.school) {
    where.schoolName = { contains: filters.school, mode: "insensitive" };
  }

  if (filters.q) {
    where.OR = [
      { schoolName: { contains: filters.q, mode: "insensitive" } },
      { evaluationName: { contains: filters.q, mode: "insensitive" } },
      { region: { contains: filters.q, mode: "insensitive" } },
      { location: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listEvaluations(
  session: SessionPayload,
  filters: EvaluationFilters,
) {
  const where = buildEvaluationsWhere(session, filters);
  const skip = (filters.page - 1) * filters.pageSize;

  const [items, total] = await Promise.all([
    prisma.evaluation.findMany({
      where,
      orderBy: [{ datetime: "desc" }, { createdAt: "desc" }],
      skip,
      take: filters.pageSize,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.evaluation.count({ where }),
  ]);

  return {
    items,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
  };
}

export async function listAllEvaluationsForExport(
  session: SessionPayload,
  filters: EvaluationFilters,
) {
  const where = buildEvaluationsWhere(session, filters);
  return prisma.evaluation.findMany({
    where,
    orderBy: [{ datetime: "desc" }, { createdAt: "desc" }],
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getEvaluationForUser(
  session: SessionPayload,
  id: string,
) {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      events: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { id: true, name: true } } },
      },
    },
  });
  if (!evaluation) return null;
  if (session.role !== "ADMIN" && evaluation.userId !== session.sub) return null;
  return evaluation;
}

export async function getDashboardMetrics(session: SessionPayload) {
  const where: Prisma.EvaluationWhereInput =
    session.role === "ADMIN" ? {} : { userId: session.sub };

  const [total, byStatus, upcoming] = await Promise.all([
    prisma.evaluation.count({ where }),
    prisma.evaluation.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
    prisma.evaluation.findMany({
      where: { ...where, datetime: { gte: new Date() } },
      orderBy: { datetime: "asc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const statusMap = Object.fromEntries(
    byStatus.map((b) => [b.status, b._count._all]),
  ) as Record<EvaluationStatus, number>;

  const completed = statusMap.COMPLETED ?? 0;
  const rescheduled = statusMap.RESCHEDULED ?? 0;

  return {
    total,
    statusMap: {
      SCHEDULED: statusMap.SCHEDULED ?? 0,
      IN_PROGRESS: statusMap.IN_PROGRESS ?? 0,
      COMPLETED: completed,
      RESCHEDULED: rescheduled,
    },
    completedPct: total ? Math.round((completed / total) * 100) : 0,
    rescheduledPct: total ? Math.round((rescheduled / total) * 100) : 0,
    upcoming,
  };
}
