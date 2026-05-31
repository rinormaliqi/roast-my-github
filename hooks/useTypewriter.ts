"use client";

import { useState, useEffect } from "react";

interface TypewriterResult {
  /** The progressively-revealed string */
  displayed: string;
  /** True once every character has been output */
  isDone: boolean;
}

/**
 * Reveals `text` one character at a time, like ink being written on paper.
 *
 * Speed is adaptive: targets roughly 2.5–3 s total for any length of text,
 * clamped to a min of 8 ms/char (very fast) and max of 30 ms/char (slow pen).
 */
export function useTypewriter(text: string): TypewriterResult {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setIsDone(false);
      return;
    }

    setDisplayed("");
    setIsDone(false);

    const TOTAL_MS = 2800;
    const speedMs = Math.min(30, Math.max(8, TOTAL_MS / text.length));

    let i = 0;

    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(id);
        setIsDone(true);
      }
    }, speedMs);

    return () => clearInterval(id);
  }, [text]);

  return { displayed, isDone };
}
