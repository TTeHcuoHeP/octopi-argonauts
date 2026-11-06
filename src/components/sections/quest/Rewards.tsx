"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import {
  pointSources,
  rewardPrizes,
  rewards,
  type RewardPrize,
} from "@/data/quest";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useReveal } from "@/animations/useReveal";
import { Trophy } from "lucide-react";
import { dreamSeat } from "@/data/dreamSeat";

/**
 * Where each prize floats, how far it drifts with scroll (px each way: larger
 * reads as nearer), its tilt and whether it is mirrored. The two cards hang off
 * the left edge with the ring below them; the fleece (mirrored so the ram faces
 * in) hangs off the right with the trophy below it. Phones: the same sides,
 * cards and fleece above the copy, ring and trophy below it, with a smaller drift.
 */
const PLACES: Record<
  RewardPrize["id"],
  {
    className: string;
    depth: number;
    tilt: number;
    delay: number;
    flip?: boolean;
  }
> = {
  "card-back": {
    className:
      "left-[-14%] top-0 w-[27.5vw] lg:left-[-5%] lg:top-[6%] lg:w-[clamp(8.4rem,13vw,16.05rem)]",
    depth: 110,
    tilt: -16,
    delay: 0,
  },
  king: {
    className:
      "left-[10%] top-[4%] w-[28vw] lg:left-[5%] lg:top-[34%] lg:w-[clamp(8.5rem,13.2vw,16.15rem)]",
    depth: 70,
    tilt: 7,
    delay: -2.4,
  },
  fleece: {
    className:
      "right-[-12%] top-[1%] w-[40vw] lg:right-[-4%] lg:top-[6%] lg:w-[clamp(12rem,19vw,23rem)]",
    depth: 90,
    tilt: -6,
    delay: -1.2,
    flip: true,
  },
  ring: {
    className:
      "bottom-[3%] left-[6%] w-[24vw] lg:bottom-[7%] lg:left-[9%] lg:w-[clamp(7rem,10vw,12rem)]",
    depth: 50,
    tilt: -8,
    delay: -3.6,
  },
  cup: {
    className:
      "bottom-[1%] right-[6%] w-[25vw] lg:bottom-[8%] lg:right-[5%] lg:w-[clamp(9rem,13vw,16rem)]",
    depth: 65,
    tilt: 5,
    delay: -4.8,
  },
};

/**
 * How points are earned and the rewards, in a centred column on the plain
 * ocean, with the prizes floating either side: each bobs gently on its own
 * and drifts at its own speed as the section scrolls by (parallax).
 */
export function Rewards() {
  const section = useReveal<HTMLElement>({ stagger: 0.07 });
  const ref = useRef<HTMLDivElement>(null);
  const trophy = rewards.find((r) => r.id === "trophy")!;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-prize]", el).forEach((prize) => {
        // Phones keep the drift small so the corner prizes stay clear of the copy.
        const depth =
          Number(prize.dataset.prize) *
          (window.matchMedia("(min-width: 1024px)").matches ? 1 : 0.35);
        gsap.fromTo(
          prize,
          { y: depth },
          {
            y: -depth,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="rewards"
      aria-labelledby="rewards-title"
      className="relative bg-ocean"
    >
      <div ref={ref} className="relative overflow-x-clip">
        {rewardPrizes.map((prize) => {
          const place = PLACES[prize.id];
          return (
            <div
              key={prize.id}
              data-prize={place.depth}
              className={`pointer-events-none absolute ${place.className}`}
              aria-hidden
            >
              <div
                style={
                  {
                    rotate: `${place.tilt}deg`,
                    scale: place.flip ? "-1 1" : undefined,
                  } as CSSProperties
                }
              >
                <Image
                  src={prize.src}
                  alt=""
                  width={prize.width}
                  height={prize.height}
                  unoptimized
                  style={{ animationDelay: `${place.delay}s` }}
                  className="h-auto w-full motion-safe:animate-[prize-float_7s_ease-in-out_infinite] [filter:drop-shadow(0_26px_28px_rgba(0,0,0,0.55))]"
                />
              </div>
            </div>
          );
        })}

        <div className="site-container pb-[calc(40vw+60px)] pt-[calc(60vw+50px)] lg:py-[calc(clamp(6rem,9vw,10rem)+50px)]">
          <div className="mx-auto max-w-[44rem] text-center lg:max-w-[min(68rem,60vw)]">
            <h2
              id="rewards-title"
              data-reveal
              className="bg-gradient-to-b from-gold-light to-gold bg-clip-text pb-2 font-display text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.05] text-transparent"
            >
              The Rewards
            </h2>
            {/* I: the Champion's prize, the Golden Fleece Trophy and the PGT Dream Seat */}
            <div
              id="dream-seat"
              data-reveal
              className="mt-10 scroll-mt-28 md:mt-12"
            >
              <div>
                <span className="font-display text-[3.25rem] font-semibold leading-none text-gold lg:text-[clamp(3.25rem,4vw,4.25rem)]">
                  I
                </span>
                <h3 className="mt-3 font-display text-[2.125rem] leading-[1.05] text-limestone lg:text-[clamp(2.25rem,3vw,3rem)]">
                  The Champion&rsquo;s Prize
                </h3>
                <p className="mx-auto mt-3 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-limestone-soft md:text-lg">
                  The highest-scoring Argonaut of the year is crowned Champion
                  and takes home both.
                </p>

                <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
                  <div className="md:px-8">
                    <span
                      className="mx-auto flex h-[4.5rem] items-center justify-center"
                      aria-hidden
                    >
                      <Trophy className="h-14 w-14 text-gold" strokeWidth={1} />
                    </span>
                    <h4 className="mt-4 font-display text-[1.75rem] leading-[1.1] text-limestone lg:text-[2rem]">
                      {trophy.title}
                    </h4>
                    <p className="mx-auto mt-3 max-w-[22rem] text-[1.0625rem] leading-[1.6] text-limestone-soft md:text-lg">
                      The emblem of the voyage, held by the Champion of the
                      Argonauts.
                    </p>
                  </div>
                  <div className="md:px-8">
                    <span className="mx-auto flex h-[4.5rem] items-center justify-center">
                      <Image
                        src={dreamSeat.logo.src}
                        alt="PGT Championship"
                        width={dreamSeat.logo.width}
                        height={dreamSeat.logo.height}
                        sizes="9rem"
                        className="h-full w-auto [filter:drop-shadow(0_10px_18px_rgba(0,0,0,0.5))]"
                      />
                    </span>
                    <h4 className="mt-4 font-display text-[1.75rem] leading-[1.1] text-limestone lg:text-[2rem]">
                      The PGT Championship Dream Seat
                    </h4>
                    <p className="mx-auto mt-3 max-w-[24rem] text-[1.0625rem] leading-[1.6] text-limestone-soft md:text-lg">
                      {dreamSeat.pitch}
                    </p>
                  </div>
                </div>

                <dl className="mt-10 grid grid-cols-2 gap-y-6 border-t border-line pt-8 md:grid-cols-4">
                  {dreamSeat.facts.map((fact) => (
                    <div key={fact.k} className="px-2">
                      <dt className="eyebrow-muted">{fact.k}</dt>
                      <dd className="mt-2 font-display text-xl leading-snug text-limestone md:text-[1.375rem]">
                        {fact.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mx-auto mt-8 max-w-[46rem] text-[1.0625rem] italic leading-relaxed text-stone md:text-lg">
                  {dreamSeat.note}
                </p>
              </div>
            </div>

            {/* II and III: the commemorative rewards, under the Champion */}
            <div className="mx-auto mt-14 grid max-w-[44rem] gap-10 sm:grid-cols-2 sm:gap-8 md:mt-20">
              {rewards
                .filter((r) => r.id !== "trophy")
                .reverse()
                .map((r) => (
                  <div key={r.id} data-reveal>
                    <span className="font-display text-[2.75rem] font-semibold leading-none text-gold lg:text-[clamp(2.75rem,3.4vw,3.5rem)]">
                      {r.numeral}
                    </span>
                    <h3 className="mt-3 text-balance font-display text-[1.875rem] leading-[1.1] text-limestone lg:text-[clamp(1.875rem,2.3vw,2.5rem)]">
                      {r.title}
                    </h3>
                    <p className="mx-auto mt-3 max-w-[20rem] text-[1.0625rem] leading-[1.6] text-limestone-soft md:text-lg">
                      {r.body}
                    </p>
                  </div>
                ))}
            </div>

            {/* Hairline with a gold diamond */}
            <div
              className="mx-auto my-12 flex max-w-[16rem] items-center gap-3 md:my-14"
              aria-hidden
              data-reveal
            >
              <span className="h-px flex-1 bg-gradient-to-r from-gold/0 to-gold/60" />
              <span className="h-2 w-2 rotate-45 border border-gold" />
              <span className="h-px flex-1 bg-gradient-to-l from-gold/0 to-gold/60" />
            </div>

            <p className="eyebrow" data-reveal>
              How points are earned
            </p>
            <ul className="mt-6 grid border-t border-line text-left sm:grid-cols-2 sm:gap-x-10">
              {pointSources.map((src, i) => (
                <li
                  key={src}
                  className="text-[1.0625rem] md:text-lg flex items-baseline gap-4 border-b border-line py-3.5 text-limestone"
                  data-reveal
                >
                  <span className="font-display text-sm tracking-[0.2em] text-stone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {src}
                </li>
              ))}
            </ul>
            <p
              className="text-[1.0625rem] md:text-lg mt-5 italic text-stone"
              data-reveal
            >
              Specifics to be shared with members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
