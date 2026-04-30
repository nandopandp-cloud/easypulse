import Link from "next/link";

import { RegisterForm } from "@/app/(auth)/register/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Criar sua conta</CardTitle>
        <CardDescription>
          Comece a registrar avaliações de pulso em poucos minutos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
