"use client";

import { useLayoutEffect, useRef } from "react";
import { getGsap } from "./gsap";
import { isCompactViewport, prefersReducedMotion } from "@/lib/motion";

type RevealOptions = {
  /** Stagger between children marked with [data-reveal] (seconds). */
  stagger?: number;
  /** Vertical travel in px. */
  y?: number;
  /** ScrollTrigger start position. */
  start?: string;
};

/**
 * Gentle scroll-triggered reveal for any descendants carrying `data-reveal`.
 * Elements render fully visible by default; GSAP only hides them at runtime
 * when motion is permitted, so the page stays usable without JS or animation.
 *
 * Optional `data-reveal="line"` draws a horizontal rule from left to right.
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || prefersReducedMotion()) return;

    const { gsap } = getGsap();
    const compact = isCompactViewport();
    const { stagger = 0.08, y = compact ? 16 : 28, start = "top 82%" } = options;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-reveal='line'])");
      const lines = gsap.utils.toArray<HTMLElement>("[data-reveal='line']");

      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y });
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: compact ? 0.8 : 1.1,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: scope, start, once: true },
        });
      }

      lines.forEach((line) => {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: line, start: "top 90%", once: true },
        });
      });
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
