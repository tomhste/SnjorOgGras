"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

const icons: Record<(typeof services)[number]["icon"], React.ReactNode> = {
  snow: (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden>
      <path
        d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M2 12h20M6 3l1.5 3L5 7.5M18 3l-1.5 3L20.5 7.5M6 21l1.5-3L5 16.5M18 21l-1.5-3 3.5-1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  grass: (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden>
      <path
        d="M4 21c0-6 2-9 2-13 0 4 2 6 2 13M9 21c0-7 2-11 2-16 0 5 2 8 2 16M14 21c0-5 2-8 2-14 0 4 2 7 2 14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function Services() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".service-row",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="thjonusta" className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Þjónusta
        </span>
        <p className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl italic sm:text-4xl">
          Allt árið um kring.
        </p>

        <div className="mt-14 border-t border-border">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="service-row grid grid-cols-[auto_1fr] items-center gap-6 border-b border-border py-10 sm:grid-cols-[4rem_auto_1fr_auto]"
            >
              <span className="hidden font-[family-name:var(--font-display)] text-2xl text-muted sm:block">
                0{i + 1}
              </span>
              <span className="text-accent">{icons[service.icon]}</span>
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-md text-muted">{service.description}</p>
              </div>
              <span className="col-span-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted sm:col-span-1 sm:text-right">
                {service.season}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
