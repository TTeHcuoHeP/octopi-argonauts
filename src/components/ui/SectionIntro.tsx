import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionIntroProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Use a lighter heading size for secondary sections. */
  compact?: boolean;
};

/**
 * Editorial section opener: numbered index, gold eyebrow, serif headline, optional lede.
 */
export function SectionIntro({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  compact,
}: SectionIntroProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", className)}>
      <div
        className={cn(
          "flex items-center gap-4",
          align === "center" && "justify-center",
        )}
        data-reveal
      >
        <span className="font-display text-sm tracking-[0.2em] text-stone">{index}</span>
        <span className="h-px w-10 bg-gold/60" aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2
        className={cn(
          "mt-7 text-limestone",
          compact
            ? "text-[clamp(2.25rem,4.5vw,3.75rem)]"
            : "text-[clamp(2.5rem,5.6vw,4.75rem)]",
        )}
        data-reveal
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-7 max-w-[38rem] text-[1.0625rem] leading-[1.75] text-limestone-soft md:text-lg",
            align === "center" && "mx-auto",
          )}
          data-reveal
        >
          {lede}
        </p>
      )}
    </div>
  );
}
