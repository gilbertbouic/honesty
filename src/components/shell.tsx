import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { rehydrateLeague, useLeague } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "arena" as const },
  { to: "/methodology", key: "method" as const },
  { to: "/play", key: "play" as const },
  { to: "/reveal", key: "reveal" as const },
  { to: "/houses", key: "houses" as const },
  { to: "/circuits", key: "circuits" as const },
  { to: "/about", key: "about" as const },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const lang = useLeague((s) => s.lang);
  const setLang = useLeague((s) => s.setLang);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    rehydrateLeague();
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 grain" aria-hidden="true" />
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src="/brand/mkweli-mark.png"
              alt=""
              width={22}
              height={22}
              className="size-[22px] object-contain"
            />
            <span className="truncate font-display text-base tracking-tight">
              {t(UI.product, lang)}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm text-muted transition-colors duration-[var(--motion-quick)] hover:text-foreground",
                  path === item.to && "text-foreground",
                )}
              >
                {t(UI[item.key], lang)}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="h-11 min-w-11 rounded-md border border-border px-3 text-xs uppercase tracking-[0.14em] text-muted"
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            aria-label="Language"
          >
            {lang === "en" ? "FR" : "EN"}
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "shrink-0 rounded-full border border-border px-3 py-2 text-xs text-muted",
                path === item.to && "border-glass-edge text-foreground",
              )}
            >
              {t(UI[item.key], lang)}
            </Link>
          ))}
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 py-8 pb-24">{children}</main>
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted">
        <a href="https://mkweli.tech" className="text-foreground/80 hover:text-foreground">
          {t(UI.mkweli, lang)}
        </a>
        <p className="mx-auto mt-2 max-w-xl text-pretty">{t(UI.disclaimer, lang)}</p>
      </footer>
    </div>
  );
}
