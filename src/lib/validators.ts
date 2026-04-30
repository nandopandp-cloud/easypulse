import { z } from "zod";
import { EvaluationStatus } from "@prisma/client";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres"),
});

export const evaluationStatusEnum = z.nativeEnum(EvaluationStatus);

export const evaluationSchema = z
  .object({
    schoolName: z.string().min(2, "Informe o nome da escola"),
    region: z.string().min(2, "Informe a região"),
    location: z.string().min(2, "Informe o local"),
    evaluationName: z.string().min(2, "Informe o nome da avaliação"),
    datetime: z.coerce.date({ invalid_type_error: "Data e hora inválidas" }),
    status: evaluationStatusEnum,
    rescheduleReason: z
      .string()
      .max(500, "Motivo muito longo (máx. 500 caracteres)")
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === EvaluationStatus.RESCHEDULED) {
      const reason = data.rescheduleReason?.trim();
      if (!reason || reason.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rescheduleReason"],
          message: "Informe o motivo do reagendamento (mín. 5 caracteres)",
        });
      }
    }
  });

export type EvaluationInput = z.infer<typeof evaluationSchema>;

export const evaluationFiltersSchema = z.object({
  q: z.string().trim().optional(),
  status: z
    .union([evaluationStatusEnum, z.literal("ALL")])
    .optional()
    .default("ALL"),
  region: z.string().trim().optional().default(""),
  school: z.string().trim().optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(5).max(100).optional().default(10),
});

export type EvaluationFilters = z.infer<typeof evaluationFiltersSchema>;
