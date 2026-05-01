"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {pending ? "Criando conta..." : "Criar conta"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, null);

  React.useEffect(() => {
    if (state && !state.ok) toast.error(state.error);
  }, [state]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          className="h-11"
          required
          aria-invalid={Boolean(fieldErrors?.name)}
        />
        {fieldErrors?.name && (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          className="h-11"
          required
          aria-invalid={Boolean(fieldErrors?.email)}
        />
        {fieldErrors?.email && (
          <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          className="h-11"
          required
          aria-invalid={Boolean(fieldErrors?.password)}
        />
        {fieldErrors?.password && (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
