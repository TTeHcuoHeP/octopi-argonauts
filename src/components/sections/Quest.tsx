"use client";

import { pointSources, questCheckpoints, rewards } from "@/data/quest";
import { useReveal } from "@/animations/useReveal";
import { QuestJourney } from "./quest/QuestJourney";

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

      {/* How points are earned + rewards */}
      <div className="site-container pb-[clamp(5rem,11vw,10rem)] pt-[clamp(5rem,9vw,8rem)]">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal>
              How points are earned
            </p>
            <ul className="mt-8">
              {pointSources.map((src, i) => (
                <li
                  key={src}
                  className="flex items-baseline gap-6 border-b border-line py-4 text-[1.0625rem] text-limestone"
                  data-reveal
                >
                  <span className="font-display text-sm tracking-[0.2em] text-stone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {src}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm italic text-stone" data-reveal>
              Point mechanics are being finalised and will be shared with admitted members.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow" data-reveal>
              The rewards
            </p>
            <div className="mt-8 space-y-10">
              {rewards.map((r, i) => (
                <div key={r.id} className="grid grid-cols-[auto_1fr] gap-6" data-reveal>
                  <span className="mt-1 font-display text-4xl font-light leading-none text-gold">
                    {["I", "II", "III"][i]}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-limestone md:text-[1.75rem]">{r.title}</h3>
                    <p className="mt-2 max-w-md text-[0.9375rem] leading-[1.7] text-limestone-soft">
                      {r.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
