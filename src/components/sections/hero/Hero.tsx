"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APPLY_URL, site } from "@/data/site";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { HeroSequence } from "./HeroSequence";

/**
 * Section 01 — Hero.
 * Typography-led composition on the left; the golden compass asset lives in the
 * right of the background frame sequence, which turns with the cursor. Entrance sequence: eyebrow → headline → support → CTA.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.from("[data-hero='eyebrow']", { autoAlpha: 0, y: 12, duration: 0.9 })
        .from(
          "[data-hero='headline'] > span",
          { autoAlpha: 0, y: 40, duration: 1.3, stagger: 0.12, ease: "power4.out" },
          "-=0.5",
        )
        .from("[data-hero='support']", { autoAlpha: 0, y: 18, duration: 1 }, "-=0.8")
        .from("[data-hero='copy']", { autoAlpha: 0, y: 18, duration: 1 }, "-=0.7")
        .from("[data-hero='meta'] > *", { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.1 }, "-=0.7")
        .from("[data-hero='cta'] > *", { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.12 }, "-=0.6")
        .from("[data-hero='note']", { autoAlpha: 0, duration: 1 }, "-=0.5")
        .from("[data-hero='scroll']", { autoAlpha: 0, duration: 1 }, "-=0.8");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ocean pt-[var(--header-height)]"
    >
      <HeroSequence />

      <div className="site-container relative z-10 w-full py-24 md:py-28 lg:py-32">
        <div className="max-w-[46rem] lg:max-w-[52rem]">
          <p className="eyebrow" data-hero="eyebrow">
            Exclusive 2027 Membership
          </p>

          <h1
            id="hero-title"
            className="monument mt-8 flex flex-col text-limestone"
            data-hero="headline"
          >
            <span className="block text-[clamp(2.75rem,9.5vw,8.25rem)] leading-[0.95]">
              Argonauts
            </span>
            <span className="block text-[clamp(2.75rem,9.5vw,8.25rem)] leading-[0.95] text-gold">
              2027
            </span>
          </h1>

          <p
            className="mt-8 font-display text-[clamp(1.5rem,2.8vw,2.375rem)] italic leading-[1.15] text-limestone"
            data-hero="support"
          >
            {site.tagline}
          </p>

          <p
            className="mt-7 max-w-[34rem] text-[1.0625rem] leading-[1.75] text-limestone-soft md:text-lg"
            data-hero="copy"
          >
            A year-long journey alongside poker&rsquo;s greatest minds. World-class coaching,
            personal mentorship, and an exclusive fellowship of players pursuing excellence.
          </p>

          <ul
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.26em] text-limestone"
            data-hero="meta"
          >
            <li>Limited to 40 Participants</li>
            <li className="hidden h-4 w-px bg-gold/70 sm:block" aria-hidden />
            <li>Invitation Only</li>
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" data-hero="cta">
            <Button href={APPLY_URL} size="lg">
              Apply to Join
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button href="#coaches" variant="ghost" size="lg">
              Explore the Program
            </Button>
          </div>

          <p className="mt-8 text-sm text-stone" data-hero="note">
            Applications open {site.membership.applicationWindow}.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        data-hero="scroll"
        aria-hidden
      >
        <span className="eyebrow-muted">Scroll</span>
        <span className="block h-12 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </div>
    </section>
  );
}
