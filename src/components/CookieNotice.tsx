"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "snjor-og-gras-cookie-consent";

/**
 * A plain-language notice about the only client-side storage this site
 * uses: a localStorage key remembering which visual theme you picked.
 * There's no analytics or ad tracking, so this is intentionally short —
 * but under GDPR even "just preferences" storage deserves a clear notice
 * and an explicit accept action rather than silently assuming consent.
 *
 * Styled as a small floating card (bottom-left, so it doesn't collide
 * with the theme switcher at bottom-right) with a plain CSS slide-up
 * entrance — no animation library needed for something this simple.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="animate-cookie-in fixed bottom-4 left-4 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:bottom-6 sm:left-6">
      <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base italic">
        🍪 Vefkökur
      </p>
      <p className="mt-2 text-sm text-muted">
        Þessi vefsíða vistar aðeins eitt í vafranum þínum: hvaða útlit þú
        velur. Engin mælinga- eða auglýsingakaka er notuð.
      </p>
      <button
        type="button"
        onClick={accept}
        className="mt-4 w-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent-contrast transition hover:brightness-110"
      >
        Í lagi
      </button>
    </div>
  );
}
