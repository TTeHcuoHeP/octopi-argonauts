"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Gem,
  GraduationCap,
  Landmark,
  ListChecks,
  MailOpen,
  MessageSquareText,
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
import {
  cameraTransform,
  coverSize,
  measureCheckpoints,
  routePoints,
  smoothPath,
  type Viewport,
} from "./questGeometry";

/** Per-breakpoint camera choreography. Scroll length is in viewport heights. */
type JourneyConfig = {
  /** Initial map width as a fraction of the viewport. */
  contain: number;
  /** Deep-zoom factor relative to full-bleed cover scale. */
  zoom: number;
  /** Where the route head sits on screen while travelling (room above for the HUD). */
  focusX: number;
  focusY: number;
  /** HUD docked to the bottom of the screen instead of above the island. */
  docked: boolean;
  scrollVh: number;
  /** Timeline units for the whole route; split between legs by distance. */
  travel: number;
};

const CONFIGS: Record<"desktop" | "tablet" | "mobile", JourneyConfig> = {
  desktop: { contain: 0.7, zoom: 1.5, focusX: 0.45, focusY: 0.66, docked: false, scrollVh: 10.5, travel: 9 },
  tablet: { contain: 0.82, zoom: 1.3, focusX: 0.5, focusY: 0.64, docked: false, scrollVh: 9.5, travel: 8 },
  mobile: { contain: 0.92, zoom: 1.15, focusX: 0.5, focusY: 0.4, docked: true, scrollVh: 8.5, travel: 7 },
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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const chapter = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Section 04 journey: a pinned, scroll-scrubbed camera over the island map.
 * Contained map → full bleed (the section title surfaces) → deep zoom on the
 * first island → travel east while the gold route draws itself. Each island
 * carries its name from the start; on arrival the name opens into a HUD
 * panel, and closes back into the name on departure. One master timeline
 * drives everything; map, route and markers share one transformed coordinate
 * system, labels and HUDs stay in screen space for legibility.
 */
export function QuestJourney() {
  const stageRef = useRef<HTMLDivElement>(null);
  const routeD = useMemo(() => smoothPath(routePoints()), []);

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
    const labels = gsap.utils.toArray<HTMLElement>("[data-label]", stage);
    const hudAnchors = gsap.utils.toArray<HTMLElement>("[data-hud-anchor]", stage);
    const hudBoxes = gsap.utils.toArray<HTMLElement>("[data-hud-box]", stage);
    const huds = gsap.utils.toArray<HTMLElement>("[data-hud]", stage);
    const rail = gsap.utils.toArray<HTMLElement>("[data-rail]", stage);
    const railBox = stage.querySelector<HTMLElement>("[data-rail-box]")!;
    const railLayers = gsap.utils.toArray<HTMLElement>("[data-rail-layer]", stage);
    const railFill = stage.querySelector<HTMLElement>("[data-rail-fill]")!;
    const markers = questCheckpoints.map((_, i) => ({
      dot: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-dot]`)!,
      ring: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-ring]`)!,
      glow: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-glow]`)!,
      outer: stage.querySelector<SVGCircleElement>(`[data-marker="${i}"] [data-outer]`),
    }));
    const length = route.getTotalLength();
    const stops = measureCheckpoints(route);

    /** Screen positions of each island label above its marker, scaled with the map. */
    const placeLabels = (tx: number, ty: number, s: number, coverW: number, coverH: number, dim = 1) => {
      const k = (s * coverW) / questChart.width;
      questCheckpoints.forEach((cp, i) => {
        const x = tx + s * cp.x * coverW;
        const y = ty + s * cp.y * coverH - cp.labelOffset * k;
        labelAnchors[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      labelsLayer.style.opacity = String(clamp((MIN_ISLAND_GAP * k - 110) / 50, 0, 1) * dim);
    };

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
        let vp: Viewport = { w: stage.clientWidth, h: stage.clientHeight };

        // Reduced motion: the whole chart at once — static, complete, readable.
        if (c.reduce) {
          const place = () => {
            vp = { w: stage.clientWidth, h: stage.clientHeight };
            const cover = coverSize(vp);
            const s = Math.min((0.92 * vp.w) / cover.w, (0.86 * vp.h) / cover.h);
            const cam = cameraTransform(vp, s, 0.5, 0.5, 0.5, 0.5);
            gsap.set(world, { width: cover.w, height: cover.h, x: cam.tx, y: cam.ty, scale: s, transformOrigin: "0 0" });
            placeLabels(cam.tx, cam.ty, s, cover.w, cover.h);
          };
          place();
          gsap.set(vignette, { opacity: 1 });
          gsap.set(head, { opacity: 0 });
          markers.forEach((m) => {
            gsap.set(m.dot, { opacity: 1 });
            gsap.set(m.ring, { opacity: 0.6 });
          });
          window.addEventListener("resize", place);
          return () => window.removeEventListener("resize", place);
        }

        const cfg = c.desktop ? CONFIGS.desktop : c.tablet ? CONFIGS.tablet : CONFIGS.mobile;
        const state = { k: 0, z: 1, cx: 0.5, cy: 0.5, fx: 0.5, fy: 0.5, follow: 0, p: 0, vignette: 1 };
        let cover = coverSize(vp);
        let s0 = 1;
        let hudSizes: { w: number; h: number }[] = [];
        /** Free vertical band for HUDs: below the title, above the chapter rail. */
        let band = { top: 0, bottom: 0 };
        let railIndex = -2;

        const layout = () => {
          vp = { w: stage.clientWidth, h: stage.clientHeight };
          cover = coverSize(vp);
          s0 = Math.min((cfg.contain * vp.w) / cover.w, (0.8 * vp.h) / cover.h);
          world.style.width = `${cover.w}px`;
          world.style.height = `${cover.h}px`;
          hudSizes = hudBoxes.map((b) => ({ w: b.offsetWidth, h: b.offsetHeight }));
          const stageTop = stage.getBoundingClientRect().top;
          const titleEnd = introItems[introItems.length - 1];
          const titleBottom =
            titleEnd.getBoundingClientRect().bottom - stageTop - Number(gsap.getProperty(titleEnd, "y"));
          // offsetTop ignores the rail's own entrance offset (GSAP y) — we want its resting place.
          const railTop = railBox.offsetHeight ? railBox.offsetTop : vp.h;
          band = { top: titleBottom + 16, bottom: railTop - 16 };
          apply();
        };

        const apply = () => {
          const s = lerp(s0, 1, state.k) * state.z;
          const pt = route.getPointAtLength(state.p * length);
          const cx = lerp(state.cx, pt.x / questChart.width, state.follow);
          const cy = lerp(state.cy, pt.y / questChart.height, state.follow);
          const cam = cameraTransform(vp, s, cx, cy, state.fx, state.fy);

          world.style.transform = `translate3d(${cam.tx}px, ${cam.ty}px, 0) scale(${s})`;
          vignette.style.opacity = String(state.vignette);
          route.style.strokeDashoffset = String(length * (1 - state.p));
          head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          placeLabels(cam.tx, cam.ty, s, cover.w, cover.h);

          // HUDs open above their island when the band between title and rail
          // allows, otherwise beside it; the pointer always aims at the marker.
          if (!cfg.docked) {
            questCheckpoints.forEach((cp, i) => {
              const x = cam.tx + s * cp.x * cover.w;
              const y = cam.ty + s * cp.y * cover.h;
              const { w, h } = hudSizes[i];
              let place: "top" | "right" | "left" = "top";
              let left: number;
              let top: number;
              if (y - HUD_GAP - h >= band.top) {
                left = clamp(x - w / 2, 16, vp.w - 16 - w) - x;
                top = -HUD_GAP - h;
                huds[i].style.setProperty("--caret-x", `${clamp(-left, 28, w - 28)}px`);
              } else {
                place = x + HUD_GAP + w + 16 <= vp.w ? "right" : "left";
                left = place === "right" ? HUD_GAP : -HUD_GAP - w;
                top = clamp(y - h / 2, band.top, Math.max(band.top, band.bottom - h)) - y;
                huds[i].style.setProperty("--caret-y", `${clamp(-top, 24, h - 24)}px`);
              }
              hudAnchors[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
              hudBoxes[i].style.left = `${left}px`;
              hudBoxes[i].style.top = `${top}px`;
              if (huds[i].dataset.place !== place) huds[i].dataset.place = place;
            });
          }

          // Chapter rail: gold line follows the route continuously; states change per chapter.
          let idx = -1;
          if (state.follow >= 1) stops.forEach((stop, i) => state.p >= stop - 0.002 && (idx = i));
          const last = stops.length - 1;
          const leg = idx >= 0 && idx < last ? clamp((state.p - stops[idx]) / (stops[idx + 1] - stops[idx]), 0, 1) : 0;
          railFill.style.transform = `scaleX(${idx < 0 ? 0 : idx >= last ? 1 : (idx + leg) / last})`;
          if (idx !== railIndex) {
            railIndex = idx;
            rail.forEach((el, i) => (el.dataset.state = i === idx ? "active" : i < idx ? "done" : "ahead"));
          }
        };

        // Initial states (GSAP-set ones revert automatically when the breakpoint changes).
        world.style.transformOrigin = "0 0";
        route.style.strokeDasharray = `${length}`;
        gsap.set(head, { opacity: 0 });
        gsap.set(introItems, { opacity: 0, y: 18, filter: "blur(10px)" });
        gsap.set(introVeil, { opacity: 0 });
        gsap.set(railLayers, { opacity: 0, y: 16 });
        gsap.set(huds, { autoAlpha: 0, y: 14, scale: 0.96, transformOrigin: "50% 100%" });
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

        // 01 — calm, contained chart: just the map and its island names.
        tl.to({}, { duration: 0.4 });
        // 02 — expand to full bleed, the frame dissolving into the sea.
        tl.to(state, { k: 1, vignette: 0, duration: 2, ease: "power1.inOut" });
        // The section title surfaces once the map fills the screen, and stays.
        tl.to(introVeil, { opacity: 1, duration: 0.9 })
          .to(introItems, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.25, ease: "power2.out" }, "<")
          .to(railLayers, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "<0.2")
          .to({}, { duration: 1.2 });
        // 03 — move in close over the first island (the title stays for the whole journey).
        const first = questCheckpoints[0];
        tl.to(state, {
          z: cfg.zoom,
          cx: first.x,
          cy: first.y,
          fx: cfg.focusX,
          fy: cfg.focusY,
          duration: 2.2,
          ease: "power2.inOut",
        });
        // From here the camera rides the head of the route (identical point at p = 0).
        tl.set(state, { follow: 1 });
        tl.to(head, { opacity: 1, duration: 0.3 });

        // 04+ — each island: its name opens into the HUD, lingers, closes, travel on.
        questCheckpoints.forEach((cp, i) => {
          const m = markers[i];
          tl.to(labels[i], { opacity: 0, y: -10, duration: 0.4, ease: "power1.in" })
            .to(m.dot, { opacity: 1, attr: { r: cp.final ? 5 : 4 }, duration: 0.3, ease: "power2.out" }, "<")
            .fromTo(
              m.ring,
              { opacity: 0, attr: { r: 3 } },
              { opacity: 0.95, attr: { r: cp.final ? 15 : 12 }, duration: 0.6, ease: "power2.out" },
              "<",
            )
            .to(m.glow, { opacity: cp.final ? 0.65 : 0.5, duration: 0.6 }, "<")
            .to(huds[i], { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, "<0.15");
          if (m.outer) tl.to(m.outer, { opacity: 0.45, attr: { r: 26 }, duration: 0.9, ease: "power2.out" }, "<");

          tl.to({}, { duration: cp.final ? 2.2 : 1.1 });
          if (cp.final) return;

          tl.to(huds[i], { autoAlpha: 0, y: 10, scale: 0.97, duration: 0.45, ease: "power1.in" })
            .to(m.glow, { opacity: 0.12, duration: 0.45 }, "<")
            .to(m.ring, { opacity: 0.45, duration: 0.45 }, "<")
            .to(labels[i], { opacity: 1, y: 0, duration: 0.45, ease: "power1.out" }, "<0.2");

          // Travel: eased so the camera slows into the next island.
          const leg = (stops[i + 1] - stops[i]) * cfg.travel;
          tl.to(state, { p: stops[i + 1], duration: leg, ease: "sine.inOut" });
          // The next marker surfaces faintly as the route approaches it.
          tl.to(markers[i + 1].dot, { opacity: 0.45, attr: { r: 2.6 }, duration: leg * 0.3 }, `>-${leg * 0.3}`);
        });

        // A last breath on the destination before the section releases.
        tl.to({}, { duration: 0.8 });

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

  return (
    <div
      ref={stageRef}
      className="relative z-[2] h-screen overflow-hidden bg-ocean [font-variant-numeric:lining-nums]"
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

          {/* Luminous leading edge of the route */}
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

      {/* Island names — screen space, above each island */}
      <div data-labels className="pointer-events-none absolute inset-0" aria-hidden>
        {questCheckpoints.map((cp, i) => (
          <div key={cp.id} data-label-anchor className="absolute left-0 top-0">
            <div className="absolute bottom-0 left-0 w-max -translate-x-1/2 text-center">
              <div data-label className="[text-shadow:0_1px_12px_rgba(6,12,20,0.95)]">
                <p className="font-display text-base leading-none text-gold md:text-lg">{chapter(i)}</p>
                <p className="mt-1.5 font-display text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-gold-light md:text-[0.875rem]">
                  {cp.subtitle}
                </p>
                <p className="mt-1 font-display text-[0.875rem] italic text-limestone md:text-base">{cp.tagline}</p>
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
            className="mx-auto mt-3 max-w-[40rem] font-display text-[clamp(1rem,1.3vw,1.25rem)] leading-[1.45] text-limestone-soft opacity-0 motion-reduce:opacity-100"
          >
            Scroll to trace the route, uncover each stage, and reveal the rewards of the journey.
          </p>
        </div>
      </div>

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
              className="group invisible relative rounded-md border-2 border-gold/90 bg-[linear-gradient(180deg,rgba(15,28,43,0.95),rgba(9,18,29,0.95))] px-6 py-5 opacity-0 shadow-[0_32px_70px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(211,181,137,0.14)] md:px-9 md:py-8 md:[@media(max-height:820px)]:px-7 md:[@media(max-height:820px)]:py-5"
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
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-56 bg-gradient-to-t from-ocean via-ocean/70 to-transparent opacity-0 md:block motion-reduce:hidden"
      />

      {/* Chapter rail — the route in miniature: gold up to where you are */}
      <div
        data-rail-box
        data-rail-layer
        className="pointer-events-none absolute inset-x-0 bottom-14 mx-auto hidden w-[min(76rem,88vw)] opacity-0 md:block motion-reduce:hidden"
        aria-hidden
      >
        <div className="absolute left-0 right-0 top-[9px] h-px bg-gradient-to-r from-transparent via-limestone/25 to-transparent" />
        <div className="absolute left-[10%] right-[10%] top-[9px] h-px">
          <div
            data-rail-fill
            style={{ transform: "scaleX(0)" }}
            className="h-full w-full origin-left bg-gradient-to-r from-gold/70 to-gold shadow-[0_0_8px_color-mix(in_srgb,var(--gold)_60%,transparent)]"
          />
        </div>
        <ol className="relative grid grid-cols-5">
          {questCheckpoints.map((cp, i) => (
            <li
              key={cp.id}
              data-rail
              data-state="ahead"
              className="group flex flex-col items-center text-stone transition-colors duration-500 data-[state=active]:text-gold data-[state=done]:text-limestone"
            >
              <span className="relative flex h-[19px] w-[19px] items-center justify-center rounded-full border border-limestone/40 bg-ocean transition-[border-color,box-shadow,scale] duration-500 group-data-[state=active]:border-[1.5px] group-data-[state=active]:border-gold group-data-[state=active]:scale-125 group-data-[state=active]:shadow-[0_0_18px_color-mix(in_srgb,var(--gold)_85%,transparent)] group-data-[state=done]:border-limestone/60">
                <span className="h-[7px] w-[7px] scale-0 rounded-full bg-gold-light transition-transform duration-500 group-data-[state=active]:scale-100" />
              </span>
              <span className="mt-4 font-display text-[1.25rem] leading-none">{chapter(i)}</span>
              <span className="mt-2 text-center font-display text-[0.875rem] font-medium uppercase tracking-[0.2em]">
                {cp.subtitle}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
