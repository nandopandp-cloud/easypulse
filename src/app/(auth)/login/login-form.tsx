"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { loginAction } from "@/app/actions/auth";
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
        <LogIn className="h-4 w-4" />
      )}
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(loginAction, null);

  React.useEffect(() => {
    if (state && !state.ok) toast.error(state.error);
  }, [state]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-5" noValidate>
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
          aria-describedby={fieldErrors?.email ? "email-error" : undefined}
        />
        {fieldErrors?.email && (
          <p id="email-error" className="text-xs text-destructive">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-11"
          required
          aria-invalid={Boolean(fieldErrors?.password)}
          aria-describedby={fieldErrors?.password ? "password-error" : undefined}
        />
        {fieldErrors?.password && (
          <p id="password-error" className="text-xs text-destructive">
            {fieldErrors.password[0]}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
