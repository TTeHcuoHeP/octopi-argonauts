"use client";

import { ArrowRight } from "lucide-react";
import { APPLY_URL, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { useReveal } from "@/animations/useReveal";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** Section 07 — Membership & Applications */
export function Membership() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });
  const m = site.membership;

  const schedule = [
    { label: "Upon acceptance", amount: m.deposit },
    { label: "Quarter two", amount: m.installmentAmount },
    { label: "Quarter three", amount: m.installmentAmount },
    { label: "Quarter four", amount: m.installmentAmount },
  ];

  return (
    <section ref={ref} id="membership" aria-labelledby="membership-title" className="section relative bg-ocean-deep">
      <div className="site-container">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Left: narrative + price */}
          <div className="lg:col-span-5">
            <SectionIntro
              index="07"
              eyebrow="Membership & Applications"
              title={<span id="membership-title">An investment in a year of excellence.</span>}
              compact
            />

            <div className="mt-14 border-t border-line pt-10" data-reveal>
              <p className="eyebrow-muted">Annual membership</p>
              <p className="mt-4 font-display text-[clamp(3.5rem,7vw,6rem)] font-light leading-none text-limestone">
                {usd(m.price)}
              </p>
              <p className="mt-6 max-w-sm text-[0.9375rem] leading-[1.7] text-limestone-soft">
                Paid as {usd(m.deposit)} upon acceptance, followed by {m.installments} quarterly
                installments of {usd(m.installmentAmount)}.
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

          {/* Right: payment schedule + admission details */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow" data-reveal>
              Payment schedule
            </p>

            {/* Golden progression line with four stations */}
            <ol className="relative mt-10 grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-y-0">
              <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-line-gold md:block" aria-hidden data-reveal="line" />
              {schedule.map((s, i) => (
                <li key={s.label} className="relative pr-6 md:pt-8" data-reveal>
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 hidden h-[11px] w-[11px] rounded-full border border-gold bg-ocean-deep md:block"
                  />
                  <p className="eyebrow-muted text-[0.5625rem]">0{i + 1}</p>
                  <p className="mt-3 font-display text-3xl text-limestone">{usd(s.amount)}</p>
                  <p className="mt-2 text-xs tracking-[0.12em] text-stone uppercase">{s.label}</p>
                </li>
              ))}
            </ol>

            <dl className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
              {[
                { k: "Maximum members", v: String(m.maxMembers) },
                { k: "Applications", v: m.applicationWindow },
                {
                  k: "Admission",
                  v: "By invitation only, following an application process",
                },
                { k: "Admission waves", v: `Organised in waves of ${m.waveSize}` },
              ].map((item) => (
                <div key={item.k} data-reveal>
                  <dt className="eyebrow-muted">{item.k}</dt>
                  <dd className="mt-3 font-display text-2xl leading-snug text-limestone">{item.v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 text-sm italic leading-relaxed text-stone" data-reveal>
              Argonauts is a high-ticket membership admitted by application. There is no
              checkout — qualified applicants are invited to join following a review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
