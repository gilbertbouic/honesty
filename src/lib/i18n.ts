import type { Copy, Lang } from "@/data/types";

export function t(copy: Copy, lang: Lang): string {
  return copy[lang];
}
