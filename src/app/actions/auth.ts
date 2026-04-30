"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

import {
  authenticateWithPassword,
  clearSessionCookie,
  hashPassword,
  setSessionCookie,
  signSession,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validators";

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: "Verifique os campos abaixo.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const user = await authenticateWithPassword(
      parsed.data.email,
      parsed.data.password,
    );
    if (!user) {
      return { ok: false, error: "E-mail ou senha incorretos." };
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);
    redirect("/dashboard");
  } catch (e) {
    if (isRedirectError(e)) throw e;
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[loginAction]", msg);
    return { ok: false, error: `Erro no servidor: ${msg}` };
  }
}

export async function registerAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: "Verifique os campos abaixo.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { ok: false, error: "Já existe uma conta com esse e-mail." };
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: { name: parsed.data.name, email, passwordHash },
    });

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);
    redirect("/dashboard");
  } catch (e) {
    if (isRedirectError(e)) throw e;
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[registerAction]", msg);
    return { ok: false, error: `Erro no servidor: ${msg}` };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
