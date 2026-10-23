"use client";

import { ArrowRight } from "lucide-react";
import { APPLY_URL, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { CompassMark } from "@/components/graphics/CompassMark";
import { useReveal } from "@/animations/useReveal";

/** Section 08b — Final CTA */
export function FinalCta() {
  const ref = useReveal<HTMLElement>({ stagger: 0.12 });

  return (
    <section
      ref={ref}
      id="apply"
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-ocean-deep py-32 md:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,color-mix(in_srgb,var(--gold)_14%,transparent),transparent_70%)]"
      />
      <div className="site-container relative text-center">
        <div className="mx-auto flex justify-center text-gold" data-reveal>
          <CompassMark className="h-12 w-12" />
        </div>
        <div className="rule-gold mx-auto mt-10 w-40" data-reveal="line" />

        <h2
          id="cta-title"
          className="monument mx-auto mt-12 max-w-5xl text-[clamp(1.75rem,5vw,4.25rem)] leading-[1.15] text-limestone"
          data-reveal
        >
          Your journey <span className="text-gold">begins here.</span>
        </h2>

        <p
          className="mx-auto mt-10 max-w-2xl font-display text-[clamp(1.25rem,2.2vw,1.75rem)] italic leading-[1.4] text-limestone-soft"
          data-reveal
        >
          Fifty weeks. Forty members. A fellowship of the world&rsquo;s best, and a year you
          will measure the rest of your poker life against.
        </p>

        <div className="mt-14 flex flex-col items-center gap-6" data-reveal>
          <Button href={APPLY_URL} size="lg">
            <span className="sm:hidden">Apply to Join</span>
            <span className="hidden sm:inline">Apply to Join Argonauts 2027</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <p className="eyebrow-muted">
            Applications {site.membership.applicationWindow} · Invitation only
          </p>
        </div>
      </div>
    </section>
  );
}
