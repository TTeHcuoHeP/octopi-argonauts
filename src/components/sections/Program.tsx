"use client";

import { useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { programInclusions, scheduleNote, typicalSession } from "@/data/program";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

export const PROGRAM_ID = "program";

/**
 * Opens the program popover. Native `popovertarget`, so it works without JS;
 * the popover itself handles Esc and click-outside.
 */
export function ProgramButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      popoverTarget={PROGRAM_ID}
      className={cn(
        "group inline-flex items-center gap-3 border border-gold/60 px-6 py-3.5 font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-gold transition-[border-color,color,background-color,box-shadow] duration-500 ease-luxe hover:border-gold-light hover:bg-gold/10 hover:text-gold-light hover:shadow-[0_0_24px_-6px_rgba(211,181,137,0.55)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-light",
        className,
      )}
    >
      {children ?? "View the full program"}
      <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" strokeWidth={1.5} />
    </button>
  );
}

/**
 * Inside the Program — kept off the page and shown in a popover banner on demand
 * (the "View the full program" buttons and the "The Program" nav links).
 */
export function Program() {
  const total = typicalSession.reduce((n, s) => n + s.minutes, 0);

  // Nav links to #program open the popover instead of jumping to a hidden element.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.(`a[href="#${PROGRAM_ID}"]`);
      const popover = document.getElementById(PROGRAM_ID);
      if (!link || !popover) return;
      e.preventDefault();
      popover.showPopover();
    };
    document.addEventListener("click", onClick);
    // A shared link to #program opens it straight away.
    if (location.hash === `#${PROGRAM_ID}`) document.getElementById(PROGRAM_ID)?.showPopover();
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      id={PROGRAM_ID}
      popover="auto"
      role="dialog"
      aria-labelledby="program-title"
      className="program-popover m-auto max-h-[calc(100dvh-2rem)] w-[min(76rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain border border-line-gold bg-ocean-deep p-0 text-limestone shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] [font-variant-numeric:lining-nums] [scrollbar-width:thin]"
    >
      <div className="relative px-6 py-10 sm:px-10 md:px-14 md:py-14">
        <button
          type="button"
          popoverTarget={PROGRAM_ID}
          popoverTargetAction="hide"
          aria-label="Close the program"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold transition-colors duration-300 hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-light md:right-6 md:top-6"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <p className="eyebrow">Inside the Program</p>
        <h2
          id="program-title"
          className="mt-4 max-w-[90%] font-display text-[clamp(2rem,4.2vw,3.75rem)] font-light leading-[1.05] text-limestone"
        >
          Fifty weeks. One disciplined rhythm.
        </h2>
        <p className="mt-5 max-w-[36rem] text-[0.9375rem] leading-[1.7] text-limestone-soft md:text-base">
          A clear, repeatable structure — so that the hard work of improvement becomes a habit rather
          than an intention.
        </p>

        {/* Key figures */}
        <dl className="mt-10 grid grid-cols-2 gap-y-8 border-y border-line py-8 md:grid-cols-4">
          {[
            { k: "Weeks", v: String(site.membership.weeks) },
            { k: "Hours live, weekly", v: String(site.schedule.durationHours) },
            { k: "Session day", v: site.schedule.day },
            { k: "Pacific Time", v: site.schedule.time },
          ].map((item) => (
            <div key={item.k}>
              <dt className="eyebrow-muted">{item.k}</dt>
              <dd className="mt-3 font-display text-2xl text-limestone md:text-3xl">{item.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* Inclusions */}
          <div className="lg:col-span-6">
            <p className="eyebrow">The membership includes</p>
            <ul className="mt-6">
              {programInclusions.map((item) => (
                <li
                  key={item.label}
                  className="grid gap-1 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
                >
                  <span className="text-base leading-snug text-limestone">{item.label}</span>
                  <span className="text-xs tracking-[0.18em] text-stone uppercase sm:text-right">{item.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-stone">{scheduleNote}</p>
          </div>

          {/* A typical session */}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow">A typical weekly session</p>
            <p className="mt-4 font-display text-2xl text-limestone md:text-3xl">
              {site.schedule.day}, {site.schedule.time}
            </p>

            {/* Proportional time bar */}
            <div className="mt-8 flex h-px w-full gap-1" aria-hidden>
              {typicalSession.map((s, i) => (
                <span
                  key={s.title}
                  className={i === 0 ? "bg-stone" : "bg-gold"}
                  style={{ width: `${(s.minutes / total) * 100}%` }}
                />
              ))}
            </div>

            <ol className="mt-7 space-y-8">
              {typicalSession.map((s) => (
                <li key={s.title} className="grid grid-cols-[5rem_1fr] gap-5">
                  <div>
                    <span className="font-display text-4xl font-light leading-none text-gold">{s.minutes}</span>
                    <span className="eyebrow-muted mt-2 block text-[0.5625rem]">min · approx.</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-limestone md:text-2xl">{s.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.7] text-limestone-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-t border-line pt-5 text-sm text-stone">
              Session recordings are available to members who cannot attend live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
