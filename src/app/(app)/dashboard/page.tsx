import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Repeat,
} from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/evaluations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const metrics = await getDashboardMetrics(session);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Olá, {session.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            {session.role === "ADMIN"
              ? "Visão consolidada de todas as escolas e regiões."
              : "Suas avaliações de pulso em um só lugar."}
          </p>
        </div>
        <Button asChild>
          <Link href="/evaluations/new">Nova avaliação</Link>
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de avaliações"
          value={metrics.total}
          description={
            session.role === "ADMIN"
              ? "Em toda a rede"
              : "Vinculadas à sua conta"
          }
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Concluídas"
          value={metrics.statusMap.COMPLETED}
          description={`${metrics.completedPct}% do total`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Reagendadas"
          value={metrics.statusMap.RESCHEDULED}
          description={`${metrics.rescheduledPct}% do total`}
          icon={<Repeat className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Em andamento"
          value={metrics.statusMap.IN_PROGRESS}
          description={`${metrics.statusMap.SCHEDULED} agendadas`}
          icon={<CalendarClock className="h-5 w-5 text-blue-500" />}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Próximas avaliações</CardTitle>
          <CardDescription>
            As 5 avaliações mais próximas dentro do seu escopo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.upcoming.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma avaliação agendada por enquanto.
              </p>
              <Button asChild variant="outline">
                <Link href="/evaluations/new">Agendar primeira avaliação</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {metrics.upcoming.map((ev) => (
                <li key={ev.id}>
                  <Link
                    href={`/evaluations/${ev.id}`}
                    className="flex flex-col gap-2 py-3 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{ev.evaluationName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {ev.schoolName} · {ev.region}
                        {session.role === "ADMIN" ? ` · ${ev.user.name}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatDateTime(ev.datetime)}
                      </span>
                      <StatusBadge status={ev.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
