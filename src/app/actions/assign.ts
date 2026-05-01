"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/app/actions/auth";

const assignSchema = z.object({
  evaluationIds: z.array(z.string().uuid()).min(1, "Selecione ao menos uma avaliação."),
  userId: z.string().uuid("Selecione um usuário válido."),
});

export async function assignEvaluationsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const rawIds = formData.getAll("evaluationIds");
  const parsed = assignSchema.safeParse({
    evaluationIds: rawIds,
    userId: formData.get("userId"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  const { evaluationIds, userId } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "Usuário não encontrado." };

  await prisma.evaluation.updateMany({
    where: { id: { in: evaluationIds } },
    data: { userId },
  });

  // Audit log for each
  await prisma.evaluationEvent.createMany({
    data: evaluationIds.map((evaluationId) => ({
      evaluationId,
      actorId: userId,
      action: "ASSIGNED",
      reason: `Atribuído para ${user.name} (${user.email})`,
    })),
  });

  revalidatePath("/evaluations");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function listUsersForAssign() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "USER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export async function listSchoolsByState(state: string) {
  await requireAdmin();
  if (!state) return [];
  const rows = await prisma.evaluation.findMany({
    where: { region: { contains: state, mode: "insensitive" } },
    select: { schoolName: true },
    distinct: ["schoolName"],
    orderBy: { schoolName: "asc" },
  });
  return rows.map((r) => r.schoolName);
}
