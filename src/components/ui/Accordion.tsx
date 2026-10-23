"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Accessible accordion: native <button> triggers with aria-expanded/controls,
 * each panel a labelled region. Height animates with CSS grid rows so it
 * works without JS-measured heights and respects reduced motion.
 */
export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);
  const baseId = useId();

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const open = openId === item.id;
        const btnId = `${baseId}-btn-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex w-full items-start gap-6 py-7 text-left transition-colors duration-500 hover:text-gold md:items-center md:gap-10"
              >
                <span className="mt-1 font-display text-sm tracking-[0.2em] text-stone md:mt-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-[1.375rem] leading-snug text-limestone transition-colors duration-500 group-hover:text-gold md:text-[1.625rem]">
                  {item.question}
                </span>
                <Plus
                  aria-hidden
                  strokeWidth={1}
                  className={cn(
                    "mt-1 h-5 w-5 shrink-0 text-gold transition-transform duration-500 ease-luxe md:mt-0",
                    open && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-luxe",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-8 pl-[calc(1.5rem+1.5rem)] text-[1rem] leading-[1.75] text-limestone-soft md:pl-[calc(2.5rem+1.5rem)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
