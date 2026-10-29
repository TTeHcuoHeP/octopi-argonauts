"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APPLY_URL } from "@/data/site";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const HERO_IMAGE = "/hero/hero_argonauts_2.jpg";

const highlights = ["Small Study Groups", "50 Weeks of Mastery", "40 Members Maximum"];

/**
 * Section 01 — Hero.
 * The Argonauts round the chart table on deck (right); the offer reads on the
 * dark left of the frame. Entrance: eyebrow → headline → copy → spots → CTA → highlights.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.from("[data-hero='bg']", { autoAlpha: 0, scale: 1.04, duration: 1.8, ease: "power2.out" })
        .from("[data-hero='eyebrow'] > *", { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.12 }, "-=1.4")
        .from(
          "[data-hero='headline'] > span",
          { autoAlpha: 0, y: 40, duration: 1.3, stagger: 0.12, ease: "power4.out" },
          "-=0.6",
        )
        .from("[data-hero='copy']", { autoAlpha: 0, y: 18, duration: 1 }, "-=0.8")
        .from("[data-hero='spots']", { autoAlpha: 0, y: 14, duration: 0.9 }, "-=0.7")
        .from("[data-hero='cta']", { autoAlpha: 0, y: 14, duration: 0.9 }, "-=0.6")
        .from("[data-hero='meta'] > *", { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.1 }, "-=0.6");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ocean-deep pt-[var(--header-height)] [font-variant-numeric:lining-nums]"
    >
      {/* Background: the crew at the chart table; legibility veils keep the copy crisp */}
      <div className="absolute inset-0" aria-hidden>
        <div data-hero="bg" className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] md:object-right"
          />
        </div>
        {/* Phones: the crew sits behind the copy, so the veil is deeper */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-deep/80 to-ocean-deep md:hidden" />
        <div className="absolute inset-y-0 left-0 hidden w-[70%] bg-gradient-to-r from-ocean-deep via-ocean-deep/55 to-transparent md:block" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ocean-deep/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ocean to-transparent" />
      </div>

      <div className="site-container relative z-10 w-full py-20 md:py-24 lg:py-28">
        <div className="max-w-[40rem] lg:max-w-[46rem]">
          <div data-hero="eyebrow">
            <p className="font-display text-[0.9375rem] font-medium uppercase tracking-[0.42em] text-limestone md:text-lg">
              The Argonauts
            </p>
            <span className="mt-4 block h-px w-16 bg-gold" aria-hidden />
          </div>

          <h1
            id="hero-title"
            className="mt-8 flex flex-col font-display text-[clamp(2.75rem,6.2vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.01em]"
            data-hero="headline"
          >
            <span className="block bg-gradient-to-b from-[color-mix(in_srgb,var(--gold-light)_65%,var(--limestone))] to-gold bg-clip-text pb-[0.06em] text-transparent">
              The Ultimate
            </span>
            <span className="block bg-gradient-to-b from-[color-mix(in_srgb,var(--gold-light)_65%,var(--limestone))] to-gold bg-clip-text pb-[0.06em] text-transparent">
              Tournament Poker
            </span>
            <span className="block text-limestone">Study Group</span>
          </h1>

          <p
            className="mt-8 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-limestone-soft md:text-lg"
            data-hero="copy"
          >
            An exclusive, year-long poker mastery experience built around small study groups,
            world-class coaching, and personal mentorship from poker&rsquo;s greatest minds.
          </p>

          <p
            className="mt-8 font-display text-[clamp(1.5rem,2.3vw,2.125rem)] font-semibold leading-tight text-gold-light"
            data-hero="spots"
          >
            Only 10 Spots Now Open
          </p>

          <div className="mt-7" data-hero="cta">
            <Button
              href={APPLY_URL}
              size="lg"
              className="h-16 w-full bg-gradient-to-b from-gold-light to-gold px-10 font-display text-[1.0625rem] font-semibold tracking-[0.18em] shadow-[0_18px_40px_-18px_rgba(185,146,97,0.7),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 sm:w-auto sm:min-w-[22rem] md:h-[4.25rem] md:text-lg"
            >
              Apply to Join
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </div>

          <ul
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] tracking-[0.06em] text-limestone-soft sm:gap-x-3"
            data-hero="meta"
          >
            {highlights.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {/* Dividers only where the row stays on one line */}
                {i > 0 && (
                  <span className="hidden text-gold sm:inline" aria-hidden>
                    ·
                  </span>
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
