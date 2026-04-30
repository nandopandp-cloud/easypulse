import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">Página não encontrada</h1>
      <p className="text-muted-foreground">
        O endereço acessado não existe ou foi movido.
      </p>
      <Button asChild>
        <Link href="/dashboard">Ir para o painel</Link>
      </Button>
    </div>
  );
}
