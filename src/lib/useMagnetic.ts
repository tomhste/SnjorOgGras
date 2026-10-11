"use client";

import { useRef } from "react";
import gsap from "gsap";

/**
 * Attach the returned `ref` + handlers to a button/link to make it "magnetic":
 * it nudges toward the cursor on hover and springs back on leave.
 * No-op on touch devices / reduced-motion, where it'd just be noise.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  function ensureQuickTo() {
    if (!ref.current) return;
    if (!quickX.current) {
      quickX.current = gsap.quickTo(ref.current, "x", {
        duration: 0.5,
        ease: "power3.out",
      });
      quickY.current = gsap.quickTo(ref.current, "y", {
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }

  function onMouseMove(e: React.MouseEvent<T>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!ref.current) return;
    ensureQuickTo();
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX.current?.(relX * strength);
    quickY.current?.(relY * strength);
  }

  function onMouseLeave() {
    ensureQuickTo();
    quickX.current?.(0);
    quickY.current?.(0);
  }

  return [ref, { onMouseMove, onMouseLeave }] as const;
}
