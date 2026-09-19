import { useEffect, useState } from "react";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function seenKey(chapter: string) {
  return `honesty-story-${chapter}`;
}

export function useStory(chapter: string, markAfterMs = 0) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (reducedMotion() || sessionStorage.getItem(seenKey(chapter)) === "1") {
      setPlay(false);
      return;
    }
    setPlay(true);
    if (markAfterMs <= 0) {
      sessionStorage.setItem(seenKey(chapter), "1");
      return;
    }
    const id = window.setTimeout(() => sessionStorage.setItem(seenKey(chapter), "1"), markAfterMs);
    return () => window.clearTimeout(id);
  }, [chapter, markAfterMs]);

  return play;
}
