import { Activity, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

const FEATURES = [
  {
    icon: CheckCircle2,
    title: "Controle completo",
    desc: "Registre e acompanhe avaliações em tempo real.",
  },
  {
    icon: TrendingUp,
    title: "Métricas inteligentes",
    desc: "Dashboards com visão consolidada por escola e região.",
  },
  {
    icon: BookOpen,
    title: "Histórico auditável",
    desc: "Cada alteração é registrada com data, hora e responsável.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      {/* ── Left panel (branding) ──────────────────── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex">
        {/* Background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sidebar-accent opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-sidebar-accent opacity-10 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-accent shadow-md">
            <Activity className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            EasyPulse
          </span>
        </Link>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              Gestão de avaliações
              <br />
              <span className="text-sidebar-accent">educacionais</span> simplificada.
            </h1>
            <p className="mt-3 text-base text-sidebar-muted-foreground">
              Acompanhe pulsos, monitore resultados e tome decisões baseadas em dados.
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-4">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sidebar-muted">
                  <f.icon className="h-4 w-4 text-sidebar-accent" />
                </span>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {f.title}
                  </p>
                  <p className="text-sm text-sidebar-muted-foreground">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer quote */}
        <p className="relative text-xs text-sidebar-muted-foreground">
          &copy; {new Date().getFullYear()} EasyPulse. Todos os direitos reservados.
        </p>
      </div>

      {/* ── Right panel (form) ────────────────────── */}
      <div className="flex flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between p-5 lg:justify-end">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold lg:hidden"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </span>
            EasyPulse
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-10 pt-4">
          <div className="fade-up w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
