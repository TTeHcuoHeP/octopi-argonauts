"use client";

import { faq } from "@/data/faq";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Accordion } from "@/components/ui/Accordion";
import { useReveal } from "@/animations/useReveal";

/** Section 08a — FAQ */
export function Faq() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} id="faq" aria-labelledby="faq-title" className="section relative">
      <div className="site-container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionIntro
            index="08"
            eyebrow="Questions"
            title={<span id="faq-title">Before you apply.</span>}
            lede="The essentials, answered. Anything not yet confirmed is marked as such — we would rather tell you so than guess."
            compact
          />
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          <Accordion items={faq} defaultOpen={faq[0].id} />
        </div>
      </div>
    </section>
  );
}
