import Image from "next/image";
import {
  Gem,
  GraduationCap,
  Landmark,
  ListChecks,
  Ticket,
  MailOpen,
  MessageSquareText,
  Spade,
  Swords,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  questChart,
  questCheckpoints,
  questMap,
  type QuestCheckpoint,
  type QuestIcon,
} from "@/data/quest";
import { cn } from "@/lib/cn";
import { routePoints, smoothPath } from "./questGeometry";

const ICONS: Record<QuestIcon, LucideIcon> = {
  members: Users,
  invitation: MailOpen,
  lectures: Landmark,
  qa: MessageSquareText,
  experts: GraduationCap,
  drills: Target,
  quizzes: ListChecks,
  challenges: Swords,
  community: Users,
  deck: Spade,
  trophy: Trophy,
  ring: Gem,
  seat: Ticket,
};

/**
 * Wide screens: odd chapters sit in an even row of three above the islands,
 * even ones in a centred pair below. Each card's column spans its island, so
 * the stems drop straight from card to marker.
 */
const PLACES: Record<string, { row: "top" | "bottom" }> = {
  call: { row: "top" },
  minds: { row: "bottom" },
  trials: { row: "top" },
  fellowship: { row: "bottom" },
  fleece: { row: "top" },
};
/** Top cards end, and bottom cards start, at these heights of the chart (open sea). */
const TOP_EDGE = 0.3;
const BOTTOM_EDGE = 0.68;
/** Chart height as a share of its width — CSS % margins resolve against width. */
const RATIO = questMap.height / questMap.width;

const chapter = (i: number) => String(i + 1).padStart(2, "0");
const ROUTE_D = smoothPath(routePoints());

/**
 * The Quest chart, shown whole and static: the full route across every island,
 * each chapter's card on view at once. Wide screens lay the cards around the
 * chart with a stem to their island; narrower screens list them under it.
 */
export function QuestJourney() {
  const top = questCheckpoints
    .map((cp, i) => ({ cp, i }))
    .filter(({ cp }) => PLACES[cp.id]?.row === "top");
  const bottom = questCheckpoints
    .map((cp, i) => ({ cp, i }))
    .filter(({ cp }) => PLACES[cp.id]?.row === "bottom");

  return (
    <div
      className="relative z-[2] bg-ocean pb-[clamp(4rem,7vw,6.5rem)] pt-[clamp(4rem,7vw,6.5rem)] [font-variant-numeric:lining-nums]"
      role="region"
      aria-labelledby="quest-title"
    >
      <div className="site-container text-center">
        <h2
          id="quest-title"
          className="mx-auto text-[clamp(1.875rem,3.4vw,3.25rem)] leading-[1.05] text-limestone"
        >
          A Year-Long Voyage <br className="sm:hidden" />
          Toward the <span className="text-gold">Golden Fleece</span>.
        </h2>
      </div>

      <div className="relative mx-auto mt-10 w-full overflow-x-clip md:mt-14">
        {/* Wide screens: the chart opens a touch past the screen edges so its frame falls away */}
        <div className="relative xl:-ml-[3%] xl:w-[106%]">
          {/* Wide screens: the cards above the chart, bottoms on one line */}
          <div className="relative z-10 hidden grid-cols-3 gap-x-[1.5%] px-[4%] xl:grid">
            {top.map(({ cp, i }) => (
              <ChapterCard key={cp.id} cp={cp} i={i} />
            ))}
          </div>

          {/* Phones and tablets: the chart keeps a readable size and scrolls sideways */}
          <div
            className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] xl:mt-[var(--top-overlap)] xl:overflow-visible"
            style={{
              ["--top-overlap" as string]: `${-TOP_EDGE * RATIO * 100}%`,
            }}
          >
            <div className="min-w-[48rem] overflow-hidden xl:overflow-visible">
              <div className="-ml-[3%] w-[106%] xl:ml-0 xl:w-full">
                <Chart />
              </div>
            </div>
          </div>
          <p
            className="site-container mt-3 text-center text-[1.0625rem] italic text-stone md:hidden"
            aria-hidden
          >
            Swipe to follow the route
          </p>

          {/* Wide screens: the cards below the chart, tops on one line */}
          <div
            className="relative z-10 mx-auto hidden w-[70%] grid-cols-2 gap-x-[2.86%] xl:mt-[var(--bottom-overlap)] xl:grid"
            style={{
              ["--bottom-overlap" as string]: `${-(1 - BOTTOM_EDGE) * RATIO * 100}%`,
            }}
          >
            {bottom.map(({ cp, i }) => (
              <ChapterCard key={cp.id} cp={cp} i={i} />
            ))}
          </div>
        </div>

        {/* Narrower screens: the chapters in order under the chart */}
        <ol className="site-container mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5 xl:hidden">
          {questCheckpoints.map((cp, i) => (
            <li key={cp.id} className={cn(cp.final && "md:col-span-2")}>
              <ChapterCard cp={cp} i={i} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The illustrated chart with the whole route drawn, markers, numbers and (wide screens) stems to the cards. */
function Chart() {
  const W = questChart.width;
  const H = questChart.height;

  return (
    <div className="relative aspect-[3840/2144] w-full" aria-hidden>
      {/* The open chart: no frame, its top and bottom dissolving into the sea */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
        <Image
          src={questMap.src}
          alt=""
          fill
          sizes="110vw"
          unoptimized
          className="select-none object-fill"
          draggable={false}
        />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <radialGradient id="quest-glow">
            <stop offset="0%" stopColor="var(--gold-light)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold-light)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d={ROUTE_D}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Stems from each card to its island (wide screens only) */}
        <g className="hidden xl:inline">
          {questCheckpoints.map((cp) => {
            const place = PLACES[cp.id];
            if (!place) return null;
            const x = cp.x * W;
            const y = cp.y * H;
            const r = cp.final ? 17 : 14;
            const edge = (place.row === "top" ? TOP_EDGE : BOTTOM_EDGE) * H;
            const end = place.row === "top" ? y - r : y + r;
            return (
              <line
                key={cp.id}
                x1={x}
                y1={edge}
                x2={x}
                y2={end}
                stroke="var(--gold)"
                strokeOpacity="0.75"
                strokeWidth="1.2"
                strokeDasharray="3 4"
              />
            );
          })}
        </g>

        {questCheckpoints.map((cp, i) => {
          const above = PLACES[cp.id]?.row !== "top";
          return (
            <g key={cp.id} transform={`translate(${cp.x * W} ${cp.y * H})`}>
              <circle
                r={cp.final ? 34 : 26}
                fill="url(#quest-glow)"
                opacity={cp.final ? 0.55 : 0.4}
              />
              {cp.final && (
                <circle
                  r="24"
                  fill="none"
                  stroke="var(--gold)"
                  strokeOpacity="0.5"
                  strokeWidth="0.9"
                  strokeDasharray="2 4"
                />
              )}
              <circle
                r={cp.final ? 15 : 12}
                fill="none"
                stroke="var(--gold)"
                strokeWidth="1.4"
              />
              <circle r={cp.final ? 5 : 4.2} fill="var(--gold-light)" />
              {/* Chapter number, on the side away from the stem */}
              <text
                y={above ? -26 : 40}
                textAnchor="middle"
                className="fill-gold-light font-display text-[30px] font-semibold xl:text-[22px] [paint-order:stroke] [stroke:rgba(6,12,20,0.85)] [stroke-width:4px]"
              >
                {chapter(i)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ChapterCard({ cp, i }: { cp: QuestCheckpoint; i: number }) {
  return (
    <article className="group relative h-full rounded-md shadow-[0_32px_70px_-30px_rgba(0,0,0,0.85)] transition-[filter] duration-700 ease-luxe [filter:drop-shadow(0_0_0_rgba(211,181,137,0))] hover:[filter:drop-shadow(0_0_26px_rgba(211,181,137,0.45))]">
      {/* Same hover as the study-experience pillars: the gold frame warms to a gradient, a soft sheen rises */}
      <span className="absolute inset-0 rounded-md bg-gold/80" aria-hidden />
      <span
        className="absolute inset-0 rounded-md bg-[linear-gradient(135deg,color-mix(in_srgb,var(--gold-light)_70%,white),var(--gold-light)_30%,var(--gold)_65%,var(--gold-dim)_100%)] opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100"
        aria-hidden
      />
      <span
        className="absolute inset-[2px] rounded-[4px] bg-[linear-gradient(180deg,rgba(15,28,43,0.96),rgba(9,18,29,0.96))]"
        aria-hidden
      />
      <span
        className="absolute inset-[2px] rounded-[4px] bg-[radial-gradient(120%_110%_at_0%_0%,rgba(211,181,137,0.24),rgba(185,146,97,0.09)_45%,transparent_78%)] opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative px-6 py-5 md:px-7 md:py-6">
        <p className="font-display text-[1.0625rem] font-medium uppercase tracking-[0.18em] text-gold md:text-lg">
          Chapter {chapter(i)} · {cp.subtitle}
        </p>
        <h3 className="mt-2 font-display text-[1.75rem] leading-[1.1] text-limestone md:text-[2rem]">
          {cp.title}
        </h3>
        {cp.description.map((line, l) => (
          <p
            key={line}
            className={cn(
              "text-[1.0625rem] leading-[1.55] text-limestone-soft md:text-lg",
              l === 0 ? "mt-3" : "mt-2",
            )}
          >
            {line}
          </p>
        ))}
        {cp.tags && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-gold/25 pt-4">
            {cp.tags.map(({ label, icon }) => {
              const Icon = ICONS[icon];
              return (
                <li key={label} className="flex items-center gap-2">
                  <Icon
                    className="h-5 w-5 text-gold"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <span className="font-display text-[1.0625rem] text-limestone-soft md:text-lg">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}
