import { Activity } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-background to-accent/40">
      <header className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </span>
          EasyPulse
        </Link>
        <ThemeToggle />
      </header>
      <main className="container flex flex-1 items-center justify-center pb-16 pt-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
