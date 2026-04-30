import Link from "next/link";

import { LoginForm } from "@/app/(auth)/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Entrar no EasyPulse</CardTitle>
        <CardDescription>
          Acompanhe e gerencie avaliações de pulso da sua rede educacional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Crie agora
          </Link>
        </p>
        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium">Contas de demonstração</p>
          <p>Admin: admin@easypulse.app · admin123</p>
          <p>Usuária: ana@easypulse.app · user123</p>
        </div>
      </CardContent>
    </Card>
  );
}
