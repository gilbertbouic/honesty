import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UI } from "@/data/copy";
import { adminIsIn, checkAdminLogin, clearStoryKeys, setAdminIn } from "@/lib/admin";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const lang = useLeague((s) => s.lang);
  const handle = useLeague((s) => s.handle);
  const answers = useLeague((s) => s.answers);
  const points = useLeague((s) => s.points);
  const clearResults = useLeague((s) => s.clearResults);
  const clearDevice = useLeague((s) => s.clearDevice);
  const [inDesk, setInDesk] = useState(() => adminIsIn());
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [note, setNote] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const ok = await checkAdminLogin(user, password);
    if (!ok) {
      setError(true);
      return;
    }
    setAdminIn(true);
    setInDesk(true);
    setError(false);
    setPassword("");
  }

  function signOut() {
    setAdminIn(false);
    setInDesk(false);
  }

  function wipeScores() {
    clearResults();
    setNote(true);
  }

  function wipeAll() {
    clearDevice();
    clearStoryKeys();
    setNote(true);
  }

  if (!inDesk) {
    return (
      <article className="mx-auto max-w-md space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.admin, lang)}</p>
        <h1 className="font-display text-3xl">{t(UI.admin, lang)}</h1>
        <form onSubmit={signIn} className="space-y-4 rounded-xl border border-border bg-surface/90 p-5">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">{t(UI.adminUser, lang)}</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 py-3 text-base outline-none ring-ring focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">{t(UI.adminPass, lang)}</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 py-3 text-base outline-none ring-ring focus:ring-2"
            />
          </label>
          {error ? <p className="text-sm text-danger">{t(UI.adminBad, lang)}</p> : null}
          <Button type="submit" size="lg">
            {t(UI.adminSignIn, lang)}
          </Button>
        </form>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-md space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.admin, lang)}</p>
      <h1 className="font-display text-3xl">{t(UI.admin, lang)}</h1>
      <p className="text-sm text-muted">{t(UI.adminLead, lang)}</p>
      <p className="text-sm">
        {t(UI.adminHouse, lang)}: <span className="font-display">{handle || t(UI.adminNone, lang)}</span>
      </p>
      <p className="font-mono text-sm tabular-nums">
        {answers.length} · {points} HP
      </p>
      {note ? <p className="text-sm text-foreground">{t(UI.adminCleared, lang)}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={wipeScores}>
          {t(UI.adminClearScores, lang)}
        </Button>
        <Button type="button" variant="outline" onClick={wipeAll}>
          {t(UI.adminClearAll, lang)}
        </Button>
      </div>
      <button type="button" className="text-sm text-muted underline-offset-4 hover:underline" onClick={signOut}>
        {t(UI.adminSignOut, lang)}
      </button>
    </article>
  );
}
