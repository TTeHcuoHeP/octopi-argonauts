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

/** A figure that lifts its head on hover. */
function PersonIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      <circle cx="24" cy="17" r="6.5" {...STROKE} className={`${PART} group-hover:-translate-y-[2px]`} />
      <path d="M12.5 38.5v-1.8c0-5.6 4.5-10.2 10.1-10.2h2.8c5.6 0 10.1 4.6 10.1 10.2v1.8Z" {...STROKE} />
    </svg>
  );
}

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

const features: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Personal support throughout the program",
    body: "Direct access to Sam for your questions, decisions, and development at every stage of the journey.",
    icon: <PersonIcon />,
  },
  {
    title: "Hand history and database reviews",
    body: "In-depth analysis of your hands and database with actionable insights tailored to your game.",
    icon: <CardsIcon />,
  },
  {
    title: "Strategic questions and direct guidance",
    body: "Get clear answers to your most important strategic questions from one of the best in the world.",
    icon: <KnightIcon />,
  },
  {
    title: "Individual feedback as your game evolves",
    body: "Ongoing, personalized feedback to help you apply concepts, track progress, and reach the next level.",
    icon: <ScrollIcon />,
  },
];

/**
 * Sam Greenwood — the resident mentor who stays with every member for the
 * whole voyage. Portrait card on the left, the offer on the right. Static;
 * only the emblems answer the cursor.
 */
export function Mentor() {
  return (
    <section id="mentor" aria-labelledby="mentor-title" className="relative py-[clamp(4rem,7vw,6.5rem)]">
      <div className="site-container">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 lg:gap-20">
          <div className="mx-auto w-full max-w-[26rem] md:max-w-none">
            <Image
              src="/images/mentor/sam-portrait.webp"
              alt="Sam Greenwood, portrayed as a classical scholar at a map table by the sea"
              width={688}
              height={813}
              unoptimized
              className="h-auto w-full [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.55))]"
            />
          </div>

          <div>
            <h2
              id="mentor-title"
              className="font-display text-[clamp(2.75rem,4.6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.01em] text-limestone"
            >
              Sam Greenwood
            </h2>
            <p className="mt-3 text-[clamp(1.125rem,1.5vw,1.5rem)] font-light tracking-[0.02em] text-limestone">
              Your personal mentor throughout the journey.
            </p>
            <p className="mt-4 max-w-[40rem] text-[0.9375rem] leading-[1.7] text-limestone-soft md:text-base">
              Sam Greenwood personally supports each hero on their path, providing hands-on feedback,
              strategic guidance, and individual attention throughout the entire program.
            </p>

            <ul className="mt-8 space-y-5 md:mt-9">
              {features.map(({ title, body, icon }) => (
                <li key={title} className="group grid grid-cols-[3.5rem_1fr] items-start gap-5 lg:grid-cols-[4rem_1fr]">
                  <span className="relative flex aspect-square items-center justify-center rounded-full border border-gold/80 text-gold transition-[border-color,box-shadow,color] duration-500 ease-luxe group-hover:border-gold-light group-hover:text-gold-light group-hover:shadow-[0_0_22px_-2px_rgba(211,181,137,0.55)]">
                    <span className="h-[70%] w-[70%]">{icon}</span>
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-[clamp(1.1875rem,1.45vw,1.4375rem)] font-semibold leading-snug text-limestone transition-colors duration-500 group-hover:text-gold-light">
                      {title}
                    </h3>
                    <p className="mt-1 text-[0.875rem] leading-[1.6] text-limestone-soft md:text-[0.9375rem]">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Hairline with a gold diamond */}
            <div className="mt-8 flex items-center gap-3 md:mt-9" aria-hidden>
              <span className="h-px flex-1 bg-gradient-to-r from-gold/20 to-gold/60" />
              <span className="h-2 w-2 rotate-45 border border-gold" />
              <span className="h-px flex-1 bg-gradient-to-l from-gold/20 to-gold/60" />
            </div>
            <p className="mt-6 font-display text-[clamp(1.0625rem,1.3vw,1.3125rem)] leading-[1.55] text-limestone-soft">
              Sam is more than an instructor — he is your personal mentor, accompanying you throughout
              the entire voyage, helping you navigate challenges, refine your game, and unlock your full
              potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
