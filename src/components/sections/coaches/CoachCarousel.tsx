"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Coach } from "@/data/coaches";
import { cn } from "@/lib/cn";

type Slot = { d: number; instant: boolean };

/**
 * Offset of item `i` from the centre, wrapped into the loop. The one item
 * exactly opposite the centre parks on the side it is leaving towards.
 */
function offsetFor(i: number, active: number, n: number, dir: number) {
  let d = (((i - active) % n) + n) % n;
  if (d > n / 2) d -= n;
  if (d === n / 2) d = dir >= 0 ? -d : d;
  return d;
}

function slotStyle(d: number): CSSProperties {
  const abs = Math.abs(d);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.7 : 0.5;
  return {
    transform: `translateX(calc(-50% + ${d} * var(--coach-gap))) scale(${scale})`,
    opacity: abs <= 1 ? 1 : 0,
    filter: abs === 0 ? "none" : "brightness(0.62) saturate(0.85)",
    zIndex: 10 - abs,
  };
}

/** Thin gold rule with a four-point star, as on a chart cartouche. */
function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 text-gold" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70 sm:w-24" />
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 0 13.6 10.4 24 12 13.6 13.6 12 24 10.4 13.6 0 12 10.4 10.4Z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70 sm:w-24" />
    </div>
  );
}

const arrowClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors duration-500 ease-luxe hover:border-gold hover:bg-gold/10 md:absolute md:top-[calc(var(--coach-w)*0.52)] md:h-14 md:w-14 md:-translate-y-1/2";

/**
 * Coach carousel: the centre bust is largest, with its name and role beneath
 * and a gold halo behind; neighbours sit smaller to either side. Moves with
 * the arrows, dots, a click on a side bust, swipe, or ←/→ keys. Loops.
 */
export function CoachCarousel({ coaches, initialId }: { coaches: Coach[]; initialId?: string }) {
  const n = coaches.length;
  const initial = Math.max(0, coaches.findIndex((c) => c.id === initialId));
  const [active, setActive] = useState(initial);
  const [slots, setSlots] = useState<Slot[]>(() =>
    coaches.map((_, i) => ({ d: offsetFor(i, initial, n, 1), instant: false })),
  );
  const pointerX = useRef<number | null>(null);
  const [haloVisible, setHaloVisible] = useState(true);
  const haloTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(haloTimer.current), []);

  const go = useCallback(
    (target: number, dir: number) => {
      const next = ((target % n) + n) % n;
      if (next === active) return;
      const final = coaches.map((_, i) => offsetFor(i, next, n, dir));
      // A hidden bust that must enter from the opposite side first jumps,
      // unseen, to that side — otherwise it would sweep across the stage.
      const staged = slots.map((s, i) => {
        const d = final[i];
        const crosses = Math.abs(s.d) >= 2 && d !== 0 && Math.sign(s.d) !== Math.sign(d);
        return crosses ? { d: Math.sign(d) * 2, instant: true } : s;
      });
      setActive(next);
      // Halo fades out with the outgoing bust and back in as the new one settles.
      setHaloVisible(false);
      window.clearTimeout(haloTimer.current);
      haloTimer.current = window.setTimeout(() => setHaloVisible(true), 650);
      if (staged.some((s) => s.instant)) {
        setSlots(staged);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setSlots(final.map((d) => ({ d, instant: false })))),
        );
      } else {
        setSlots(final.map((d) => ({ d, instant: false })));
      }
    },
    [active, coaches, n, slots],
  );

  const prev = () => go(active - 1, -1);
  const next = () => go(active + 1, 1);
  const coach = coaches[active];

  return (
    <div
      className="relative [--coach-gap:calc(var(--coach-w)*0.92)] [--coach-w:clamp(14rem,32vw,30rem)]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Coaches"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
    >
      {/* Stage */}
      <div
        className="relative h-[calc(var(--coach-w)*1.07)] touch-pan-y select-none"
        onPointerDown={(e) => (pointerX.current = e.clientX)}
        onPointerUp={(e) => {
          if (pointerX.current === null) return;
          const dx = e.clientX - pointerX.current;
          pointerX.current = null;
          if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
        }}
        onPointerCancel={() => (pointerX.current = null)}
      >
        {/* Gold halo behind the centre bust — dissolves on change, returns with the new coach */}
        <span
          aria-hidden
          data-visible={haloVisible}
          className="coach-halo pointer-events-none absolute left-1/2 top-[46%] z-[5] aspect-square w-[calc(var(--coach-w)*1.04)] rounded-full border border-gold/20 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--gold-light)_9%,transparent)_0%,color-mix(in_srgb,var(--gold)_4%,transparent)_45%,transparent_100%)]"
        />

        {coaches.map((c, i) => {
          const { d, instant } = slots[i];
          const abs = Math.abs(d);
          const isCenter = abs === 0;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => !isCenter && go(i, Math.sign(d))}
              tabIndex={abs === 1 ? 0 : -1}
              aria-hidden={!isCenter && abs !== 1}
              aria-label={isCenter ? `${c.name}, ${c.role}` : `Show ${c.name}`}
              aria-current={isCenter ? "true" : undefined}
              className={cn(
                "absolute bottom-0 left-1/2 aspect-[1000/1068] w-[var(--coach-w)] origin-[50%_85%] transition-[transform,opacity,filter] duration-[1100ms] ease-luxe",
                isCenter ? "cursor-default" : "cursor-pointer hover:brightness-90",
                abs > 1 && "pointer-events-none",
              )}
              style={{ ...slotStyle(d), ...(instant ? { transition: "none" } : null) }}
            >
              {c.image && (
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30rem, 60vw"
                  className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
                  draggable={false}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Caption for the centre coach */}
      <div className="mt-8 text-center md:mt-10" aria-live="polite">
        <div key={coach.id} className="animate-coach-rise">
          <Ornament />
          <h3 className="monument mt-5 text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-limestone">
            {coach.name}
          </h3>
          <p className="eyebrow mt-3">{coach.role}</p>
        </div>
      </div>

      {/* Controls: arrows flank the dots on mobile, sit at the stage edges from md */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button type="button" onClick={prev} aria-label="Previous coach" className={cn(arrowClass, "md:left-0")}>
          <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
        </button>
        <div className="flex items-center gap-1">
          {coaches.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(i, i > active ? 1 : -1)}
              aria-label={`Show ${c.name}`}
              aria-current={i === active ? "true" : undefined}
              className="group flex h-8 w-8 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-500 ease-luxe",
                  i === active ? "scale-125 bg-gold" : "bg-limestone/25 group-hover:bg-limestone/50",
                )}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Next coach" className={cn(arrowClass, "md:right-0")}>
          <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
