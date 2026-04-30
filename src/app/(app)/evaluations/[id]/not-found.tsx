import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Avaliação não encontrada</h1>
      <p className="text-muted-foreground">
        Ela pode ter sido removida ou você não tem permissão para visualizá-la.
      </p>
      <Button asChild>
        <Link href="/evaluations">Voltar para a lista</Link>
      </Button>
    </div>
  );
}
