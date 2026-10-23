"use client";

import { useReveal } from "@/animations/useReveal";

const reasons = [
  "Personal learning",
  "Meaningful interaction with coaches",
  "Stronger relationships",
  "A committed community",
  "An intimate and exclusive environment",
];

/** Section 06 — An Exclusive Group of 40 */
export function Forty() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <section
      ref={ref}
      id="fellowship"
      aria-labelledby="forty-title"
      className="relative overflow-hidden bg-ocean py-32 md:py-44"
    >
      {/* Concentric navigation rings behind the numeral */}
      <svg
        aria-hidden
        viewBox="0 0 1000 1000"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <circle cx="500" cy="500" r="180" strokeOpacity="0.22" />
        <circle cx="500" cy="500" r="300" strokeOpacity="0.14" strokeDasharray="2 8" />
        <circle cx="500" cy="500" r="430" strokeOpacity="0.08" />
        <path d="M500 0v1000M0 500h1000" strokeOpacity="0.06" />
      </svg>

      <div className="site-container relative text-center">
        <p className="eyebrow" data-reveal>
          An exclusive group
        </p>

        <div className="relative mt-6 flex items-center justify-center" data-reveal>
          <span className="display-numeral text-[clamp(11rem,34vw,30rem)]" aria-hidden>
            40
          </span>
        </div>

        <h2
          id="forty-title"
          className="monument mx-auto mt-8 max-w-4xl text-[clamp(1.25rem,3vw,2.5rem)] leading-[1.35] text-limestone md:mt-12"
          data-reveal
        >
          Forty heroes. <span className="text-gold">One extraordinary journey.</span>
        </h2>

        <p
          className="mx-auto mt-10 max-w-xl text-[1.0625rem] leading-[1.75] text-limestone-soft md:text-lg"
          data-reveal
        >
          Membership is limited to a maximum of forty participants. The restriction is
          deliberate — it is what makes the rest of the program possible.
        </p>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3" data-reveal>
          {reasons.map((r, i) => (
            <li
              key={r}
              className="flex items-center gap-8 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-limestone-soft"
            >
              {r}
              {i < reasons.length - 1 && <span className="hidden h-3 w-px bg-gold/60 md:block" aria-hidden />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
