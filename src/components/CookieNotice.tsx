"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "snjor-og-gras-cookie-consent";

/**
 * A plain-language notice about the only client-side storage this site
 * uses: a localStorage key remembering which visual theme you picked.
 * There's no analytics or ad tracking, so this is intentionally short —
 * but under GDPR even "just preferences" storage deserves a clear notice
 * and an explicit accept action rather than silently assuming consent.
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
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-surface px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted">
          Þessi vefsíða notar localStorage í vafranum þínum til að muna
          hvaða útlit þú velur — ekkert annað er vistað og engin
          mælingar-/auglýsingakaka er notuð.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 self-start bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent-contrast transition hover:brightness-110 sm:self-auto"
        >
          Í lagi
        </button>
      </div>
    </div>
  );
}
