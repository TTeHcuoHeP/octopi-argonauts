"use client";

import { useEffect, useRef, useState } from "react";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { createPortolanChart, type ChartAnchor, type ChartPalette } from "@/components/graphics/portolanChart";
import { compassAnchor } from "@/components/sections/hero/sequence";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const MASK =
  "radial-gradient(circle var(--r, 0px) at 50% 50%, #000 0%, rgba(0,0,0,0.85) 42%, transparent 100%)";

function readPalette(): ChartPalette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    limestone: v("--limestone"),
    gold: v("--gold"),
    goldLight: v("--gold-light"),
    goldDim: v("--gold-dim"),
    slate: v("--slate"),
  };
}

/** The hero compass in page coordinates — the origin of the rhumb network. */
function readAnchor(): ChartAnchor {
  const hero = document.getElementById("top");
  if (!hero) return { x: window.innerWidth * 0.8, y: window.innerHeight * 0.46 };
  const r = hero.getBoundingClientRect();
  const a = compassAnchor(r.width, r.height, window.innerWidth);
  return { x: r.left + window.scrollX + a.x, y: r.top + window.scrollY + a.y };
}

/**
 * Site-wide cursor map-reveal. One continuous generative chart lies under the
 * whole page and is uncovered through a soft lens that trails the pointer.
 *
 * Layering: the lens is a fixed layer at z-index 1 — above section
 * backgrounds and decorative art, below `.site-container` (z-index 2), so
 * text and UI always sit on top of the map.
 *
 * Only the region under the lens is drawn, in page coordinates, so the map
 * stays aligned while scrolling and the cost does not grow with page length.
 * Mouse/trackpad only; touch devices and reduced motion render nothing.
 */
export function ChartLens() {
  const [enabled, setEnabled] = useState(false);
  const lensRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia(FINE_POINTER);
    const update = () => setEnabled(!prefersReducedMotion() && pointer.matches);
    update();
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const canvas = lensRef.current;
    const ring = ringRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !canvas || !ring || !ctx) return;

    const { gsap } = getGsap();
    const drawRegion = createPortolanChart(readPalette());
    const lens = { x: 0, y: 0, r: 0 };
    let anchor = readAnchor();
    let radius = 200;
    let size = 0;
    let dpr = 1;
    let lastKey = "";

    const layout = () => {
      radius = Math.min(260, Math.max(150, window.innerWidth * 0.14));
      size = Math.ceil(radius * 2 + 8);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = canvas.style.height = `${size}px`;
      anchor = readAnchor();
      lastKey = "";
    };
    layout();

    const tick = () => {
      const { x, y, r } = lens;
      // Whole-pixel placement keeps the drawn region and the canvas in register.
      const left = Math.round(x - size / 2);
      const top = Math.round(y - size / 2);
      canvas.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      canvas.style.setProperty("--r", `${r}px`);
      ring.style.transform = `translate3d(${x - r}px, ${y - r}px, 0)`;
      ring.style.width = ring.style.height = `${r * 2}px`;
      ring.style.opacity = r > 1 ? "1" : "0";
      if (r < 1) return;

      // Redraw only when the visible world region actually changed.
      const ox = left + window.scrollX;
      const oy = top + window.scrollY;
      const key = `${ox}:${oy}`;
      if (key === lastKey) return;
      lastKey = key;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
      drawRegion(ctx, ox, oy, size, anchor);
    };
    gsap.ticker.add(tick);

    const toX = gsap.quickTo(lens, "x", { duration: 0.7, ease: "power3.out" });
    const toY = gsap.quickTo(lens, "y", { duration: 0.7, ease: "power3.out" });
    let inside = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!inside) {
        // Open the lens where the pointer is rather than sliding in from a stale spot.
        inside = true;
        toX(e.clientX, e.clientX);
        toY(e.clientY, e.clientY);
        gsap.to(lens, { r: radius, duration: 1.1, ease: "power3.out", overwrite: "auto" });
        return;
      }
      toX(e.clientX);
      toY(e.clientY);
    };
    const onLeave = () => {
      inside = false;
      gsap.to(lens, { r: 0, duration: 0.7, ease: "power2.inOut", overwrite: "auto" });
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) onLeave();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", layout);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", layout);
      gsap.ticker.remove(tick);
      gsap.killTweensOf(lens);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      <canvas
        ref={lensRef}
        className="absolute left-0 top-0 block will-change-transform"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full opacity-0 transition-opacity duration-500 ease-luxe"
        style={{ boxShadow: "inset 0 0 40px color-mix(in srgb, var(--gold) 8%, transparent)" }}
      />
    </div>
  );
}
