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
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <UserPlus />}
      {pending ? "Criando..." : "Criar conta"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, null);

  React.useEffect(() => {
    if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(fieldErrors?.name)}
        />
        {fieldErrors?.name ? (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors?.email)}
        />
        {fieldErrors?.email ? (
          <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha (mín. 6 caracteres)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(fieldErrors?.password)}
        />
        {fieldErrors?.password ? (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
        ) : null}
      </div>
      <SubmitButton />
    </form>
  );
}
