import Link from "next/link";

import { RegisterForm } from "@/app/(auth)/register/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Criar conta</h2>
        <p className="text-sm text-muted-foreground">
          Preencha os dados abaixo para começar a usar o EasyPulse.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
