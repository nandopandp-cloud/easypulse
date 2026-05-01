import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  Repeat2,
} from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/evaluations";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const metrics = await getDashboardMetrics(session);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {session.role === "ADMIN" ? "Visão geral da rede" : "Seu painel"}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">
            Olá, {session.name.split(" ")[0]}
          </h1>
        </div>
        <Button asChild size="sm">
          <Link href="/evaluations/new">
            Nova avaliação
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Metric cards */}
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total"
          value={metrics.total}
          sub={session.role === "ADMIN" ? "em toda a rede" : "suas avaliações"}
          icon={ClipboardList}
          color="blue"
        />
        <MetricCard
          label="Concluídas"
          value={metrics.statusMap.COMPLETED}
          sub={`${metrics.completedPct}% do total`}
          icon={CheckCircle2}
          color="green"
          pct={metrics.completedPct}
        />
        <MetricCard
          label="Reagendadas"
          value={metrics.statusMap.RESCHEDULED}
          sub={`${metrics.rescheduledPct}% do total`}
          icon={Repeat2}
          color="amber"
          pct={metrics.rescheduledPct}
        />
        <MetricCard
          label="Em andamento"
          value={metrics.statusMap.IN_PROGRESS}
          sub={`${metrics.statusMap.SCHEDULED} agendadas`}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Upcoming */}
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold">Próximas avaliações</h2>
            <p className="text-sm text-muted-foreground">
              As mais próximas dentro do seu escopo de acesso.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link href="/evaluations">
              Ver todas <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {metrics.upcoming.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <CalendarClock className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium">Nenhuma avaliação agendada</p>
              <p className="text-sm text-muted-foreground">
                Crie a primeira para começar.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/evaluations/new">Criar agora</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {metrics.upcoming.map((ev, i) => (
              <li
                key={ev.id}
                className="fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link
                  href={`/evaluations/${ev.id}`}
                  className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
                      <CalendarClock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium leading-tight group-hover:text-primary">
                        {ev.evaluationName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {ev.schoolName} · {ev.region}
                        {session.role === "ADMIN" ? ` · ${ev.user.name}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                      {formatDateTime(ev.datetime)}
                    </span>
                    <StatusBadge status={ev.status} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const COLOR_MAP = {
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    icon: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  green: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    icon: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    icon: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  purple: {
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
    icon: "text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
  },
};

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  pct,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  color: keyof typeof COLOR_MAP;
  pct?: number;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
        </div>
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", c.bg)}>
          <Icon className={cn("h-5 w-5", c.icon)} />
        </span>
      </div>
      {pct !== undefined && (
        <div className="space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-700", c.bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
