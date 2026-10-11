"use client";

import Image from "next/image";
import { useReactCompareSlider } from "react-compare-slider/hooks";
import { Provider, Root, Item, HandleRoot, Handle } from "react-compare-slider/components";

/**
 * Built from react-compare-slider's lower-level pieces (rather than the
 * <ReactCompareSlider> convenience wrapper) specifically to get access to
 * the hook's imperative `setPosition` — v4 of the library only supports
 * uncontrolled position via `defaultPosition`, and this is the documented
 * way to drive it from outside (our "Vetur / Sumar" preset buttons) while
 * still getting drag, touch and keyboard support for free.
 *
 * Real photography (not illustration) — see public/images/winter.jpg and
 * summer.jpg, both free-license stock photos (Pexels License: free for
 * commercial use, no attribution required).
 */
export function SeasonCompareSlider() {
  const slider = useReactCompareSlider({
    defaultPosition: 50,
    transition: "0.6s cubic-bezier(.22,.61,.36,1)",
  });

  return (
    <div className="flex h-full w-full flex-col">
      <Provider {...slider}>
        <Root style={{ height: "100%", width: "100%" }}>
          <Item item="itemOne">
            {/* relative wrapper gives next/image's fill mode a positioned
                containing block scoped to this grid cell, since the
                library's own Item div is position:static */}
            <div className="relative h-full w-full">
              <Image
                src="/images/winter.jpg"
                alt="Snævi þakin innkeyrsla að vetri"
                fill
                priority
                sizes="(min-width: 1024px) 480px, 384px"
                className="object-cover"
              />
            </div>
          </Item>
          <Item item="itemTwo">
            <div className="relative h-full w-full">
              <Image
                src="/images/summer.jpg"
                alt="Nýslegin flöt að sumri"
                fill
                sizes="(min-width: 1024px) 480px, 384px"
                className="object-cover"
              />
            </div>
          </Item>
          <HandleRoot>
            <Handle
              buttonStyle={{
                background: "var(--surface)",
                border: "2px solid var(--accent)",
                color: "var(--accent)",
                width: 44,
                height: 44,
                boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
              }}
              linesStyle={{ background: "var(--accent)", opacity: 0.95 }}
            />
          </HandleRoot>
        </Root>
      </Provider>

      <div className="mt-5 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        <button
          type="button"
          onClick={() => slider.setPosition(0)}
          className="transition hover:text-accent"
        >
          ❄ Vetur
        </button>
        <span aria-hidden className="opacity-40">
          ·
        </span>
        <button
          type="button"
          onClick={() => slider.setPosition(50)}
          className="transition hover:text-accent"
        >
          Dragðu til að bera saman
        </button>
        <span aria-hidden className="opacity-40">
          ·
        </span>
        <button
          type="button"
          onClick={() => slider.setPosition(100)}
          className="transition hover:text-accent"
        >
          ☀ Sumar
        </button>
      </div>
    </div>
  );
}
