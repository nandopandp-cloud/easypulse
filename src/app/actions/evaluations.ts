"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EvaluationStatus } from "@prisma/client";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluationSchema } from "@/lib/validators";
import type { ActionResult } from "@/app/actions/auth";

function parseFormData(formData: FormData) {
  const raw = {
    schoolName: formData.get("schoolName"),
    region: formData.get("region"),
    location: formData.get("location"),
    evaluationName: formData.get("evaluationName"),
    datetime: formData.get("datetime"),
    status: formData.get("status"),
    rescheduleReason: formData.get("rescheduleReason") || null,
  };
  return evaluationSchema.safeParse(raw);
}

export async function createEvaluationAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos abaixo.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  const created = await prisma.evaluation.create({
    data: {
      userId: session.sub,
      schoolName: data.schoolName,
      region: data.region,
      location: data.location,
      evaluationName: data.evaluationName,
      datetime: data.datetime,
      status: data.status,
      rescheduleReason:
        data.status === EvaluationStatus.RESCHEDULED ? data.rescheduleReason : null,
    },
  });

  await prisma.evaluationEvent.create({
    data: {
      evaluationId: created.id,
      actorId: session.sub,
      action: "CREATED",
      toStatus: created.status,
      reason: created.rescheduleReason ?? undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/evaluations");
  redirect(`/evaluations/${created.id}`);
}

export async function updateEvaluationAction(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos abaixo.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await prisma.evaluation.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Avaliação não encontrada." };
  if (session.role !== "ADMIN" && existing.userId !== session.sub) {
    return { ok: false, error: "Você não tem permissão para editar este registro." };
  }

  const data = parsed.data;
  const updated = await prisma.evaluation.update({
    where: { id },
    data: {
      schoolName: data.schoolName,
      region: data.region,
      location: data.location,
      evaluationName: data.evaluationName,
      datetime: data.datetime,
      status: data.status,
      rescheduleReason:
        data.status === EvaluationStatus.RESCHEDULED ? data.rescheduleReason : null,
    },
  });

  await prisma.evaluationEvent.create({
    data: {
      evaluationId: updated.id,
      actorId: session.sub,
      action: existing.status === updated.status ? "UPDATED" : "STATUS_CHANGED",
      fromStatus: existing.status,
      toStatus: updated.status,
      reason: updated.rescheduleReason ?? undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/evaluations");
  revalidatePath(`/evaluations/${updated.id}`);
  redirect(`/evaluations/${updated.id}`);
}

export async function deleteEvaluationAction(id: string): Promise<ActionResult> {
  const session = await requireSession();

  const existing = await prisma.evaluation.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Avaliação não encontrada." };
  if (session.role !== "ADMIN" && existing.userId !== session.sub) {
    return { ok: false, error: "Você não tem permissão para excluir este registro." };
  }

  await prisma.evaluation.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/evaluations");
  redirect("/evaluations");
}

export async function rescheduleEvaluationAction(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const existing = await prisma.evaluation.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Avaliação não encontrada." };
  if (session.role !== "ADMIN" && existing.userId !== session.sub) {
    return { ok: false, error: "Você não tem permissão para reagendar." };
  }

  const datetimeRaw = formData.get("datetime");
  const reasonRaw = (formData.get("reason") ?? "").toString().trim();

  if (!datetimeRaw) {
    return {
      ok: false,
      error: "Informe a nova data e hora.",
      fieldErrors: { datetime: ["Campo obrigatório"] },
    };
  }
  if (reasonRaw.length < 5) {
    return {
      ok: false,
      error: "Informe um motivo com pelo menos 5 caracteres.",
      fieldErrors: { reason: ["Mínimo 5 caracteres"] },
    };
  }

  const datetime = new Date(datetimeRaw.toString());
  if (Number.isNaN(datetime.getTime())) {
    return {
      ok: false,
      error: "Data/hora inválida.",
      fieldErrors: { datetime: ["Valor inválido"] },
    };
  }

  const updated = await prisma.evaluation.update({
    where: { id },
    data: {
      datetime,
      status: EvaluationStatus.RESCHEDULED,
      rescheduleReason: reasonRaw,
    },
  });

  await prisma.evaluationEvent.create({
    data: {
      evaluationId: updated.id,
      actorId: session.sub,
      action: "RESCHEDULED",
      fromStatus: existing.status,
      toStatus: EvaluationStatus.RESCHEDULED,
      reason: reasonRaw,
      metadata: {
        previousDatetime: existing.datetime.toISOString(),
        newDatetime: datetime.toISOString(),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/evaluations");
  revalidatePath(`/evaluations/${updated.id}`);
  return { ok: true };
}
