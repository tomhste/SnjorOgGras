"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounted once near the root of the app. GSAP's ScrollTrigger caches each
 * trigger's start/end scroll positions when it's created — if content
 * loads or resizes afterward (web fonts swapping in, the client-only hero
 * photo slider mounting and loading its images, etc.) those cached
 * positions go stale and ScrollTrigger-gated animations can get stuck at
 * their initial state forever, even though nothing is actually broken.
 * This refreshes the calculations once everything has settled, which is
 * GSAP's own documented fix for exactly this class of bug.
 */
export function ScrollTriggerRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    // Fallback in case something else shifts layout slightly later
    // (e.g. a slow image request on a throttled connection).
    const fallback = window.setTimeout(refresh, 1500);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
