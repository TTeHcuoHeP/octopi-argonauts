"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type PointerEvent } from "react";
import {
  Gem,
  GraduationCap,
  Hand,
  Landmark,
  ListChecks,
  MailOpen,
  MessageSquareText,
  MousePointer2,
  Spade,
  Swords,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { questChart, questCheckpoints, questMap, type QuestIcon } from "@/data/quest";
import { getGsap } from "@/animations/gsap";
import { cn } from "@/lib/cn";
import { cameraTransform, coverSize, measureCheckpoints, routePoints, smoothPath, type Viewport } from "./questGeometry";

/** Per-breakpoint choreography. Scroll length is in viewport heights. */
type JourneyConfig = {
  /** Where the route sits vertically once the map is open (room above for the title). */
  focusY: number;
  /** HUD docked to the bottom of the screen instead of beside the island. */
  docked: boolean;
  scrollVh: number;
};

const CONFIGS: Record<"desktop" | "tablet" | "mobile", JourneyConfig> = {
  desktop: { focusY: 0.56, docked: false, scrollVh: 3 },
  tablet: { focusY: 0.52, docked: false, scrollVh: 3 },
  mobile: { focusY: 0.42, docked: true, scrollVh: 2.4 },
};

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
};

/** Gap between a HUD panel and its marker; the stem spans it. */
const HUD_GAP = 56;
/** Closest two neighbouring islands, in chart units — island labels fade out below this on screen. */
const MIN_ISLAND_GAP = Math.min(
  ...questCheckpoints.slice(1).map((cp, i) => (cp.x - questCheckpoints[i].x) * questChart.width),
);
/** Horizontal share of the map the open chart must show: the whole route with its labels. */
const ROUTE_SPAN = 0.95;
const ROUTE_CENTER_X = 0.52;
const ROUTE_CENTER_Y = 0.47;
/** The chart starts almost open (this share of the open scale) and settles in with a slight zoom. */
const START_SCALE = 0.97;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const chapter = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Section 04 chart. Scroll does one thing: the chart, already almost open, settles
 * in with a slight zoom while the title surfaces and the gold route draws itself
 * across every island. Then the pin releases and the chart is explored by hand — markers
 * pulse, and hovering (or tapping) a marker, an island name or a chapter on the
 * rail opens that chapter's panel. Map, route and markers share one transformed
 * coordinate system; labels, hit targets and panels stay in screen space.
 */
export function QuestJourney() {
  const stageRef = useRef<HTMLDivElement>(null);
  const routeD = useMemo(() => smoothPath(routePoints()), []);
  const [active, setActive] = useState<number | null>(null);
  const pointer = useRef("mouse");

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { gsap } = getGsap();

    const world = stage.querySelector<HTMLDivElement>("[data-world]")!;
    const vignette = stage.querySelector<HTMLDivElement>("[data-vignette]")!;
    const route = stage.querySelector<SVGPathElement>("[data-route]")!;
    const head = stage.querySelector<SVGGElement>("[data-head]")!;
    const introItems = gsap.utils.toArray<HTMLElement>("[data-intro-item]", stage);
    const introVeil = stage.querySelector<HTMLElement>("[data-intro-veil]")!;
    const labelsLayer = stage.querySelector<HTMLElement>("[data-labels]")!;
    const labelAnchors = gsap.utils.toArray<HTMLElement>("[data-label-anchor]", stage);
    const hitAnchors = gsap.utils.toArray<HTMLElement>("[data-hit-anchor]", stage);
    const hudAnchors = gsap.utils.toArray<HTMLElement>("[data-hud-anchor]", stage);
    const hudBoxes = gsap.utils.toArray<HTMLElement>("[data-hud-box]", stage);
    const huds = gsap.utils.toArray<HTMLElement>("[data-hud]", stage);
    const railBox = stage.querySelector<HTMLElement>("[data-rail-box]")!;
    const railLayers = gsap.utils.toArray<HTMLElement>("[data-rail-layer]", stage);
    const markers = questCheckpoints.map((_, i) => ({
      dot: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-dot]`)!,
      ring: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-ring]`)!,
      glow: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-glow]`)!,
      outer: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-outer]`),
    }));
    const length = route.getTotalLength();
    const stops = measureCheckpoints(route);

    const setReady = (ready: boolean) => {
      const value = String(ready);
      if (stage.dataset.ready === value) return;
      stage.dataset.ready = value;
      if (!ready) setActive(null);
    };

    /**
     * Writes the camera and everything pinned to the islands in screen space:
     * names, hit targets and (unless docked) the chapter panels.
     */
    const place = (
      vp: Viewport,
      cam: { tx: number; ty: number; s: number; cover: { w: number; h: number } },
      docked: boolean,
      band: { top: number; bottom: number },
    ) => {
      const { tx, ty, s, cover } = cam;
      world.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
      const k = (s * cover.w) / questChart.width;
      labelsLayer.style.opacity = String(clamp((MIN_ISLAND_GAP * k - 110) / 50, 0, 1));

      questCheckpoints.forEach((cp, i) => {
        const x = tx + s * cp.x * cover.w;
        const y = ty + s * cp.y * cover.h;
        // Names stay whole on screen: the far islands sit close to the edges.
        const half = (labelAnchors[i].firstElementChild as HTMLElement).offsetWidth / 2 + 12;
        const lx = clamp(x, half, Math.max(half, vp.w - half));
        labelAnchors[i].style.transform = `translate3d(${lx}px, ${y - cp.labelOffset * k}px, 0)`;
        hitAnchors[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (docked) return;

        // Panels open above their island when the band between title and rail
        // allows, otherwise beside it; the pointer always aims at the marker.
        const w = hudBoxes[i].offsetWidth;
        const h = hudBoxes[i].offsetHeight;
        let side: "top" | "right" | "left" = "top";
        let left: number;
        let top: number;
        if (y - HUD_GAP - h >= band.top) {
          left = clamp(x - w / 2, 16, vp.w - 16 - w) - x;
          top = -HUD_GAP - h;
          huds[i].style.setProperty("--caret-x", `${clamp(-left, 28, w - 28)}px`);
        } else {
          side = x + HUD_GAP + w + 16 <= vp.w ? "right" : "left";
          left = side === "right" ? HUD_GAP : -HUD_GAP - w;
          top = clamp(y - h / 2, band.top, Math.max(band.top, band.bottom - h)) - y;
          huds[i].style.setProperty("--caret-y", `${clamp(-top, 24, h - 24)}px`);
        }
        hudAnchors[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
        hudBoxes[i].style.left = `${left}px`;
        hudBoxes[i].style.top = `${top}px`;
        if (huds[i].dataset.place !== side) huds[i].dataset.place = side;
      });
    };

    /** Free vertical band for panels: below the title, above the chapter rail. */
    const measureBand = (vp: Viewport) => {
      const stageTop = stage.getBoundingClientRect().top;
      const titleEnd = introItems[introItems.length - 1];
      const titleBottom = titleEnd.getBoundingClientRect().bottom - stageTop - Number(gsap.getProperty(titleEnd, "y"));
      // offsetTop ignores the rail's own entrance offset (GSAP y) — we want its resting place.
      const railTop = railBox.offsetHeight ? railBox.offsetTop : vp.h;
      return { top: titleBottom + 16, bottom: railTop - 16 };
    };

    /** Scale at which the whole route fits across the screen (never past cover). */
    const openScale = (vp: Viewport, cover: { w: number }) => Math.min(1, vp.w / (ROUTE_SPAN * cover.w));

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const c = ctx.conditions as Record<string, boolean>;
        world.style.transformOrigin = "0 0";

        // Reduced motion: the open chart at once — static, complete, explorable.
        if (c.reduce) {
          const docked = window.matchMedia("(max-width: 767px)").matches;
          const layout = () => {
            const vp = { w: stage.clientWidth, h: stage.clientHeight };
            const cover = coverSize(vp);
            world.style.width = `${cover.w}px`;
            world.style.height = `${cover.h}px`;
            const s = openScale(vp, cover);
            place(vp, cameraTransform(vp, s, ROUTE_CENTER_X, ROUTE_CENTER_Y, 0.5, 0.55), docked, measureBand(vp));
          };
          layout();
          gsap.set(vignette, { opacity: 0 });
          gsap.set(head, { opacity: 0 });
          markers.forEach((m) => {
            gsap.set(m.dot, { opacity: 1 });
            gsap.set(m.ring, { opacity: 0.9 });
            gsap.set(m.glow, { opacity: 0.4 });
            if (m.outer) gsap.set(m.outer, { opacity: 0.45, attr: { r: 26 } });
          });
          setReady(true);
          window.addEventListener("resize", layout);
          return () => {
            window.removeEventListener("resize", layout);
            world.style.cssText = "";
          };
        }

        const cfg = c.desktop ? CONFIGS.desktop : c.tablet ? CONFIGS.tablet : CONFIGS.mobile;
        const state = { k: 0, p: 0, vignette: 1 };
        let vp: Viewport = { w: stage.clientWidth, h: stage.clientHeight };
        let cover = coverSize(vp);
        let s0 = 1;
        let s1 = 1;
        let band = { top: 0, bottom: 0 };

        const apply = () => {
          const s = lerp(s0, s1, state.k);
          const cam = cameraTransform(
            vp,
            s,
            lerp(0.5, ROUTE_CENTER_X, state.k),
            lerp(0.5, ROUTE_CENTER_Y, state.k),
            0.5,
            lerp(0.5, cfg.focusY, state.k),
          );
          // When the open chart is narrower than the screen it keeps a soft frame.
          vignette.style.opacity = String(Math.max(state.vignette, s1 < 0.97 ? 1 : 0));
          route.style.strokeDashoffset = String(length * (1 - state.p));
          const pt = route.getPointAtLength(state.p * length);
          head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          place(vp, cam, cfg.docked, band);
          setReady(state.p >= 0.995);
        };

        const layout = () => {
          vp = { w: stage.clientWidth, h: stage.clientHeight };
          cover = coverSize(vp);
          s1 = openScale(vp, cover);
          s0 = START_SCALE * s1;
          world.style.width = `${cover.w}px`;
          world.style.height = `${cover.h}px`;
          band = measureBand(vp);
          apply();
        };

        // Initial states (GSAP-set ones revert automatically when the breakpoint changes).
        route.style.strokeDasharray = `${length}`;
        gsap.set(head, { opacity: 0 });
        gsap.set(introItems, { opacity: 0, y: 18, filter: "blur(10px)" });
        gsap.set(introVeil, { opacity: 0 });
        gsap.set(railLayers, { opacity: 0, y: 16 });
        markers.forEach((m) => {
          gsap.set(m.dot, { opacity: 0, attr: { r: 2 } });
          gsap.set([m.ring, m.glow, m.outer].filter(Boolean), { opacity: 0 });
        });
        if (cfg.docked) hudAnchors.forEach((a) => (a.style.transform = ""));

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: apply,
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * cfg.scrollVh}`,
            scrub: 0.8,
            anticipatePin: 1,
            onRefresh: layout,
          },
        });

        // 01 — the chart, almost open: just the map and its island names.
        tl.to({}, { duration: 0.3 });
        // 02 — a slight zoom to the open chart, the frame dissolving into the sea.
        tl.to(state, { k: 1, vignette: 0, duration: 1.2, ease: "power1.inOut" });
        // The title surfaces as the chart settles, and stays.
        tl.to(introVeil, { opacity: 1, duration: 0.9 }, "-=0.6")
          .to(introItems, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.25, ease: "power2.out" }, "<")
          .to(railLayers, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "<0.2");
        // 03 — the whole route draws itself; each island lights as the line reaches it.
        const draw = 2.2;
        const drawAt = tl.duration() - 1.4;
        tl.to(head, { opacity: 1, duration: 0.2 }, drawAt);
        tl.to(state, { p: 1, duration: draw, ease: "power1.inOut" }, drawAt);
        questCheckpoints.forEach((cp, i) => {
          const m = markers[i];
          const at = drawAt + stops[i] * draw;
          tl.to(m.dot, { opacity: 1, attr: { r: cp.final ? 5 : 4 }, duration: 0.3, ease: "power2.out" }, at)
            .fromTo(
              m.ring,
              { opacity: 0, attr: { r: 3 } },
              { opacity: 0.9, attr: { r: cp.final ? 15 : 12 }, duration: 0.5, ease: "power2.out" },
              at,
            )
            .to(m.glow, { opacity: cp.final ? 0.55 : 0.4, duration: 0.5 }, at);
          if (m.outer) tl.to(m.outer, { opacity: 0.45, attr: { r: 26 }, duration: 0.8, ease: "power2.out" }, at);
        });
        tl.to(head, { opacity: 0, duration: 0.3 });
        // A short breath on the finished chart before the section releases.
        tl.to({}, { duration: 0.4 });

        layout();
        window.addEventListener("resize", layout);
        return () => {
          window.removeEventListener("resize", layout);
          // Styles written by hand (not via GSAP) are reset for the next breakpoint.
          world.style.cssText = "";
          route.style.strokeDasharray = route.style.strokeDashoffset = "";
          hudAnchors.forEach((a) => (a.style.transform = ""));
          hudBoxes.forEach((b) => (b.style.left = b.style.top = ""));
        };
      },
      stage,
    );

    return () => mm.revert();
  }, []);

  /**
   * Everything that opens a chapter: hover with a mouse, focus with a keyboard,
   * tap on touch (a second tap, or a tap on open sea, closes it).
   */
  const trigger = (i: number): HTMLAttributes<HTMLElement> => ({
    "data-trigger": "",
    onPointerDown: (e: PointerEvent) => {
      pointer.current = e.pointerType;
    },
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setActive(i);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setActive((a) => (a === i ? null : a));
    },
    // Keyboard focus only — a tap also focuses, and its click does the toggling.
    onFocus: (e) => {
      if (e.currentTarget.matches(":focus-visible")) setActive(i);
    },
    onBlur: () => setActive((a) => (a === i ? null : a)),
    onClick: () => {
      if (pointer.current !== "mouse") setActive((a) => (a === i ? null : i));
    },
  } as HTMLAttributes<HTMLElement>);

  const last = questCheckpoints.length - 1;

  return (
    <div
      ref={stageRef}
      data-ready="false"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-trigger]")) setActive(null);
      }}
      className="group/stage relative z-[2] h-screen overflow-hidden bg-ocean [font-variant-numeric:lining-nums]"
      aria-label="Interactive chart of the year-long voyage"
      role="region"
    >
      {/* World: map, route and markers in one coordinate system */}
      <div data-world className="absolute left-0 top-0 aspect-[3840/2144] w-full will-change-transform" aria-hidden>
        <Image
          src={questMap.src}
          alt=""
          fill
          sizes="150vw"
          loading="eager"
          unoptimized
          className="select-none object-fill"
          draggable={false}
        />
        {/* Soft frame that lets the contained chart sink into the sea */}
        <div data-vignette className="absolute inset-0 shadow-[inset_0_0_5vw_2.5vw_var(--ocean)]" />

        <svg
          viewBox={`0 0 ${questChart.width} ${questChart.height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <radialGradient id="quest-glow">
              <stop offset="0%" stopColor="var(--gold-light)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--gold-light)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path data-route d={routeD} fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" />

          {/* Luminous leading edge of the route while it draws */}
          <g data-head>
            <circle r="9" fill="url(#quest-glow)" opacity="0.55" />
            <circle r="1.8" fill="var(--gold-light)" />
          </g>

          {questCheckpoints.map((cp, i) => (
            <g key={cp.id} data-marker={i} transform={`translate(${cp.x * questChart.width} ${cp.y * questChart.height})`}>
              <circle data-glow r={cp.final ? 34 : 24} fill="url(#quest-glow)" />
              {cp.final && (
                <circle data-outer r="18" fill="none" stroke="var(--gold)" strokeWidth="0.75" strokeDasharray="2 4" />
              )}
              <circle data-ring r="12" fill="none" stroke="var(--gold)" strokeWidth="1.2" />
              <circle data-dot r="3.4" fill="var(--gold-light)" />
            </g>
          ))}
        </svg>
      </div>

      {/* Island names — screen space, above each island; also open their chapter */}
      <div data-labels className="pointer-events-none absolute inset-0" aria-hidden>
        {questCheckpoints.map((cp, i) => (
          <div key={cp.id} data-label-anchor className="absolute left-0 top-0">
            <div className="absolute bottom-0 left-0 w-max -translate-x-1/2 pb-2 text-center">
              <div
                {...trigger(i)}
                className={cn(
                  "cursor-pointer px-3 pt-2 transition-[opacity,translate] duration-300 ease-luxe [text-shadow:0_1px_3px_rgba(6,12,20,0.9),0_2px_18px_rgba(6,12,20,0.95)] group-data-[ready=true]/stage:pointer-events-auto",
                  active === i && "-translate-y-2 opacity-0",
                )}
              >
                <p className="font-display text-xl font-semibold leading-none text-gold md:text-[1.75rem]">{chapter(i)}</p>
                <p className="mt-2 font-display text-[0.9375rem] font-bold uppercase tracking-[0.24em] text-gold-light md:text-[1.1875rem]">
                  {cp.subtitle}
                </p>
                <p className="mt-1 font-display text-base italic text-limestone md:text-[1.25rem]">{cp.tagline}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*
        Section title — surfaces once the map fills the screen, then stays.
        Hidden in the markup itself (not only by GSAP) so it never flashes over
        the contained map before hydration; reduced motion shows it statically.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div
          data-intro-veil
          className="absolute inset-x-0 top-0 h-[42vh] bg-gradient-to-b from-[rgba(8,16,26,0.9)] via-[rgba(8,16,26,0.55)] to-transparent opacity-0 motion-reduce:opacity-100"
        />
        <div className="site-container pt-[calc(var(--header-height)+1rem)] text-center md:pt-[calc(var(--header-height)+1.25rem)]">
          <h2
            id="quest-title"
            data-intro-item
            className="mx-auto text-[clamp(1.875rem,3.4vw,3.25rem)] leading-[1.05] text-limestone opacity-0 motion-reduce:opacity-100"
          >
            A Year-Long Voyage <br className="sm:hidden" />
            Toward the <span className="text-gold">Golden Fleece</span>.
          </h2>
          <p
            data-intro-item
            className="mx-auto mt-4 flex w-fit max-w-[40rem] items-center gap-3 rounded-full border border-gold/40 bg-[rgba(8,16,26,0.6)] px-5 py-2 font-display text-[clamp(1rem,1.2vw,1.1875rem)] leading-snug text-limestone opacity-0 motion-reduce:opacity-100"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
              <span className="absolute inset-0 animate-[quest-pulse_2.4s_ease-out_infinite] rounded-full bg-gold-light" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-gold-light" />
            </span>
            <span className="hidden items-center gap-2 [@media(hover:hover)]:inline-flex">
              <MousePointer2 className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden />
              Hover over a point on the route to explore each stage
            </span>
            <span className="inline-flex items-center gap-2 [@media(hover:hover)]:hidden">
              <Hand className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden />
              Tap a point to explore each stage
            </span>
          </p>
        </div>
      </div>

      {/* Hit targets — pulse on every island once the route is drawn */}
      {questCheckpoints.map((cp, i) => (
        <div key={cp.id} data-hit-anchor className="pointer-events-none absolute left-0 top-0 h-0 w-0">
          <button
            type="button"
            {...trigger(i)}
            aria-label={`Chapter ${chapter(i)}: ${cp.subtitle}`}
            className={cn(
              "group/hit absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 outline-none transition-opacity duration-700 group-data-[ready=true]/stage:pointer-events-auto group-data-[ready=true]/stage:opacity-100 focus-visible:ring-1 focus-visible:ring-gold-light",
              cp.final && "h-24 w-24",
            )}
          >
            {/* At rest: rings ripple out from a breathing core; they stop once the chapter is open */}
            {active !== i && (
              <>
                <span
                  className="absolute inset-[34%] animate-[quest-pulse_2.4s_ease-out_infinite] rounded-full border-2 border-gold-light"
                  style={{ animationDelay: `${i * 0.35}s` }}
                  aria-hidden
                />
                <span
                  className="absolute inset-[34%] animate-[quest-pulse_2.4s_ease-out_infinite] rounded-full border-[1.5px] border-gold"
                  style={{ animationDelay: `${i * 0.35 + 1.2}s` }}
                  aria-hidden
                />
              </>
            )}
            <span
              className={cn(
                "absolute inset-[41%] rounded-full bg-gold-light shadow-[0_0_16px_4px_color-mix(in_srgb,var(--gold-light)_65%,transparent)] transition-[scale] duration-300 ease-luxe",
                active === i ? "scale-125" : "animate-[quest-breathe_2.4s_ease-in-out_infinite]",
              )}
              style={{ animationDelay: `${i * 0.35}s` }}
              aria-hidden
            />
            {/* Steady halo while its chapter is open */}
            <span
              className={cn(
                "absolute inset-[16%] rounded-full border-2 border-gold-light shadow-[0_0_26px_color-mix(in_srgb,var(--gold-light)_75%,transparent),inset_0_0_14px_color-mix(in_srgb,var(--gold-light)_35%,transparent)] transition-[opacity,scale] duration-300 ease-luxe",
                active === i ? "scale-100 opacity-100" : "scale-75 opacity-0",
              )}
              aria-hidden
            />
          </button>
        </div>
      ))}

      {/* HUD — screen space beside each island (docked to the bottom on phones) */}
      {questCheckpoints.map((cp, i) => (
        <div
          key={cp.id}
          data-hud-anchor
          className="pointer-events-none absolute inset-0 md:inset-auto md:left-0 md:top-0 md:h-0 md:w-0"
          aria-hidden
        >
          <div
            data-hud-box
            className={cn(
              "absolute inset-x-4 bottom-6 md:inset-x-auto md:bottom-auto",
              cp.final ? "md:w-[31rem]" : "md:w-[27rem]",
            )}
          >
            <div
              data-hud
              data-place="top"
              data-open={active === i}
              className="group invisible relative translate-y-3 scale-[0.97] rounded-md border-2 border-gold/90 bg-[linear-gradient(180deg,rgba(15,28,43,0.95),rgba(9,18,29,0.95))] px-6 py-5 opacity-0 shadow-[0_32px_70px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(211,181,137,0.14)] transition-[opacity,translate,scale,visibility] duration-300 ease-luxe data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 md:px-9 md:py-8 md:[@media(max-height:820px)]:px-7 md:[@media(max-height:820px)]:py-5"
            >
              <p className="font-display text-[0.875rem] font-medium uppercase tracking-[0.3em] text-gold md:text-[0.9375rem]">
                Chapter {chapter(i)}
              </p>
              {cp.headline ? (
                <>
                  <p className="monument mt-3 whitespace-nowrap text-[clamp(1.375rem,2vw,1.75rem)] leading-tight text-gold-light">
                    {cp.headline}
                  </p>
                  <p className="mt-2 font-display text-[1.25rem] italic leading-snug text-limestone md:text-[1.375rem]">
                    {cp.title}
                  </p>
                </>
              ) : (
                <p className="mt-2 font-display text-[clamp(1.75rem,2.7vw,2.625rem)] leading-[1.05] text-limestone md:[@media(max-height:820px)]:text-[2rem]">
                  {cp.title}
                </p>
              )}
              {cp.description.map((line, l) => (
                <p
                  key={line}
                  className={cn(
                    "font-display text-[1.0625rem] leading-[1.45] text-limestone-soft md:text-[1.1875rem] md:[@media(max-height:820px)]:text-[1.0625rem]",
                    l === 0 ? "mt-3 md:mt-4" : "mt-2",
                  )}
                >
                  {line}
                </p>
              ))}
              {cp.tags && (
                <>
                  <span className="mt-5 block h-px bg-gold/30 md:mt-6" aria-hidden />
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 md:mt-5">
                    {cp.tags.map(({ label, icon }) => {
                      const Icon = ICONS[icon];
                      return (
                        <li key={label} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gold md:h-6 md:w-6" strokeWidth={1.25} aria-hidden />
                          <span className="font-display text-[1rem] text-limestone-soft md:text-[1.0625rem]">{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* Pointer notch + hairline stem to the marker, on whichever side faces it */}
              <span
                className="absolute top-full hidden h-3 w-3 -translate-x-1/2 -translate-y-[7px] rotate-45 border-b-2 border-r-2 border-gold/90 bg-[rgb(9,18,29)] md:group-data-[place=top]:block"
                style={{ left: "var(--caret-x, 50%)" }}
                aria-hidden
              />
              <span
                className="absolute top-full hidden w-px bg-gradient-to-b from-gold/80 to-gold/30 md:group-data-[place=top]:block"
                style={{ left: "calc(var(--caret-x, 50%) - 0.5px)", height: `${HUD_GAP - 10}px`, marginTop: "5px" }}
                aria-hidden
              />
              <span
                className="absolute left-0 hidden h-3 w-3 -translate-x-[7px] -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-gold/90 bg-[rgb(9,18,29)] md:group-data-[place=right]:block"
                style={{ top: "var(--caret-y, 50%)" }}
                aria-hidden
              />
              <span
                className="absolute right-full hidden h-px bg-gradient-to-l from-gold/80 to-gold/30 md:group-data-[place=right]:block"
                style={{ top: "calc(var(--caret-y, 50%) - 0.5px)", width: `${HUD_GAP - 10}px`, marginRight: "5px" }}
                aria-hidden
              />
              <span
                className="absolute right-0 hidden h-3 w-3 translate-x-[7px] -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-gold/90 bg-[rgb(9,18,29)] md:group-data-[place=left]:block"
                style={{ top: "var(--caret-y, 50%)" }}
                aria-hidden
              />
              <span
                className="absolute left-full hidden h-px bg-gradient-to-r from-gold/80 to-gold/30 md:group-data-[place=left]:block"
                style={{ top: "calc(var(--caret-y, 50%) - 0.5px)", width: `${HUD_GAP - 10}px`, marginLeft: "5px" }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      ))}

      {/* Settles the rail onto the sea so it reads clearly over the map (appears with the title) */}
      <div
        data-rail-layer
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-56 bg-gradient-to-t from-ocean via-ocean/70 to-transparent opacity-0 md:block motion-reduce:opacity-100"
      />

      {/* Chapter rail — a second way in: hovering a chapter opens it on the chart */}
      <div
        data-rail-box
        data-rail-layer
        className="pointer-events-none absolute inset-x-0 bottom-14 mx-auto hidden w-[min(76rem,88vw)] opacity-0 md:block motion-reduce:opacity-100"
        aria-hidden
      >
        <div className="absolute left-0 right-0 top-[9px] h-px bg-gradient-to-r from-transparent via-limestone/25 to-transparent" />
        <div className="absolute left-[10%] right-[10%] top-[9px] h-px">
          <div
            style={{ transform: `scaleX(${active === null ? 1 : active / last})` }}
            className={cn(
              "h-full w-full origin-left bg-gradient-to-r from-gold/70 to-gold shadow-[0_0_8px_color-mix(in_srgb,var(--gold)_60%,transparent)] transition-[transform,opacity] duration-500 ease-luxe",
              active === null && "opacity-40",
            )}
          />
        </div>
        <ol className="relative grid grid-cols-5">
          {questCheckpoints.map((cp, i) => (
            <li key={cp.id} className="flex justify-center">
              <button
                type="button"
                tabIndex={-1}
                {...trigger(i)}
                data-state={active === i ? "active" : "idle"}
                className="group flex cursor-pointer flex-col items-center px-3 text-limestone-soft transition-colors duration-300 hover:text-limestone data-[state=active]:text-gold group-data-[ready=true]/stage:pointer-events-auto"
              >
                <span className="relative flex h-[19px] w-[19px] items-center justify-center rounded-full border border-limestone/50 bg-ocean transition-[border-color,box-shadow,scale] duration-300 group-data-[state=active]:scale-125 group-data-[state=active]:border-[1.5px] group-data-[state=active]:border-gold group-data-[state=active]:shadow-[0_0_18px_color-mix(in_srgb,var(--gold)_85%,transparent)]">
                  <span className="h-[7px] w-[7px] scale-0 rounded-full bg-gold-light transition-transform duration-300 group-data-[state=active]:scale-100" />
                </span>
                <span className="mt-4 font-display text-[1.25rem] leading-none">{chapter(i)}</span>
                <span className="mt-2 text-center font-display text-[0.875rem] font-medium uppercase tracking-[0.2em]">
                  {cp.subtitle}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
