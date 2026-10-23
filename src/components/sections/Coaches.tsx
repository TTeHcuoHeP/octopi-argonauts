"use client";

import { useLayoutEffect, useRef } from "react";
import { coaches, initialCoachId, programLeadership } from "@/data/coaches";
import { useReveal } from "@/animations/useReveal";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { CoachCarousel } from "./coaches/CoachCarousel";

/** Section 02 — The Minds Guiding the Voyage (coaches) */
export function Coaches() {
  const ref = useReveal<HTMLElement>();
  const introRef = useRef<HTMLElement>(null);

  // Heading and lede sharpen from a blur as the section scrolls in (scrubbed).
  useLayoutEffect(() => {
    const intro = introRef.current;
    if (!intro || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-focus]",
        { autoAlpha: 0, filter: "blur(14px)", y: 18 },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          y: 0,
          ease: "none",
          stagger: 0.35,
          scrollTrigger: { trigger: intro, start: "top 90%", end: "top 45%", scrub: 0.6 },
        },
      );
    }, intro);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="coaches" aria-labelledby="coaches-title" className="section relative overflow-x-clip">
      <div className="site-container">
        {/* Centred opener — comes into focus as it scrolls into view */}
        <header ref={introRef} className="mx-auto max-w-5xl text-center">
          <h2
            id="coaches-title"
            data-focus
            className="bg-gradient-to-b from-gold-light to-gold bg-clip-text pb-2 text-[clamp(2.5rem,5.6vw,5rem)] text-transparent"
          >
            The Minds Guiding the Voyage.
          </h2>
          <p
            data-focus
            className="mx-auto mt-5 max-w-[52rem] font-display text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.45] text-limestone-soft"
          >
            Weekly lectures and open Q&amp;A with players whose records define the modern
            tournament game — and a resident mentor who knows your game personally.
          </p>
        </header>

        <div className="mt-12 md:mt-16" data-reveal>
          <CoachCarousel coaches={coaches} initialId={initialCoachId} />
        </div>

        {/* Leadership */}
        <div className="mt-28 grid gap-12 border-t border-line pt-14 lg:mt-36 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3" data-reveal>
            Program Leadership
          </p>
          <dl className="grid gap-10 sm:grid-cols-2 lg:col-span-9">
            {programLeadership.map((person) => (
              <div key={person.id} data-reveal>
                <dt className="font-display text-3xl text-limestone">{person.name}</dt>
                <dd className="eyebrow mt-3 text-[0.625rem]">{person.role}</dd>
                <dd className="mt-5 max-w-sm text-[0.9375rem] leading-[1.7] text-limestone-soft">
                  {person.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
