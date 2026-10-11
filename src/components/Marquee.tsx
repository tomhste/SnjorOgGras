"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { business } from "@/lib/content";

const ITEM = `Snjómokstur · Garðsláttur · ${business.location} · Sími ${business.phone} · `;

/**
 * Infinite-scrolling ticker banner. Two identical copies of the content sit
 * side by side and GSAP tweens the wrapper left by exactly one copy's width
 * on a seamless loop, so it never visibly "jumps".
 */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    gsap.to(track, {
      x: -halfWidth,
      duration: halfWidth / 60,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const content = ITEM.repeat(6);

  return (
    <div className="overflow-hidden border-y border-border py-4">
      <div ref={trackRef} className="flex w-max whitespace-nowrap">
        <span className="px-2 font-[family-name:var(--font-display)] text-lg italic text-muted">
          {content}
        </span>
        <span
          className="px-2 font-[family-name:var(--font-display)] text-lg italic text-muted"
          aria-hidden
        >
          {content}
        </span>
      </div>
    </div>
  );
}
