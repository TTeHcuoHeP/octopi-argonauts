"use client";

import { useLayoutEffect, useRef } from "react";
import { coaches, leadCoachCount } from "@/data/coaches";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { CoachCards } from "./coaches/CoachCards";

/** Section 03 — The Minds Guiding the Voyage: the coaches as playing cards. */
export function Coaches() {
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
    <section id="coaches" aria-labelledby="coaches-title" className="section relative overflow-x-clip">
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

        <div className="mt-12 md:mt-16">
          <CoachCards coaches={coaches} lead={leadCoachCount} />
        </div>
      </div>
    </section>
  );
}
