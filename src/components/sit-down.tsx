import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { parseHouseName, parseMuPhone } from "@/lib/phone";
import { useLeague } from "@/lib/store";

function useLeagueHydrated() {
  const [ready, setReady] = useState(() => useLeague.persist.hasHydrated());
  useEffect(() => {
    if (useLeague.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useLeague.persist.onFinishHydration(() => setReady(true));
  }, []);
  return ready;
}

export function SitDown() {
  const hydrated = useLeagueHydrated();
  const lang = useLeague((s) => s.lang);
  const handle = useLeague((s) => s.handle);
  const sitDown = useLeague((s) => s.sitDown);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);

  if (!hydrated || handle) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const houseName = parseHouseName(name);
    const phonePrivate = parseMuPhone(phone);
    if (!houseName || !phonePrivate) {
      setError(true);
      return;
    }
    sitDown({ handle: houseName, phonePrivate });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-4 rounded-xl border border-border bg-surface/90 p-5"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{t(UI.sitDown, lang)}</p>
      <p className="max-w-xl text-sm text-foreground/90">{t(UI.sitDownLead, lang)}</p>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">{t(UI.sitDownName, lang)}</span>
        <input
          id="sit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          maxLength={40}
          className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground outline-none ring-ring focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">{t(UI.sitDownPhone, lang)}</span>
        <input
          id="sit-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="+230 5xxx xxxx"
          className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground outline-none ring-ring focus:ring-2"
        />
        <span className="mt-1 block text-xs text-muted">{t(UI.sitDownHint, lang)}</span>
      </label>
      {error ? <p className="text-sm text-danger">{t(UI.sitDownError, lang)}</p> : null}
      <Button type="submit" size="lg">
        {t(UI.sitDown, lang)}
      </Button>
    </form>
  );
}
