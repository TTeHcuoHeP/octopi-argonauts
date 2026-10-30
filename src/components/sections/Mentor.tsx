"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";

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

/** The Argo under sail; it rides a swell on hover. */
function ShipIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      <g className={`${PART} [transform-origin:24px_36px] group-hover:-translate-y-[1.5px] group-hover:-rotate-[7deg]`}>
        <path d="M24 7v25" {...STROKE} />
        <path d="M25.5 9.5c6.2 3.4 9.4 9.4 9.4 18.5H25.5Z" {...STROKE} className="fill-ocean" />
        <path d="M22.5 13c-4.2 3.2-6.4 8.2-6.4 15h6.4Z" {...STROKE} className="fill-ocean" />
        <path d="M8.5 31.5h31l-4.6 6.5H13.1Z" {...STROKE} className="fill-ocean" />
      </g>
      <path
        d="M6 42.5c3 0 3-1.6 6-1.6s3 1.6 6 1.6 3-1.6 6-1.6 3 1.6 6 1.6 3-1.6 6-1.6 3 1.6 6 1.6"
        {...STROKE}
        strokeWidth={1.1}
      />
    </svg>
  );
}

/** Drafting dividers that open wider on hover. */
function DividersIcon() {
  const leg = (d: string, hover: string) => (
    <g className={`${PART} [transform-origin:24px_11px] ${hover}`}>
      <path d={d} {...STROKE} />
    </g>
  );
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      {leg("M22.8 12.8 14.5 38.5M14.5 38.5l-.6 2.6", "group-hover:rotate-[9deg]")}
      {leg("M25.2 12.8 33.5 38.5M33.5 38.5l.6 2.6", "group-hover:-rotate-[9deg]")}
      <circle cx="24" cy="10.5" r="2.6" {...STROKE} />
      <path d="M24 5.5v2.4" {...STROKE} />
      <path d="M12 43.5c6-2.4 18-2.4 24 0" {...STROKE} strokeWidth={1.1} strokeDasharray="1.5 2.5" />
    </svg>
  );
}

/** An hourglass that turns over on hover. */
function HourglassIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      <g className="transition-transform duration-700 ease-luxe [transform-box:view-box] [transform-origin:24px_24px] group-hover:rotate-180">
        <path d="M13.5 8h21M13.5 40h21" {...STROKE} />
        <path d="M16.5 8c0 8.5 7.5 10 7.5 16s-7.5 7.5-7.5 16M31.5 8c0 8.5-7.5 10-7.5 16s7.5 7.5 7.5 16" {...STROKE} />
        <path d="M19.5 37.5h9L24 32.5Z" fill="currentColor" />
        <path d="M21.5 14.5h5" {...STROKE} strokeWidth={1.1} />
      </g>
    </svg>
  );
}

/** A laurel wreath whose star brightens on hover. */
function LaurelIcon() {
  // Leaves of the left branch [x, y, angle]; the right branch mirrors them.
  const leaves = [
    [8.4, 17.5, -28],
    [8.6, 24, -42],
    [10.6, 30, -58],
    [14.2, 35, -74],
    [13.6, 15.8, 22],
    [14, 22, 12],
    [15.4, 27.6, -4],
    [18.4, 32.4, -22],
  ] as const;
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden>
      <g className={`${PART} [transform-origin:24px_40px] group-hover:scale-[1.06]`}>
        <path d="M23 40.5C14 38 9.6 30.5 10.9 13M25 40.5C34 38 38.4 30.5 37.1 13" {...STROKE} />
        {leaves.map(([x, y, a]) => (
          <g key={`${x}-${y}`}>
            <ellipse cx={x} cy={y} rx="1.6" ry="3.3" transform={`rotate(${a} ${x} ${y})`} {...STROKE} strokeWidth={1.1} />
            <ellipse cx={48 - x} cy={y} rx="1.6" ry="3.3" transform={`rotate(${-a} ${48 - x} ${y})`} {...STROKE} strokeWidth={1.1} />
          </g>
        ))}
      </g>
      <path
        d="M24 8.5l1.3 3.6 3.6 1.3-3.6 1.3-1.3 3.6-1.3-3.6-3.6-1.3 3.6-1.3Z"
        fill="currentColor"
        className="opacity-60 transition-opacity duration-500 group-hover:opacity-100"
      />
    </svg>
  );
}

type Profile = {
  id: string;
  name: string;
  /** Short name for the switcher. */
  short: string;
  subtitle: string;
  lede: string;
  portrait: { src: string; width: number; height: number; alt: string };
  features: { title: string; body: string; icon: ReactNode }[];
  closing: string;
};

const profiles: Profile[] = [
  {
    id: "greenwood",
    name: "Sam Greenwood",
    short: "Sam Greenwood",
    subtitle: "Your personal mentor throughout the journey.",
    lede: "Sam Greenwood personally supports each hero on their path, providing hands-on feedback, strategic guidance, and individual attention throughout the entire program.",
    portrait: {
      src: "/images/mentor/sam-portrait.webp",
      width: 688,
      height: 813,
      alt: "Sam Greenwood, portrayed as a classical scholar at a map table by the sea",
    },
    features: [
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
    ],
    closing:
      "Sam is more than an instructor — he is your personal mentor, accompanying you throughout the entire voyage, helping you navigate challenges, refine your game, and unlock your full potential.",
  },
  {
    id: "livschitz",
    name: "Victoria Livschitz",
    short: "Victoria Livschitz",
    subtitle: "The architect of the voyage.",
    lede: "In the myth, Athena designed the Argo and guided the heroes who sailed her. Victoria plays the same part here: she founded the company behind Argonauts and built this program from the keel up.",
    portrait: {
      src: "/images/mentor/livschitz-portrait.webp",
      width: 920,
      height: 1088,
      alt: "Victoria Livschitz, portrayed as a classical architect drafting plans beside a model of a city",
    },
    features: [
      {
        title: "Founder of the company and the program",
        body: "Victoria created the company behind Argonauts and turned the idea of a year-long voyage into a real program.",
        icon: <ShipIcon />,
      },
      {
        title: "Architect of the curriculum",
        body: "She designed the shape of the year: the chapters, the study groups, and the route to the Golden Fleece.",
        icon: <DividersIcon />,
      },
      {
        title: "Keeper of the weekly rhythm",
        body: "Lectures, drills, and challenges arrive on a steady cadence she oversees, so every week moves you forward.",
        icon: <HourglassIcon />,
      },
      {
        title: "Guardian of the fellowship",
        body: "She leads admissions, gathering a crew of committed players worth sailing alongside.",
        icon: <LaurelIcon />,
      },
    ],
    closing:
      "Every great voyage begins with a vessel built for it. Victoria drew the lines of this one — so that you can give all your attention to the journey ahead.",
  },
];

/** Where each portrait card rests: the active one in front, the other dimmed behind it. */
const FRONT = { x: 0, y: 0, xPercent: 0, yPercent: 0, rotate: 0, scale: 1, filter: "brightness(1) saturate(1)" };
const BACK = { x: 0, y: 0, xPercent: 14, yPercent: -2, rotate: 5, scale: 0.93, filter: "brightness(0.42) saturate(0.5)" };

/** Server-rendered resting place (before GSAP takes over), with the first profile in front. */
const restingStyle = (front: boolean): CSSProperties => {
  const p = front ? FRONT : BACK;
  return {
    transform: `translate(${p.xPercent}%, ${p.yPercent}%) rotate(${p.rotate}deg) scale(${p.scale})`,
    filter: p.filter,
    zIndex: front ? 2 : 1,
  };
};

/**
 * The two portrait cards as a small deck. Switching deals them: the card behind
 * slides out to the side, comes over the top and settles in front, while the
 * other one sinks back into the dimmed resting place behind it. Clicking the
 * card behind switches too.
 */
function PortraitStack({
  index,
  height,
  onSelect,
}: {
  index: number;
  height: number | null;
  onSelect: (i: number) => void;
}) {
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = useRef(index);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const { gsap } = getGsap();
    cards.current.forEach((card, i) => card && gsap.set(card, { ...(i === shown.current ? FRONT : BACK), zIndex: i === shown.current ? 2 : 1 }));
  }, []);

  useLayoutEffect(() => {
    const from = shown.current;
    shown.current = index;
    const incoming = cards.current[index];
    const outgoing = cards.current[from];
    if (from === index || !incoming || !outgoing) return;
    const { gsap } = getGsap();
    tl.current?.kill();
    if (prefersReducedMotion()) {
      gsap.set(incoming, { ...FRONT, zIndex: 2 });
      gsap.set(outgoing, { ...BACK, zIndex: 1 });
      return;
    }
    tl.current = gsap
      .timeline()
      // Out from behind…
      .to(incoming, { xPercent: 64, yPercent: -3, rotate: 9, scale: 0.97, filter: "brightness(0.8) saturate(0.85)", duration: 0.4, ease: "power2.in" })
      .to(outgoing, { xPercent: -5, rotate: -2, duration: 0.4, ease: "power2.in" }, 0)
      // …over the top, and the old front card sinks back.
      .set(incoming, { zIndex: 2 })
      .set(outgoing, { zIndex: 1 })
      .to(incoming, { ...FRONT, duration: 0.65, ease: "power3.out" })
      .to(outgoing, { ...BACK, duration: 0.65, ease: "power3.out" }, "<");
  }, [index]);

  const lead = profiles[0].portrait;

  return (
    <div
      style={height ? { height } : undefined}
      className={`relative mx-auto aspect-[688/813] w-full max-w-[26rem] md:ml-0 md:mr-[8%] md:shrink-0 ${
        height ? "md:w-auto md:max-w-[40%]" : "md:w-[38%] md:max-w-none"
      }`}
    >
      {profiles.map((profile, i) => {
        const front = i === index;
        return (
          <button
            key={profile.id}
            ref={(el) => {
              cards.current[i] = el;
            }}
            type="button"
            disabled={front}
            onClick={() => onSelect(i)}
            aria-label={front ? undefined : `Show ${profile.name}`}
            style={restingStyle(i === 0)}
            className="absolute inset-0 block transition-[translate] duration-500 ease-luxe enabled:cursor-pointer enabled:hover:translate-x-[5%] disabled:cursor-default focus-visible:outline-none"
          >
            <Image
              src={profile.portrait.src}
              alt={front ? profile.portrait.alt : ""}
              width={lead.width}
              height={lead.height}
              unoptimized
              className="pointer-events-none h-full w-full object-contain [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.6))]"
            />
          </button>
        );
      })}
    </div>
  );
}

/** One profile's copy; both are stacked in one cell and cross-fade. */
function ProfileCopy({ profile, active }: { profile: Profile; active: boolean }) {
  return (
    <div
      id={`mentor-${profile.id}`}
      role="group"
      aria-roledescription="slide"
      aria-label={profile.name}
      inert={!active}
      className={`col-start-1 row-start-1 transition-[opacity,visibility,translate] duration-700 ease-luxe ${
        active ? "visible translate-x-0 opacity-100" : "invisible translate-x-6 opacity-0"
      }`}
    >
      <h2 className="font-display text-[clamp(2.75rem,4.6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.01em] text-limestone">
        {profile.name}
      </h2>
      <p className="mt-3 text-[clamp(1.125rem,1.5vw,1.5rem)] font-light tracking-[0.02em] text-limestone">
        {profile.subtitle}
      </p>
      <p className="mt-4 max-w-[40rem] text-[0.9375rem] leading-[1.7] text-limestone-soft md:text-base">{profile.lede}</p>

      <ul className="mt-8 space-y-5 md:mt-9">
        {profile.features.map(({ title, body, icon }) => (
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
        {profile.closing}
      </p>
    </div>
  );
}

/**
 * The two people who lead the voyage, one at a time: Sam Greenwood, the
 * resident mentor, and Victoria Livschitz, who designed the program. The
 * switcher above (arrows and portrait tabs) or the dimmed portrait card behind
 * changes profile: the portrait cards swap places like a small deck while the
 * copy cross-fades. Both copies share one stacked cell, so the section never
 * jumps in height; the portrait is as tall as that cell (never wider than 40%
 * of the row).
 */
export function Mentor() {
  const [index, setIndex] = useState(0);
  const copyRef = useRef<HTMLDivElement>(null);
  const [copyHeight, setCopyHeight] = useState<number | null>(null);

  // Side by side, the portraits take the height of the copy (width follows their aspect).
  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const wide = window.matchMedia("(min-width: 768px)");
    const sync = () => setCopyHeight(wide.matches ? copy.offsetHeight : null);
    const ro = new ResizeObserver(sync);
    ro.observe(copy);
    wide.addEventListener("change", sync);
    sync();
    return () => {
      ro.disconnect();
      wide.removeEventListener("change", sync);
    };
  }, []);
  const go = (step: number) => setIndex((i) => (i + step + profiles.length) % profiles.length);

  const arrow =
    "hidden h-12 w-12 shrink-0 sm:flex md:h-14 md:w-14 items-center justify-center rounded-full border border-gold/60 text-gold transition-[border-color,color,box-shadow,background-color] duration-300 ease-luxe hover:border-gold-light hover:bg-gold/10 hover:text-gold-light hover:shadow-[0_0_20px_-4px_rgba(211,181,137,0.6)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-light";

  return (
    <section
      id="mentor"
      aria-roledescription="carousel"
      aria-label="The people leading the voyage"
      className="relative overflow-x-clip py-[clamp(4rem,7vw,6.5rem)]"
    >
      <div className="site-container">
        {/* Switcher: arrows either side of two portrait tabs */}
        <div className="mb-10 flex items-center justify-center gap-3 md:mb-14 md:gap-5">
          <button type="button" onClick={() => go(-1)} aria-label="Previous profile" className={arrow}>
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div
            className="flex items-center gap-1 rounded-full border border-gold/40 bg-[rgba(8,16,26,0.55)] p-1 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] md:gap-1.5 md:p-1.5"
            role="tablist"
            aria-label="Profiles"
          >
            {profiles.map((profile, i) => (
              <button
                key={profile.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls={`mentor-${profile.id}`}
                onClick={() => setIndex(i)}
                className={`flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3 font-monument text-[0.6875rem] uppercase tracking-[0.18em] transition-[background-color,border-color,color,box-shadow] duration-300 ease-luxe focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-light sm:pr-4 md:gap-3 md:pr-5 md:text-[0.8125rem] ${
                  i === index
                    ? "border-gold bg-gold/15 text-gold-light shadow-[0_0_24px_-6px_rgba(211,181,137,0.55)]"
                    : "border-transparent text-limestone-soft hover:bg-gold/5 hover:text-limestone"
                }`}
              >
                <span
                  className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full border transition-[border-color,filter] duration-300 md:h-10 md:w-10 ${
                    i === index ? "border-gold-light" : "border-gold/30 [filter:brightness(0.6)_saturate(0.6)]"
                  }`}
                  aria-hidden
                >
                  <Image
                    src={profile.portrait.src}
                    alt=""
                    fill
                    unoptimized
                    sizes="40px"
                    className="object-cover object-[50%_22%] scale-[1.6]"
                  />
                </span>
                {profile.short}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next profile" className={arrow}>
            <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:gap-20">
          <PortraitStack index={index} height={copyHeight} onSelect={setIndex} />
          <div ref={copyRef} className="grid min-w-0 md:flex-1">
            {profiles.map((profile, i) => (
              <ProfileCopy key={profile.id} profile={profile} active={i === index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
