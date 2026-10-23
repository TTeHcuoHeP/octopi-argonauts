"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getGsap } from "@/animations/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { HERO_SEQUENCE, coverRect, frameSrc } from "./sequence";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
/** Higher = the compass catches up with the cursor faster. */
const FOLLOW = 3.2;

/** Rest frame first, then coarse-to-fine so early scrubbing already has coverage. */
function loadOrder(count: number, rest: number) {
  const order = [rest];
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i);
  }
  return order;
}

function afterLoad(cb: () => void) {
  const idle = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
    else setTimeout(cb, 200);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/**
 * Hero background: the compass turns with the cursor.
 * Horizontal pointer position scrubs a 47-frame sequence, eased so the
 * compass glides rather than snaps; it settles back to rest when the pointer
 * leaves the hero.
 * - The poster (the rest frame) always paints first via next/image (LCP).
 * - Frames load only for mouse/trackpad users with motion allowed, after the
 *   page has finished loading. Touch and reduced motion keep the still poster.
 */
export function HeroSequence() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const host = root?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !root || !canvas || !host || !ctx) return;

    const { gsap } = getGsap();
    const { count, restFrame } = HERO_SEQUENCE;
    const frames: (HTMLImageElement | null)[] = Array(count).fill(null);
    const state = { current: restFrame, target: restFrame, drawn: -1 };
    let cancelled = false;
    let size = { w: 0, h: 0 };

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (force = false) => {
      const want = Math.round(state.current);
      const i = nearestLoaded(want);
      if (i < 0 || (!force && i === state.drawn)) return;
      const img = frames[i]!;
      const r = coverRect(size.w, size.h, window.innerWidth);
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
      state.drawn = i;
    };

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = { w: width, h: height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";
      draw(true);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    // Pick the frame set once: the larger one only when the screen needs it.
    const { width } = root.getBoundingClientRect();
    const set = width * Math.min(window.devicePixelRatio || 1, 2) > 1400 ? 1920 : 1280;

    afterLoad(() => {
      loadOrder(count, restFrame).forEach((i) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = frameSrc(set, i);
        img
          .decode()
          .then(() => {
            if (cancelled) return;
            frames[i] = img;
            // Swaps in the new frame only if it is closer to the wanted one.
            draw();
            if (i === restFrame) setReady(true);
          })
          .catch(() => {});
      });
    });

    const tick = (_time: number, deltaMs: number) => {
      const diff = state.target - state.current;
      if (Math.abs(diff) < 0.01) {
        state.current = state.target;
      } else {
        state.current += diff * (1 - Math.exp((-FOLLOW * deltaMs) / 1000));
      }
      draw();
    };
    gsap.ticker.add(tick);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      state.target = t * (count - 1);
    };
    const onLeave = () => {
      state.target = restFrame;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
      observer.disconnect();
    };
  }, [enabled]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src={HERO_SEQUENCE.poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[88%_30%] md:object-[75%_50%]"
      />
      {enabled && (
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 block transition-opacity duration-700 ease-luxe",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Legibility veils — keep text crisp without flattening the compass */}
      {/* Mobile: the compass peeks from the upper right; text sits on a deeper veil */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean/5 via-ocean/70 to-ocean md:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ocean via-ocean/40 to-transparent md:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-ocean to-transparent md:block" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ocean/70 to-transparent" />
    </div>
  );
}
