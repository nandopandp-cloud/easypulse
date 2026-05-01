"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ring-focus",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-200" />
        )
      ) : (
        <Moon className="h-4 w-4 opacity-0" />
      )}
    </button>
  );
}
