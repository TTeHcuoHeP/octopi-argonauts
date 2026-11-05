"use client";

import Image from "next/image";
import { dreamSeat } from "@/data/dreamSeat";
import { useReveal } from "@/animations/useReveal";

/**
 * The PGT Championship Dream Seat — the grand prize after The Rewards, framed
 * as a banner: the logo on a soft gold glow, the offer and four key facts.
 */
export function DreamSeat() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 });

  return (
    <section
      ref={ref}
      id="dream-seat"
      aria-labelledby="dream-seat-title"
      className="relative bg-ocean pb-[clamp(5rem,9vw,9rem)] [font-variant-numeric:lining-nums]"
    >
      <div className="site-container">
        <div className="relative overflow-hidden border border-line-gold bg-gradient-to-br from-ocean-deep via-ocean-deep to-ocean shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]">
          {/* Gold glow behind the logo */}
          <div
            className="pointer-events-none absolute -top-1/4 left-1/2 h-[90%] w-[80%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(211,181,137,0.2),transparent)] lg:left-[22%] lg:top-1/2 lg:h-[130%] lg:w-[55%] lg:-translate-y-1/2"
            aria-hidden
          />

          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:grid-cols-12 lg:gap-14">
            <div className="mx-auto w-full max-w-[22rem] lg:col-span-5 lg:max-w-none" data-reveal>
              <Image
                src={dreamSeat.logo.src}
                alt="PGT Championship"
                width={dreamSeat.logo.width}
                height={dreamSeat.logo.height}
                sizes="(min-width: 1024px) 34vw, 22rem"
                className="h-auto w-full [filter:drop-shadow(0_18px_30px_rgba(0,0,0,0.55))]"
              />
            </div>

            <div className="lg:col-span-7">
              <p className="eyebrow" data-reveal>
                A member exclusive
              </p>
              <h2
                id="dream-seat-title"
                data-reveal
                className="mt-4 bg-gradient-to-b from-gold-light to-gold bg-clip-text pb-1 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] text-transparent"
              >
                The Dream Seat
              </h2>
              <p
                className="mt-5 font-display text-[clamp(1.375rem,2.1vw,1.875rem)] leading-[1.3] text-limestone"
                data-reveal
              >
                {dreamSeat.pitch}
              </p>
              <p className="mt-5 max-w-[36rem] text-[0.9375rem] leading-[1.7] text-limestone-soft md:text-base" data-reveal>
                Awarded to one Argonaut. {dreamSeat.body}
              </p>
            </div>
          </div>

          <dl className="relative grid grid-cols-2 border-t border-line-gold md:grid-cols-4">
            {dreamSeat.facts.map((f, i) => (
              <div
                key={f.k}
                data-reveal
                className={`px-6 py-6 sm:px-10 md:px-8 md:py-8 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              >
                <dt className="eyebrow-muted">{f.k}</dt>
                <dd className="mt-3 font-display text-xl leading-snug text-limestone md:text-2xl">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mx-auto mt-6 max-w-[52rem] text-center text-sm italic leading-relaxed text-stone" data-reveal>
          {dreamSeat.note}
        </p>
      </div>
    </section>
  );
}
