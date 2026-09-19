import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { UI } from "@/data/copy";
import type { HouseRecord, Lang } from "@/data/types";
import { HONEST_LINE, honestPayload } from "@/lib/honest-mark";
import { t } from "@/lib/i18n";

type Props = {
  house: HouseRecord;
  lang: Lang;
};

export function HonestQr({ house, lang }: Props) {
  const [svg, setSvg] = useState<string>("");
  const payload = honestPayload(house);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toString(payload, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#18241f", light: "#f7f3ea" },
    }).then((out) => {
      if (!cancelled) setSvg(out);
    });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  return (
    <aside className="notice mt-8 max-w-sm rounded-xl p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
        {t(UI.honestMark, lang)}
      </p>
      <p className="mt-2 font-display text-xl leading-snug">{HONEST_LINE}</p>
      <div
        className="mt-4 size-40 [&_svg]:size-full"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      />
      <p className="mt-3 font-mono text-sm tabular-nums">
        {house.handle} · {house.points} HP
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{t(UI.honestHint, lang)}</p>
    </aside>
  );
}
