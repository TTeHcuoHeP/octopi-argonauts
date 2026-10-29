import Image from "next/image";
import type { ReactNode } from "react";

/** Shared stroke style for the gold line icons. */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Each part of an icon moves about its own anchor (set in viewBox units). */
const PART = "transition-transform duration-500 ease-luxe [transform-box:view-box]";

/** Three cards that fan wider on hover. */
function CardsIcon() {
  const card = (angle: string, hover: string, front = false) => (
    <g className={`${PART} [transform-origin:24px_42px] ${angle} ${hover}`}>
      <rect x="15" y="10" width="18" height="27" rx="2.5" {...STROKE} className={front ? "fill-ocean-deep" : "fill-ocean"} />
      <path d="M18.5 13.5v2.5M29.5 33.5V31" {...STROKE} strokeWidth={1.1} />
      {front && (
        <path
          d="M24 17.5c-2.6 3-5.2 4.7-5.2 7a2.6 2.6 0 0 0 4.3 2l-.9 2.7h3.6l-.9-2.7a2.6 2.6 0 0 0 4.3-2c0-2.3-2.6-4-5.2-7Z"
          fill="currentColor"
        />
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      {card("-rotate-[22deg]", "group-hover:-rotate-[32deg]")}
      {card("-rotate-[6deg]", "group-hover:-rotate-[10deg]")}
      {card("rotate-[12deg]", "group-hover:rotate-[20deg]", true)}
    </svg>
  );
}

/** A chess knight that rears up on hover. */
function KnightIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      <g className={`${PART} [transform-origin:24px_40px] group-hover:-translate-y-[2px] group-hover:-rotate-[9deg]`}>
        {/* Head and neck */}
        <path
          d="M17 36c0-4.5 2.2-7.4 5.2-10.2 1.3-1.2 1.6-2.6.9-3.6-1.5.9-3.4 1.4-5.4 1.3-1.6-.1-2.7-1.4-2.4-2.9.6-2.6 2.5-5.3 5.4-7.6l-.6-3.6 2.8 1.9c1.2-.4 2.4-.5 3.7-.3 6.2 1 9.6 7.2 9.6 14.6 0 3.8-.8 7.4-1.6 10.4"
          {...STROKE}
        />
        <path d="M27.5 12.5c3.6 1.3 6.2 4.6 6.9 9.4" {...STROKE} strokeWidth={1.1} />
        <circle cx="22.4" cy="15.6" r="0.9" fill="currentColor" />
        <path d="M16.6 21.4h1.1" {...STROKE} strokeWidth={1.1} />
      </g>
      {/* Base */}
      <path d="M15.5 36h18.5" {...STROKE} />
      <path d="M14 40.5c0-2 1.2-3.2 3-3.2h15c1.8 0 3 1.2 3 3.2v1.5H14Z" {...STROKE} />
    </svg>
  );
}

/** A scroll with a quill that writes on hover. */
function ScrollIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      {/* Sheet with its rolled ends */}
      <path d="M13 9.5h17.5a3 3 0 0 1 3 3V36" {...STROKE} />
      <path d="M13 9.5a3 3 0 0 0-3 3v2.5h6v-2.5a3 3 0 0 0-3-3Z" {...STROKE} />
      <path d="M16 15v21.5" {...STROKE} />
      <path d="M12 36.5h21.5a3 3 0 0 1 0 6H15a3 3 0 0 1 0-6" {...STROKE} />
      {/* Lines of writing */}
      <path d="M20 17h8.5M20 21.5h5M20 26h7.5M20 30.5h4" {...STROKE} strokeWidth={1.1} />
      {/* Quill */}
      <g className="[transform-box:view-box] [transform-origin:31px_34px] group-hover:animate-[quill-write_1.1s_ease-in-out_infinite]">
        <path
          d="M43.5 8.5c-6 .8-10.6 5.4-12.4 12.2l-1.6 9.5c2.3-1.3 4.5-3.4 6.4-5.8 4.6-5.6 7.3-10.6 7.6-15.9Z"
          {...STROKE}
          className="fill-ocean"
        />
        <path d="M30.5 34l3.8-11.4M36.6 15.2l-2.3 7.4" {...STROKE} strokeWidth={1.1} />
      </g>
    </svg>
  );
}

const features: { label: [string, string]; icon: ReactNode }[] = [
  { label: ["Hand-History", "Reviews"], icon: <CardsIcon /> },
  { label: ["Strategic", "Feedback"], icon: <KnightIcon /> },
  { label: ["Ongoing Personal", "Guidance"], icon: <ScrollIcon /> },
];

/**
 * Sam Greenwood — the resident coach who leads the crew through the whole
 * voyage. His portrait spans the top and sinks into the night ground; the copy
 * sits on that dark lower edge. Static; only the three emblems answer the cursor.
 */
export function Mentor() {
  return (
    <section id="mentor" aria-labelledby="mentor-title" className="relative pb-[clamp(4rem,8vw,7rem)]">
      {/* Portrait: fades out at the foot and the sides into the page ground */}
      <div className="relative aspect-square w-full overflow-hidden sm:aspect-[1671/941]" aria-hidden>
        <Image
          src="/images/mentor/sam-greenwood.webp"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-[52%_30%] sm:object-[55%_20%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ocean)_0%,transparent_14%,transparent_38%,color-mix(in_srgb,var(--ocean)_70%,transparent)_58%,var(--ocean)_82%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ocean)_0%,transparent_14%,transparent_86%,var(--ocean)_100%)]" />
      </div>

      <div className="site-container relative -mt-[22vw] text-center sm:-mt-[24vw]">
        <h2
          id="mentor-title"
          className="font-display text-[clamp(3.5rem,8.5vw,8rem)] font-semibold leading-[0.95] tracking-[-0.01em] text-limestone [text-shadow:0_4px_30px_rgba(5,12,22,0.85)]"
        >
          Sam Greenwood
        </h2>
        <p className="mt-5 text-[clamp(1.25rem,2.1vw,2rem)] font-light tracking-[0.03em] text-limestone [text-shadow:0_2px_18px_rgba(5,12,22,0.9)]">
          Your personal trainer throughout the journey.
        </p>
        <p className="mx-auto mt-5 max-w-[52rem] text-balance text-[clamp(1rem,1.25vw,1.1875rem)] leading-[1.7] text-limestone-soft">
          Direct access to Sam Greenwood for hand-history reviews, strategic questions, and
          personalized guidance throughout the entire program.
        </p>

        <ul className="mx-auto mt-14 grid max-w-[68rem] gap-12 sm:grid-cols-3 sm:gap-0 md:mt-16">
          {features.map(({ label, icon }, i) => (
            <li key={label.join(" ")} className="group relative flex flex-col items-center px-4">
              {/* Divider between items */}
              {i > 0 && (
                <span
                  className="absolute left-0 top-[12%] hidden h-[42%] w-px bg-gradient-to-b from-transparent via-gold/70 to-transparent sm:block"
                  aria-hidden
                />
              )}
              <div className="h-24 w-24 text-gold transition-[translate,filter,color] duration-500 ease-luxe group-hover:-translate-y-1.5 group-hover:text-gold-light group-hover:[filter:drop-shadow(0_0_14px_rgba(211,181,137,0.55))] lg:h-32 lg:w-32">
                {icon}
              </div>
              <p className="mt-7 text-[0.9375rem] uppercase leading-[1.7] tracking-[0.28em] text-limestone-soft transition-colors duration-500 ease-luxe group-hover:text-limestone lg:text-[1.0625rem]">
                {label[0]}
                <br />
                {label[1]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
