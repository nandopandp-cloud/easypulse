import Link from "next/link";

import { LoginForm } from "@/app/(auth)/login/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Entrar na conta</h2>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta. Insira suas credenciais para continuar.
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Criar agora
        </Link>
      </p>

      <div className="rounded-xl border bg-muted/50 p-4 text-xs text-muted-foreground">
        <p className="mb-1.5 font-semibold text-foreground">Contas demo</p>
        <div className="space-y-1">
          <p>
            <span className="font-medium">Admin:</span> admin@easypulse.app ·{" "}
            <span className="font-mono">admin123</span>
          </p>
          <p>
            <span className="font-medium">Usuária:</span> ana@easypulse.app ·{" "}
            <span className="font-mono">user123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
