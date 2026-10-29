"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { coachCardBack, coachCardSize, type Coach } from "@/data/coaches";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Rounded corners matching the artwork (~50px on a 720 × 1082 card). */
const CARD_RADIUS = "rounded-[7%/4.6%]";

/**
 * When a card is turned over. Hover on pointer devices, keyboard focus, or a
 * tap on touch screens (tracked in state, one card at a time). On hover the
 * turn waits a beat, so a fanned card straightens before it flips.
 */
const TURNED =
  "group-hover:rotate-y-180 group-hover:delay-75 group-focus-visible:rotate-y-180 group-data-[turned=true]:rotate-y-180";

/**
 * Back-face reveals: on the way in they follow just behind the turn;
 * on the way out they leave first, quickly, so the card closes onto a clean back.
 */
const DIM_IN =
  "group-hover:opacity-100 group-hover:delay-200 group-hover:duration-500 group-focus-visible:opacity-100 group-focus-visible:delay-150 group-focus-visible:duration-500 group-data-[turned=true]:opacity-100 group-data-[turned=true]:delay-150 group-data-[turned=true]:duration-500";
const TEXT_IN =
  "group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-[380ms] group-hover:duration-[450ms] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-300 group-focus-visible:duration-[450ms] group-data-[turned=true]:translate-y-0 group-data-[turned=true]:opacity-100 group-data-[turned=true]:delay-300 group-data-[turned=true]:duration-[450ms]";

/**
 * Wing fans, inner card first: tilt grows and the card drops as it moves out,
 * so each wing reads as a hand of cards opening away from the head coaches.
 */
const FAN = [
  { r: 4, y: 2 },
  { r: 10, y: 8 },
  { r: 16, y: 17 },
];

/** Head-coach cards lean gently towards each other. */
const HEAD_TILT = [-2.5, 2.5];

/**
 * Lift on hover or focus (desktop spread only): the card leaves the fan,
 * straightens and rises above its neighbours. Wing cards grow to head size.
 */
const LIFT =
  "lg:transition-[rotate,translate,scale] lg:duration-[400ms] lg:ease-luxe lg:[rotate:var(--r)] lg:[translate:0_var(--y)] lg:hover:z-30 lg:hover:[rotate:0deg] lg:focus-within:z-30 lg:focus-within:[rotate:0deg]";

/**
 * Coaches as a spread of playing cards: the two head coaches large in the
 * centre, three cards fanned out to each side. Each card turns over to its
 * back, which slowly darkens while the coach's record rises into view.
 * Below desktop: head coaches side by side, the rest in a swipeable row.
 */
export function CoachCards({ coaches, lead }: { coaches: Coach[]; lead: number }) {
  const [turned, setTurned] = useState<string | null>(null);
  const pointer = useRef<string>("mouse");
  const stage = useRef<HTMLDivElement>(null);

  const heads = coaches.slice(0, lead);
  const rest = coaches.slice(lead);
  const half = Math.ceil(rest.length / 2);
  // Left wing is listed outer → inner so the innermost card sits on top.
  const left = rest.slice(0, half);
  const right = rest.slice(half);

  // Deal: on desktop the cards slide out from the centre of the spread.
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-deal]", el);
      const box = el.getBoundingClientRect();
      const mid = box.left + box.width / 2;
      const dist = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return mid - (r.left + r.width / 2);
      });
      gsap.from(cards, {
        x: (i: number) => dist[i],
        y: 60,
        rotate: (i: number) => (dist[i] > 0 ? 8 : -8),
        autoAlpha: 0,
        duration: 1.3,
        ease: "power3.out",
        stagger: { each: 0.07, from: "center" },
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });
    });
    mm.add("(max-width: 1023.98px)", () => {
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-deal]", el), {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  const card = (coach: Coach, head: boolean) => (
    <article
      tabIndex={0}
      aria-labelledby={`${coach.id}-name`}
      data-turned={turned === coach.id}
      onPointerDown={(e) => {
        pointer.current = e.pointerType;
      }}
      onClick={() => {
        // Mouse users already turn the card by hovering.
        if (pointer.current === "mouse") return;
        setTurned((id) => (id === coach.id ? null : coach.id));
      }}
      className={`group relative block aspect-[720/1082] cursor-pointer select-none outline-none [perspective:1800px] [-webkit-tap-highlight-color:transparent] focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ocean ${CARD_RADIUS}`}
    >
      <div
        className={`relative h-full w-full transform-3d transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.25,1)] motion-reduce:duration-0 ${TURNED}`}
      >
        {/* Face */}
        <div
          className={`absolute inset-0 overflow-hidden backface-hidden ${
            head
              ? "shadow-[0_0_0_1px_rgba(211,181,137,0.55),0_0_48px_-6px_rgba(211,181,137,0.5),0_30px_60px_-30px_rgba(0,0,0,0.9)]"
              : "shadow-[0_28px_50px_-24px_rgba(0,0,0,0.9)]"
          } ${CARD_RADIUS}`}
        >
          <Image
            src={coach.image}
            alt=""
            width={coachCardSize.width}
            height={coachCardSize.height}
            unoptimized
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Back: the octopus, dimming under the coach's record */}
        <div
          className={`absolute inset-0 overflow-hidden rotate-y-180 backface-hidden shadow-[0_0_38px_-6px_rgba(211,181,137,0.4)] ${CARD_RADIUS}`}
        >
          <Image
            src={coachCardBack}
            alt=""
            width={coachCardSize.width}
            height={coachCardSize.height}
            unoptimized
            draggable={false}
            className="h-full w-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,rgba(8,17,28,0.8),rgba(6,12,20,0.94))] opacity-0 transition-opacity duration-200 ease-luxe ${DIM_IN}`}
            aria-hidden
          />
          <div
            className={`@container absolute inset-[6%_7%] flex translate-y-3 flex-col justify-center text-center opacity-0 transition-[opacity,translate] duration-150 ease-luxe ${TEXT_IN}`}
          >
            <p className="font-monument text-[clamp(0.5rem,4.4cqw,0.75rem)] uppercase tracking-[0.28em] text-gold">
              {coach.role}
            </p>
            <h3
              id={`${coach.id}-name`}
              className="mt-[5cqw] font-display text-[clamp(0.9375rem,10.5cqw,1.875rem)] font-semibold leading-[1.05] text-limestone"
            >
              {coach.name}
            </h3>
            <span className="mx-auto mt-[6cqw] block h-px w-[22cqw] bg-gold/70" aria-hidden />
            <ul className="mt-[6cqw] space-y-[4.5cqw] text-[clamp(0.5625rem,5.8cqw,0.9375rem)] leading-[1.45] text-limestone-soft">
              {coach.achievements.map((line) => (
                <li key={line} className="text-balance">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );

  /** One card of a wing; `side` mirrors the fan. */
  const wingCard = (coach: Coach, step: number, side: -1 | 1, overlap: boolean) => (
    <li
      key={coach.id}
      style={{ "--r": `${side * FAN[step].r}deg`, "--y": `${FAN[step].y}%`, "--z": 10 - step } as CSSProperties}
      className={`relative z-[var(--z)] w-[40cqw] shrink-0 snap-center md:w-[27cqw] lg:w-[calc(var(--u)*0.74)] lg:hover:[scale:1.35] lg:hover:[translate:0_-4%] lg:focus-within:[scale:1.35] lg:focus-within:[translate:0_-4%] ${
        overlap ? "lg:ml-[calc(var(--u)*-0.3)]" : ""
      } ${LIFT}`}
    >
      <div data-deal>{card(coach, false)}</div>
    </li>
  );

  return (
    <div
      ref={stage}
      className="@container/stage flex flex-col items-center [--u:min(21rem,17.5cqw)] lg:flex-row lg:items-center lg:justify-center lg:pb-[calc(var(--u)*0.3)] lg:pt-[calc(var(--u)*0.12)]"
    >
      {/* Head coaches: centre of the spread, lit from behind */}
      <div className="relative lg:order-2 lg:mx-[calc(var(--u)*0.12)]">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(211,181,137,0.16),rgba(185,146,97,0.06)_50%,transparent)]"
          aria-hidden
        />
        <ul className="relative flex gap-[4cqw] lg:gap-[calc(var(--u)*0.08)]">
          {heads.map((coach, i) => (
            <li
              key={coach.id}
              style={{ "--r": `${HEAD_TILT[i % 2]}deg`, "--y": "0%" } as CSSProperties}
              className={`relative w-[min(47cqw,19rem)] lg:w-[var(--u)] lg:hover:[translate:0_-3%] lg:focus-within:[translate:0_-3%] ${LIFT}`}
            >
              <div data-deal>{card(coach, true)}</div>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex items-center justify-center gap-3 font-monument text-[0.6875rem] uppercase tracking-[0.32em] text-gold lg:absolute lg:inset-x-0 lg:top-full lg:mt-[calc(var(--u)*0.14)]">
          <span className="h-px w-8 bg-gold/50" aria-hidden />
          Head Coaches
          <span className="h-px w-8 bg-gold/50" aria-hidden />
        </p>
      </div>

      {/* Wings: one swipeable row on small screens, two fans either side on desktop */}
      <div className="mt-8 flex w-[calc(100%+2*clamp(1.25rem,5vw,6rem))] snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,5vw,6rem)] py-4 [scrollbar-width:none] sm:gap-4 lg:contents">
        <ul className="flex shrink-0 gap-3 sm:gap-4 lg:order-1 lg:gap-0">
          {left.map((coach, i) => wingCard(coach, left.length - 1 - i, -1, i > 0))}
        </ul>
        <ul className="flex shrink-0 gap-3 sm:gap-4 lg:order-3 lg:gap-0">
          {right.map((coach, i) => wingCard(coach, i, 1, i > 0))}
        </ul>
      </div>
    </div>
  );
}
