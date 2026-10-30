"use client";

import { questCheckpoints } from "@/data/quest";
import { useReveal } from "@/animations/useReveal";
import { QuestJourney } from "./quest/QuestJourney";
import { Rewards } from "./quest/Rewards";

/** Section 04 — The Quest: a scroll-driven voyage toward the Golden Fleece */
export function Quest() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });

  return (
    <section ref={ref} id="quest" aria-labelledby="quest-title" className="relative bg-ocean">
      {/* The map opens the section on its own; the title surfaces inside the journey. */}
      <QuestJourney />

      {/*
        The chapters as plain text: always available to assistive tech, and shown
        on screen when motion is reduced (the chart above is then static).
      */}
      <div className="site-container sr-only motion-reduce:not-sr-only motion-reduce:pt-16">
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {questCheckpoints.map((cp, i) => (
            <li key={cp.id} className="border-t border-line pt-6">
              <p className="eyebrow text-[0.625rem]">Chapter {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-2xl text-limestone">{cp.headline ?? cp.title}</h3>
              {cp.headline && <p className="mt-2 font-display text-lg italic text-limestone-soft">{cp.title}</p>}
              {cp.description.map((line) => (
                <p key={line} className="mt-2 text-[0.9375rem] leading-[1.65] text-limestone-soft">
                  {line}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </div>

      <Rewards />
    </section>
  );
}
