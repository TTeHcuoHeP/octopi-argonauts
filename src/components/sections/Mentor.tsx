"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { useReveal } from "@/animations/useReveal";

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
  subtitle: string;
  lede: string;
  portrait: { src: string; width: number; height: number; alt: string };
  features: { title: string; body: string; icon: ReactNode }[];
  closing: string;
};

const profiles: Profile[] = [
  {
    id: "livschitz",
    name: "Victoria Livschitz",
    subtitle: "The architect of the voyage.",
    lede: "In the myth, Athena designed the Argo and guided the heroes who sailed her. Victoria plays the same part here: she dreamed up this program — the one she wished she could have joined while learning the game — and she runs it day to day.",
    portrait: {
      src: "/images/mentor/livschitz-portrait.webp",
      width: 920,
      height: 1088,
      alt: "Victoria Livschitz, portrayed as a classical architect drafting plans beside a model of a city",
    },
    features: [
      {
        title: "Founder and visionary",
        body: "Victoria founded the company behind Argonauts and dreamed up this program as the one she wished she could have been part of.",
        icon: <ShipIcon />,
      },
      {
        title: "Architect of the curriculum",
        body: "She designed the shape of the year: the chapters, the study sessions, and the route to the Golden Fleece.",
        icon: <DividersIcon />,
      },
      {
        title: "Runs the program day to day",
        body: "She leads the weekly study sessions, assigns homework, and moderates the guest coach lectures.",
        icon: <HourglassIcon />,
      },
      {
        title: "Guardian of the fellowship",
        body: "She leads admissions, gathering a crew of committed players worth sailing alongside.",
        icon: <LaurelIcon />,
      },
    ],
    closing:
      "Every great voyage begins with a vessel built for it. Victoria drew the lines of this one — and she is on deck every week to sail it with you.",
  },
  {
    id: "greenwood",
    name: "Sam Greenwood",
    subtitle: "Your personal mentor throughout the journey.",
    lede: "In the myth, the wise centaur Chiron trained Jason, the leader of the Argonauts, along with heroes like Heracles and Achilles. Sam plays that part here: he personally supports each hero with hands-on feedback, strategic guidance, and individual attention all year.",
    portrait: {
      src: "/images/mentor/sam-portrait.webp",
      width: 688,
      height: 813,
      alt: "Sam Greenwood, portrayed as a classical scholar at a map table by the sea",
    },
    features: [
      {
        title: "Personal support all year",
        body: "Direct access to Sam for your questions, decisions, and development at every stage of the journey.",
        icon: <PersonIcon />,
      },
      {
        title: "Hand-history reviews",
        body: "In-depth analysis of your hands, with actionable insights tailored to your game.",
        icon: <CardsIcon />,
      },
      {
        title: "Strategic questions, direct answers",
        body: "Clear answers to your most important strategic questions from one of the best in the world.",
        icon: <KnightIcon />,
      },
      {
        title: "Regular lectures",
        body: "Sam delivers lectures throughout the year and leads the sessions whenever Victoria is away playing or travelling.",
        icon: <ScrollIcon />,
      },
    ],
    closing:
      "Sam is more than an instructor — like Chiron, he is the mentor who shapes heroes, helping you navigate challenges, refine your game, and unlock your full potential.",
  },
];

/**
 * One leader: portrait card beside a compact copy block. `flip` puts the
 * portrait on the right, so the two profiles read as a zig-zag.
 */
function ProfileRow({ profile, flip }: { profile: Profile; flip: boolean }) {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });
  const titleId = `mentor-${profile.id}-title`;

  return (
    <article
      ref={ref}
      aria-labelledby={titleId}
      className={`grid items-center gap-8 md:gap-12 lg:gap-16 ${
        flip ? "md:grid-cols-[minmax(0,1.38fr)_minmax(0,0.62fr)]" : "md:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)]"
      }`}
    >
      <div data-reveal className={`relative mx-auto w-full max-w-[19rem] md:max-w-[24rem] ${flip ? "md:order-2" : ""}`}>
        <Image
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.width}
          height={profile.portrait.height}
          unoptimized
          className={`h-auto w-full [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.6))] ${flip ? "md:rotate-[1.5deg]" : "md:-rotate-[1.5deg]"}`}
        />
      </div>

      <div className="min-w-0">
        <h2
          id={titleId}
          data-reveal
          className="font-display text-[clamp(2.5rem,4vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.01em] text-limestone"
        >
          {profile.name}
        </h2>
        <p data-reveal className="mt-3 text-[clamp(1.0625rem,1.35vw,1.375rem)] font-light tracking-[0.02em] text-limestone">
          {profile.subtitle}
        </p>
        <p data-reveal className="mt-4 max-w-[46rem] text-[0.9375rem] leading-[1.7] text-limestone-soft md:text-base">
          {profile.lede}
        </p>

        <ul className="mt-7 grid gap-x-8 gap-y-5 lg:grid-cols-2">
          {profile.features.map(({ title, body, icon }) => (
            <li key={title} data-reveal className="group grid grid-cols-[3rem_1fr] items-start gap-4 lg:grid-cols-[3.25rem_1fr]">
              <span className="relative flex aspect-square items-center justify-center rounded-full border border-gold/80 text-gold transition-[border-color,box-shadow,color] duration-500 ease-luxe group-hover:border-gold-light group-hover:text-gold-light group-hover:shadow-[0_0_22px_-2px_rgba(211,181,137,0.55)]">
                <span className="h-[70%] w-[70%]">{icon}</span>
              </span>
              <div className="pt-0.5">
                <h3 className="font-display text-[clamp(1.125rem,1.3vw,1.3125rem)] font-semibold leading-snug text-limestone transition-colors duration-500 group-hover:text-gold-light">
                  {title}
                </h3>
                <p className="mt-1 text-[0.875rem] leading-[1.6] text-limestone-soft">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mt-7 border-l border-gold/50 pl-5 font-display text-[clamp(1.0625rem,1.25vw,1.25rem)] italic leading-[1.55] text-limestone-soft"
        >
          {profile.closing}
        </p>
      </div>
    </article>
  );
}

/**
 * The two people who lead the voyage, both on view: Victoria Livschitz, who
 * dreamed up and runs the program (first), and Sam Greenwood, the resident
 * mentor. Portraits alternate sides, with a gold hairline between the two.
 */
export function Mentor() {
  return (
    <section id="mentor" aria-label="The people leading the voyage" className="relative overflow-x-clip py-[clamp(4rem,7vw,6.5rem)]">
      <div className="site-container">
        {profiles.map((profile, i) => (
          <div key={profile.id}>
            {i > 0 && (
              <div className="my-14 flex items-center gap-3 md:my-20" aria-hidden>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
                <span className="h-2 w-2 rotate-45 border border-gold" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
              </div>
            )}
            <ProfileRow profile={profile} flip={i % 2 === 1} />
          </div>
        ))}
      </div>
    </section>
  );
}
