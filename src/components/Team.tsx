"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { team } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function Team() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".team-row",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="stjornendur" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Hverjir erum við
        </span>
        <p className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl italic sm:text-4xl">
          Þrír strákar á Álftanesi.
        </p>

        <div className="mt-14 border-t border-border">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="team-row flex flex-col gap-1 border-b border-border py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-[family-name:var(--font-display)] text-lg text-muted">
                  0{i + 1}
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
                  {member.name}
                </h3>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
