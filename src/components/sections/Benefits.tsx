"use client";

import Image from "next/image";
import { pillars } from "@/data/pillars";
import { useReveal } from "@/animations/useReveal";

/** Card outline with small cut corners, shared by the frame, the hover sheen and the panel. */
const NOTCH =
  "[clip-path:polygon(10px_0,calc(100%-10px)_0,100%_10px,100%_calc(100%-10px),calc(100%-10px)_100%,10px_100%,0_calc(100%-10px),0_10px)]";

/**
 * Section 02 — the four commitments at a glance, right under the hero.
 * Compact (not a full screen); sits on the same deep-ocean ground the hero
 * fades into. Each card warms to a gold sheen on hover.
 */
export function Benefits() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 });

  return (
    <section ref={ref} id="benefits" aria-labelledby="benefits-title" className="relative py-[clamp(3rem,6vw,5rem)] [font-variant-numeric:lining-nums]">
      <div className="site-container">
        <div className="mx-auto text-center" data-reveal>
          <h2
            id="benefits-title"
            className="font-display text-[clamp(2.25rem,3.8vw,3.75rem)] font-semibold leading-[1.05] text-limestone md:whitespace-nowrap"
          >
            The ultimate study experience.
          </h2>
          <p className="mx-auto mt-5 max-w-[50rem] text-balance text-base leading-[1.65] text-limestone-soft">
            Argonauts is not a subscription. It is a year of deliberate work, structured around four
            commitments that make the difference between watching poker content and actually improving.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {pillars.map((p) => (
            <li
              key={p.numeral}
              data-reveal
              className="group relative transition-[filter] duration-700 ease-luxe [filter:drop-shadow(0_0_0_rgba(211,181,137,0))] hover:[filter:drop-shadow(0_0_26px_rgba(211,181,137,0.45))]"
            >
              {/* Frame: quiet gold hairline, warming to a gold gradient on hover */}
              <span className={`absolute inset-0 bg-gold/30 ${NOTCH}`} aria-hidden />
              <span
                className={`absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--gold-light)_70%,white),var(--gold-light)_30%,var(--gold)_65%,var(--gold-dim)_100%)] opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100 ${NOTCH}`}
                aria-hidden
              />
              {/* Panel, with a soft gold sheen that rises on hover */}
              <span className={`absolute inset-px bg-[linear-gradient(180deg,rgba(17,33,51,0.96),rgba(10,20,32,0.96))] ${NOTCH}`} aria-hidden />
              <span
                className={`absolute inset-px bg-[radial-gradient(120%_110%_at_0%_0%,rgba(211,181,137,0.24),rgba(185,146,97,0.09)_45%,transparent_78%)] opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100 ${NOTCH}`}
                aria-hidden
              />

              <div className="relative grid grid-cols-[2rem_1fr_auto] gap-x-4 px-5 py-7 sm:grid-cols-[2.5rem_1fr_auto] sm:gap-x-5 sm:px-6 md:px-8 lg:px-10">
                <div className="pt-1">
                  <span className="block font-display text-[1.75rem] leading-none text-gold">{p.numeral}</span>
                  <span className="mt-3 block h-px w-6 bg-gold/70" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.5rem,2.1vw,2rem)] leading-tight text-limestone">{p.title}</h3>
                  <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-[1.65] text-limestone-soft">{p.body}</p>
                </div>
                <div className="flex items-start justify-center pt-1 sm:items-center sm:pt-0">
                  <Image
                    src={p.icon}
                    alt=""
                    width={96}
                    height={96}
                    unoptimized
                    className="h-11 w-11 object-contain sm:h-16 sm:w-16 opacity-90 transition-[transform,opacity] duration-700 ease-luxe group-hover:scale-105 group-hover:opacity-100 lg:h-20 lg:w-20"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Closing hairline with a star */}
        <div className="mt-10 flex items-center gap-4 text-gold md:mt-12" aria-hidden data-reveal>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M12 0 13.6 10.4 24 12 13.6 13.6 12 24 10.4 13.6 0 12 10.4 10.4Z" />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </div>
    </section>
  );
}
