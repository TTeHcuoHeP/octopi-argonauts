"use client";

import Image from "next/image";
import { useState } from "react";
import { experienceScene as scene, pillars } from "@/data/pillars";
import { useReveal } from "@/animations/useReveal";
import { cn } from "@/lib/cn";

const pct = (n: number) => `${n * 100}%`;
/** Gap between a column's centre and its copy, as a share of the scene width. */
const COPY_OFFSET = 0.052;

/** Four-point star used as the section's ornament. */
function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0 13.4 10.6 24 12 13.4 13.4 12 24 10.6 13.4 0 12 10.6 10.6Z" />
    </svg>
  );
}

/**
 * Section 03 — The Ultimate Study Experience.
 * A night scene of four Ionic columns. Hovering (or focusing / tapping) a
 * column lights it: its lit frame cross-fades over the scene and its numeral,
 * title and description surface beside it. Leaving the scene returns to the
 * unlit frame. On smaller screens the four commitments also sit as a list
 * below the scene, which drives the same lighting.
 */
export function Experience() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section ref={ref} id="experience" aria-labelledby="experience-title" className="relative bg-ocean-deep">
      {/* Intro — over the night sky on desktop, above the scene on smaller screens */}
      <div className="site-container pointer-events-none pb-10 pt-[clamp(5rem,11vw,8rem)] lg:absolute lg:inset-x-0 lg:top-0 lg:z-[3] lg:pb-0 lg:pt-[clamp(3rem,5vw,6rem)]">
        <div className="relative lg:pl-14" data-reveal>
          <div className="absolute bottom-0 left-0 top-0 hidden w-5 flex-col items-center lg:flex" aria-hidden>
            <span className="w-px flex-1 bg-gradient-to-b from-transparent to-gold/60" />
            <Star className="my-1 h-5 w-5 text-gold-light" />
            <span className="w-px flex-1 bg-gradient-to-t from-transparent to-gold/60" />
          </div>
          <h2 id="experience-title" className="text-[clamp(2.5rem,3.8vw,4rem)] text-limestone">
            The ultimate study experience<span className="text-gold">.</span>
          </h2>
          <p className="mt-4 max-w-[40rem] text-[0.9375rem] leading-[1.6] text-limestone-soft">
            Argonauts is not a subscription. It is a year of deliberate work, structured around four
            commitments that make the difference between watching poker content and actually improving.
          </p>
        </div>
      </div>

      {/* Scene */}
      <div
        className="relative z-[2] mx-auto aspect-[1672/941] w-full max-w-[2560px] overflow-hidden"
        onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
      >
        <Image src={scene.start} alt="" fill sizes="100vw" unoptimized className="object-cover" />
        {pillars.map((p, i) => (
          <Image
            key={p.image}
            src={p.image}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={cn(
              "object-cover transition-opacity duration-[900ms] ease-luxe",
              active === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Settles the title onto the sky (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[40%] bg-gradient-to-b from-ocean-deep/85 via-ocean-deep/40 to-transparent lg:block" />

        {pillars.map((p, i) => {
          const on = active === i;
          return (
            <div key={p.numeral}>
              {/* Numeral with a fine stem down to the capital */}
              <div
                className={cn(
                  "pointer-events-none absolute flex -translate-x-1/2 flex-col items-center transition-[opacity,translate] duration-700 ease-luxe",
                  on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
                style={{ left: pct(p.x), bottom: pct(1 - scene.capitalTop) }}
                aria-hidden
              >
                <span className="font-display text-[clamp(1.375rem,3.2vw,3.5rem)] leading-none text-gold-light [text-shadow:0_0_24px_rgba(185,146,97,0.45)]">
                  {p.numeral}
                </span>
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-light md:mt-2" />
                <span className="h-[1.8vw] w-px bg-gradient-to-b from-gold to-transparent" />
              </div>

              {/* Copy beside the column (desktop) */}
              <div
                id={`pillar-${i}-copy`}
                className={cn(
                  "pointer-events-none absolute top-1/2 hidden w-[13%] transition-[opacity,translate] duration-700 ease-luxe lg:block",
                  on ? "translate-y-0 opacity-100 delay-150" : "translate-y-3 opacity-0",
                  p.side === "left" && "text-right",
                )}
                style={
                  p.side === "right"
                    ? { left: pct(p.x + COPY_OFFSET) }
                    : { right: pct(1 - p.x + COPY_OFFSET) }
                }
              >
                <h3 className="font-display text-[clamp(1.5rem,2vw,2.375rem)] leading-[1.1] text-limestone [text-shadow:0_2px_16px_rgba(6,12,20,0.9)]">
                  {p.title}
                </h3>
                <span className={cn("mt-4 block h-px w-12 bg-gold", p.side === "left" && "ml-auto")} />
                <p className="mt-5 text-[clamp(0.8125rem,0.95vw,1rem)] leading-[1.6] text-limestone-soft [text-shadow:0_1px_10px_rgba(6,12,20,0.95)]">
                  {p.body}
                </p>
              </div>

              {/* Hit area over the column: hover, focus or tap lights it */}
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${p.numeral}. ${p.title}`}
                aria-describedby={`pillar-${i}-copy`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="absolute w-[11%] -translate-x-1/2 cursor-pointer rounded-sm"
                style={{
                  left: pct(p.x),
                  top: pct(scene.capitalTop - 0.03),
                  height: pct(scene.base - scene.capitalTop + 0.05),
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Smaller screens: the four commitments as a list that also lights the columns */}
      <ol className="site-container grid gap-x-10 pb-[clamp(4rem,10vw,6rem)] pt-10 sm:grid-cols-2 lg:hidden">
        {pillars.map((p, i) => (
          <li key={p.numeral}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={cn(
                "grid w-full grid-cols-[3rem_1fr] gap-x-4 border-t py-6 text-left transition-colors duration-500",
                active === i ? "border-gold" : "border-line",
              )}
            >
              <span
                className={cn(
                  "font-display text-3xl leading-none transition-colors duration-500",
                  active === i ? "text-gold-light" : "text-gold/60",
                )}
              >
                {p.numeral}
              </span>
              <span>
                <span className="block font-display text-2xl leading-tight text-limestone">{p.title}</span>
                <span className="mt-2 block text-[0.9375rem] leading-[1.65] text-limestone-soft">{p.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
