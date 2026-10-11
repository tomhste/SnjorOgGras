"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { business } from "@/lib/content";
import { useMagnetic } from "@/lib/useMagnetic";

gsap.registerPlugin(SplitText);

const SeasonCompareSlider = dynamic(
  () => import("@/components/SeasonCompareSlider").then((m) => m.SeasonCompareSlider),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-surface-2" />,
  }
);

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderWrapRef = useRef<HTMLDivElement>(null);
  const [callRef, callHandlers] = useMagnetic<HTMLAnchorElement>(0.25);

  useGSAP(
    () => {
      const split = titleRef.current
        ? SplitText.create(titleRef.current, {
            type: "lines",
            mask: "lines",
            linesClass: "hero-line",
          })
        : null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-label",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.5 }
      );

      if (split) {
        tl.fromTo(
          split.lines,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.09, duration: 0.8 },
          "-=0.2"
        );
      }

      tl.fromTo(
        ".hero-sub",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      )
        .fromTo(
          ".hero-cta",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          sliderWrapRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
          "-=0.6"
        );

      return () => split?.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div>
          <span className="hero-label text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            {business.location} — vetur &amp; sumar
          </span>

          <h1
            ref={titleRef}
            className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[1.25] font-medium tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            Við mokum <em className="text-accent">snjóinn</em>
            <br />
            og sláum <em className="text-accent">grasið</em>
          </h1>

          <p className="hero-sub mt-8 max-w-md text-lg text-muted">
            {business.intro}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              ref={callRef}
              onMouseMove={callHandlers.onMouseMove}
              onMouseLeave={callHandlers.onMouseLeave}
              href={business.phoneHref}
              className="hero-cta inline-flex items-center justify-center bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-contrast transition hover:brightness-110 active:scale-[0.98]"
            >
              Hringja: {business.phone}
            </a>
            <a
              href="#tilbod"
              className="hero-cta text-sm font-semibold uppercase tracking-wide underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
            >
              Fá tilboð →
            </a>
          </div>
        </div>

        <div
          ref={sliderWrapRef}
          className="mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl shadow-xl lg:max-w-none"
        >
          <SeasonCompareSlider />
        </div>
      </div>
    </section>
  );
}
