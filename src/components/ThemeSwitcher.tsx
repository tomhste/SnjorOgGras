"use client";

import { useEffect, useState } from "react";
import { defaultThemeId, themes, type ThemeId } from "@/lib/themes";

const STORAGE_KEY = "snjor-og-gras-theme";

function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
}

/**
 * Floating control that lets the kids (or anyone demoing the site) switch
 * between the three visual "looks" live, with no reload. The choice is
 * remembered in localStorage so it sticks between visits.
 */
export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeId>(defaultThemeId);

  useEffect(() => {
    // Syncing component state from localStorage (an external system) after
    // mount — unavoidable here since reading it during render would cause a
    // server/client hydration mismatch on the statically exported HTML.
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && themes.some((t) => t.id === stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(stored);
      applyTheme(stored);
    }
  }, []);

  function choose(id: ThemeId) {
    setActive(id);
    applyTheme(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <div className="w-64 border border-border bg-surface p-4 shadow-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Veldu útlit
          </p>
          <div className="flex flex-col gap-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => choose(theme.id)}
                className={`flex items-center gap-3 border-l-2 px-2 py-2 text-left transition hover:bg-surface-2 ${
                  active === theme.id ? "border-accent" : "border-transparent"
                }`}
              >
                <span className="flex shrink-0 gap-0.5">
                  {theme.swatch.map((color, i) => (
                    <span
                      key={i}
                      className="block h-4 w-4"
                      style={{ background: color }}
                    />
                  ))}
                </span>
                <span>
                  <span className="block font-[family-name:var(--font-display)] text-base italic">
                    {theme.name}
                  </span>
                  <span className="block text-xs text-muted">{theme.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 border border-border bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] shadow-lg transition hover:bg-surface-2"
        aria-expanded={open}
      >
        <span className="flex gap-0.5">
          {themes
            .find((t) => t.id === active)
            ?.swatch.map((color, i) => (
              <span key={i} className="block h-3 w-3" style={{ background: color }} />
            ))}
        </span>
        Útlit
      </button>
    </div>
  );
}
