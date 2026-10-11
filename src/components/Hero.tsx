"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { business } from "@/lib/content";
import { HeroIllustration, SNOWFLAKE_PATH, SUN_PATH } from "@/components/HeroIllustration";
import { useMagnetic } from "@/lib/useMagnetic";

gsap.registerPlugin(SplitText, MorphSVGPlugin);

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const illustrationRef = useRef<SVGSVGElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const seasonTl = useRef<gsap.core.Timeline | null>(null);
  const [callRef, callHandlers] = useMagnetic<HTMLAnchorElement>(0.25);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

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
          illustrationRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
          "-=0.6"
        );

      // --- The interactive bit: a season timeline you can scrub ---
      // The centerpiece: one path literally morphs point-for-point from a
      // snowflake into a sun as the slider moves from 0 to 100 — a real
      // shape transformation, not just a cross-fade between two icons.
      // Snow/grass/glow stay on the earlier split-at-50% pattern so the
      // "Bæði" midpoint still reads as "both seasons, fully present".
      const seasonTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
      });
      seasonTimeline
        .fromTo(
          ".illu-weather-shape",
          { morphSVG: SNOWFLAKE_PATH, fill: "#dff1fb", stroke: "#aee0f5" },
          { morphSVG: SUN_PATH, fill: "#f6c445", stroke: "#e2a52f", duration: 1 },
          0
        )
        .fromTo(".illu-glow-ice", { opacity: 1 }, { opacity: 0, duration: 1 }, 0)
        .fromTo(".illu-glow-sun", { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
        .fromTo(
          ".illu-snow",
          { opacity: 1, y: 0 },
          { opacity: 0, y: 14, duration: 0.5 },
          0.5
        )
        .fromTo(
          ".illu-grass-blade",
          { scaleY: 0.08 },
          { scaleY: 1, duration: 0.5 },
          0
        );
      seasonTimeline.progress(0.5);
      seasonTl.current = seasonTimeline;

      if (!reduceMotion) {
        // Ambient loops — independent of the scrub position, so the scene
        // never feels frozen even before anyone touches the slider.
        gsap.to(".illu-flake", {
          y: "+=6",
          rotation: 15,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: { each: 0.15, from: "random" },
        });
        gsap.to(".illu-ring", {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".illu-grass-blade", {
          rotation: 4,
          duration: 1.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: { each: 0.12, from: "random" },
        });
      }

      return () => split?.revert();
    },
    { scope: root }
  );

  function scrub(value: number) {
    seasonTl.current?.progress(value / 100);
  }

  function jumpTo(value: number) {
    const slider = sliderRef.current;
    const tl = seasonTl.current;
    if (!slider || !tl) return;
    const proxy = { v: Number(slider.value) };
    gsap.to(proxy, {
      v: value,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: () => {
        slider.value = String(proxy.v);
        tl.progress(proxy.v / 100);
      },
      onComplete: () => {
        if (value === 0 || value === 100) {
          gsap.fromTo(
            ".illu-weather-shape",
            { scale: 1 },
            {
              scale: 1.12,
              duration: 0.18,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
              transformOrigin: "0px 0px",
            }
          );
        }
      },
    });
  }

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

        <div>
          <HeroIllustration
            ref={illustrationRef}
            className="mx-auto w-full max-w-sm text-foreground/80 lg:max-w-none"
          />

          <div className="mx-auto mt-6 flex max-w-sm flex-col items-center gap-3 lg:max-w-none">
            <input
              ref={sliderRef}
              type="range"
              min={0}
              max={100}
              defaultValue={50}
              onInput={(e) => scrub(Number(e.currentTarget.value))}
              className="w-full accent-accent"
              aria-label="Skipta á milli vetrar og sumars"
            />
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              <button
                type="button"
                onClick={() => jumpTo(0)}
                className="transition hover:text-accent"
              >
                ❄ Vetur
              </button>
              <span aria-hidden className="opacity-40">
                ·
              </span>
              <button
                type="button"
                onClick={() => jumpTo(50)}
                className="transition hover:text-accent"
              >
                Bæði
              </button>
              <span aria-hidden className="opacity-40">
                ·
              </span>
              <button
                type="button"
                onClick={() => jumpTo(100)}
                className="transition hover:text-accent"
              >
                ☀ Sumar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
