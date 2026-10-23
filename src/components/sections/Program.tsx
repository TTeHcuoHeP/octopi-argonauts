"use client";

import { programInclusions, scheduleNote, typicalSession } from "@/data/program";
import { site } from "@/data/site";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { useReveal } from "@/animations/useReveal";

/** Section 05 — Inside the Program */
export function Program() {
  const ref = useReveal<HTMLElement>({ stagger: 0.06 });
  const total = typicalSession.reduce((n, s) => n + s.minutes, 0);

  return (
    <section ref={ref} id="program" aria-labelledby="program-title" className="section relative bg-ocean-deep">
      <div className="site-container">
        <SectionIntro
          index="05"
          eyebrow="Inside the Program"
          title={<span id="program-title">Fifty weeks. One disciplined rhythm.</span>}
          lede="A clear, repeatable structure — so that the hard work of improvement becomes a habit rather than an intention."
        />

        {/* Key figures */}
        <dl className="mt-16 grid grid-cols-2 gap-y-10 border-y border-line py-10 md:grid-cols-4">
          {[
            { k: "Weeks", v: String(site.membership.weeks) },
            { k: "Hours live, weekly", v: String(site.schedule.durationHours) },
            { k: "Session day", v: site.schedule.day },
            { k: "Pacific Time", v: site.schedule.time },
          ].map((item) => (
            <div key={item.k} data-reveal>
              <dt className="eyebrow-muted">{item.k}</dt>
              <dd className="mt-3 font-display text-3xl text-limestone md:text-4xl">{item.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid gap-16 lg:mt-24 lg:grid-cols-12">
          {/* Inclusions */}
          <div className="lg:col-span-6">
            <p className="eyebrow" data-reveal>
              The membership includes
            </p>
            <ul className="mt-8">
              {programInclusions.map((item) => (
                <li
                  key={item.label}
                  className="grid gap-1 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
                  data-reveal
                >
                  <span className="text-[1.0625rem] leading-snug text-limestone">{item.label}</span>
                  <span className="text-xs tracking-[0.18em] text-stone uppercase sm:text-right">
                    {item.detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-stone" data-reveal>
              {scheduleNote}
            </p>
          </div>

          {/* A typical session */}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow" data-reveal>
              A typical weekly session
            </p>
            <p className="mt-4 font-display text-3xl text-limestone" data-reveal>
              {site.schedule.day}, {site.schedule.time}
            </p>

            {/* Proportional time bar */}
            <div className="mt-10 flex h-px w-full gap-1" aria-hidden data-reveal>
              {typicalSession.map((s, i) => (
                <span
                  key={s.title}
                  className={i === 0 ? "bg-stone" : "bg-gold"}
                  style={{ width: `${(s.minutes / total) * 100}%` }}
                />
              ))}
            </div>

            <ol className="mt-8 space-y-10">
              {typicalSession.map((s) => (
                <li key={s.title} className="grid grid-cols-[5.5rem_1fr] gap-6" data-reveal>
                  <div>
                    <span className="font-display text-4xl font-light leading-none text-gold">
                      {s.minutes}
                    </span>
                    <span className="eyebrow-muted mt-2 block text-[0.5625rem]">min · approx.</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-limestone">{s.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.7] text-limestone-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-10 border-t border-line pt-6 text-sm text-stone" data-reveal>
              Session recordings are available to members who cannot attend live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
