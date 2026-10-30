"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { pointSources, rewardPrizes, rewards, type RewardPrize } from "@/data/quest";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Where each prize floats, how far it drifts with scroll (px each way: larger
 * reads as nearer) and its tilt. The two cards hang off the left edge of the
 * page, the fleece off the right with the ring beside it. Phones: the same
 * sides, tucked above the copy (ring below it), with a smaller drift.
 */
const PLACES: Record<RewardPrize["id"], { className: string; depth: number; tilt: number; delay: number }> = {
  "card-back": {
    className: "left-[-14%] top-0 w-[36vw] lg:left-[-5%] lg:top-[6%] lg:w-[clamp(11rem,17vw,21rem)]",
    depth: 110,
    tilt: -16,
    delay: 0,
  },
  king: {
    className: "left-[10%] top-[4%] w-[33vw] lg:left-[5%] lg:top-[34%] lg:w-[clamp(10rem,15.5vw,19rem)]",
    depth: 70,
    tilt: 7,
    delay: -2.4,
  },
  fleece: {
    className: "right-[-12%] top-[1%] w-[40vw] lg:right-[-4%] lg:top-[8%] lg:w-[clamp(12rem,19vw,23rem)]",
    depth: 90,
    tilt: 6,
    delay: -1.2,
  },
  ring: {
    className: "bottom-[2%] right-[6%] w-[24vw] lg:bottom-[10%] lg:right-[9%] lg:w-[clamp(7rem,10vw,12rem)]",
    depth: 50,
    tilt: -8,
    delay: -3.6,
  },
};

/**
 * How points are earned and the rewards, in a centred column on the plain
 * ocean, with the prizes floating either side: each bobs gently on its own
 * and drifts at its own speed as the section scrolls by (parallax).
 */
export function Rewards() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-prize]", el).forEach((prize) => {
        // Phones keep the drift small so the corner prizes stay clear of the copy.
        const depth = Number(prize.dataset.prize) * (window.matchMedia("(min-width: 1024px)").matches ? 1 : 0.35);
        gsap.fromTo(
          prize,
          { y: depth },
          { y: -depth, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
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
            <div style={{ rotate: `${place.tilt}deg` } as CSSProperties}>
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

      <div className="site-container pb-[calc(30vw+50px)] pt-[calc(60vw+50px)] lg:py-[calc(clamp(6rem,9vw,10rem)+50px)]">
        <div className="mx-auto max-w-[44rem] text-center lg:max-w-[min(60rem,52vw)]">
          <p className="eyebrow" data-reveal>
            The rewards
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {rewards.map((r, i) => (
              <div key={r.id} data-reveal>
                <span className="font-display text-3xl font-light leading-none text-gold">{["I", "II", "III"][i]}</span>
                <h3 className="mt-3 text-balance font-display text-[1.875rem] leading-[1.1] text-limestone lg:text-[clamp(1.875rem,2.3vw,2.5rem)]">
                  {r.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-[1.65] text-limestone-soft">{r.body}</p>
              </div>
            ))}
          </div>

          {/* Hairline with a gold diamond */}
          <div className="mx-auto my-12 flex max-w-[16rem] items-center gap-3 md:my-14" aria-hidden data-reveal>
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
                className="flex items-baseline gap-4 border-b border-line py-3.5 text-[0.9375rem] text-limestone md:text-base"
                data-reveal
              >
                <span className="font-display text-sm tracking-[0.2em] text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {src}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm italic text-stone" data-reveal>
            Point mechanics are being finalised and will be shared with admitted members.
          </p>
        </div>
      </div>
    </div>
  );
}
