"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/evaluations", label: "Avaliações", icon: ClipboardList },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "sidebar-item group relative",
        active
          ? "bg-sidebar-muted text-sidebar-foreground"
          : "text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-accent" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-sidebar-accent" : "group-hover:text-sidebar-foreground",
        )}
      />
      {label}
    </Link>
  );
}

export function AppShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-background">
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sidebar-accent">
            <Activity className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            EasyPulse
          </span>
          <Badge
            variant="secondary"
            className="ml-auto bg-sidebar-muted text-[10px] text-sidebar-muted-foreground"
          >
            {session.role === "ADMIN" ? "Admin" : "User"}
          </Badge>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted-foreground">
            Menu
          </p>
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={active}
              />
            );
          })}

          <div className="my-2 border-t border-sidebar-border" />
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted-foreground">
            Ações
          </p>
          <Link
            href="/evaluations/new"
            className={cn(
              "sidebar-item",
              pathname === "/evaluations/new"
                ? "bg-sidebar-accent text-white"
                : "bg-sidebar-accent/10 text-sidebar-accent hover:bg-sidebar-accent hover:text-white",
            )}
          >
            <Plus className="h-4 w-4" />
            Nova avaliação
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-muted text-xs font-semibold text-sidebar-foreground">
              {initials(session.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {session.name}
              </p>
              <p className="truncate text-[10px] text-sidebar-muted-foreground">
                {session.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1">
            <ThemeToggle />
            <form action={logoutAction} className="flex-1">
              <button
                type="submit"
                className="sidebar-item w-full text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-60">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-sm font-semibold">EasyPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials(session.name)}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="page-enter mx-auto max-w-5xl">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur md:hidden">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/evaluations/new"
            className="flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium text-muted-foreground transition-colors"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary">
              <Plus className="h-3.5 w-3.5 text-white" />
            </span>
            Novo
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium text-muted-foreground"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </form>
        </nav>

        {/* Mobile bottom padding to avoid nav overlap */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
