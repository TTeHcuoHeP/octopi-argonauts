"use client";

import { ArrowRight } from "lucide-react";
import { APPLY_URL, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { useReveal } from "@/animations/useReveal";
import { ProgramButton } from "@/components/sections/Program";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** What a member would otherwise have to assemble alone — qualitative, no per-item prices. */
const value = [
  "Sam Greenwood as your private coach, all year",
  "Weekly lectures from the legends of tournament poker",
  "A structured study curriculum with homework, drills and quizzes",
  "Octopi Professional, plus 50% off every Octopi course",
  "The chance to win the one PGT Championship Dream Seat — a $500,000 freeroll in Las Vegas",
];

/** Section 05 — Membership & Applications: the price, the value behind it, and how to apply. */
export function Membership() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });
  const m = site.membership;

  return (
    <section ref={ref} id="membership" aria-labelledby="membership-title" className="section relative bg-ocean-deep">
      <div className="site-container">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Left: narrative + price */}
          <div className="lg:col-span-5">
            <SectionIntro
              index="05"
              eyebrow="Membership & Applications"
              title={<span id="membership-title">An investment in a year of excellence.</span>}
              compact
            />

            <div className="mt-14 border-t border-line pt-10" data-reveal>
              <p className="eyebrow-muted">Annual membership</p>
              <p className="mt-4 font-display text-[clamp(3.5rem,7vw,6rem)] font-light leading-none text-limestone">
                {usd(m.price)}
              </p>
              <p className="mt-4 font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-tight text-gold-light">
                or {usd(m.quarterly)} per quarter
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" data-reveal>
              <Button href={APPLY_URL} size="lg">
                Apply to Join
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
              <span className="text-sm text-stone">Applications {m.applicationWindow}</span>
            </div>
          </div>

          {/* Right: the value behind the price + admission details */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow" data-reveal>
              The value
            </p>
            <p
              className="mt-6 font-display text-[clamp(1.5rem,2.3vw,2.125rem)] leading-[1.3] text-limestone"
              data-reveal
            >
              If you hired Sam as your private coach, added weekly lectures from these legends and a
              structured study curriculum, you would be paying{" "}
              <span className="text-gold-light">many thousands of dollars every month.</span>
            </p>

            <ul className="mt-10 border-t border-line">
              {value.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-b border-line py-4 text-[0.9375rem] text-limestone md:text-base"
                  data-reveal
                >
                  <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] leading-[1.7] text-limestone-soft" data-reveal>
              In The Argonauts it all comes together in one year-long voyage — for a single membership.
            </p>
            <div className="mt-8" data-reveal>
              <ProgramButton />
            </div>

            <dl className="mt-14 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
              {[
                { k: "Applications", v: m.applicationWindow },
                { k: "Admission", v: "By invitation, after an application" },
                { k: "Admission waves", v: `Waves of ${m.waveSize}` },
              ].map((item) => (
                <div key={item.k} data-reveal>
                  <dt className="eyebrow-muted">{item.k}</dt>
                  <dd className="mt-3 font-display text-xl leading-snug text-limestone">{item.v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 text-sm italic leading-relaxed text-stone" data-reveal>
              The Argonauts is a high-ticket membership admitted by application. There is no
              checkout — qualified applicants are invited to join following a review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
