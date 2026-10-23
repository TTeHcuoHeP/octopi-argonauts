/**
 * Hero background frame sequence (extracted from public/video/argonauts_short.mp4).
 * Frames live in public/sequence/compass/{size}/frame_001.webp … frame_047.webp.
 */
export const HERO_SEQUENCE = {
  count: 47,
  /** Frame shown at rest and as the static poster. */
  restFrame: 23,
  sizes: [1280, 1920] as const,
  aspect: 16 / 9,
  poster: "/images/hero-sequence-poster.jpg",
  /** Compass centre within the frame (0..1), used to anchor the hero chart. */
  compass: { x: 0.76, y: 0.445 },
};

export function frameSrc(size: number, index: number) {
  return `/sequence/compass/${size}/frame_${String(index + 1).padStart(3, "0")}.webp`;
}

/**
 * Mirrors the poster's object-position: `object-[88%_30%] md:object-[75%_50%]`.
 * The compass sits right of centre in the footage, so cropping leans right to
 * keep it in frame on narrower screens.
 */
export function framePosition(viewportWidth: number) {
  return viewportWidth < 768 ? { x: 0.88, y: 0.3 } : { x: 0.75, y: 0.5 };
}

/** object-fit: cover geometry for a frame inside a `width × height` box. */
export function coverRect(width: number, height: number, viewportWidth = width) {
  const h = Math.max(width / HERO_SEQUENCE.aspect, height);
  const w = h * HERO_SEQUENCE.aspect;
  const pos = framePosition(viewportWidth);
  return { x: (width - w) * pos.x, y: (height - h) * pos.y, w, h };
}

/** Where the compass sits on screen for a hero of the given size. */
export function compassAnchor(width: number, height: number, viewportWidth = width) {
  const r = coverRect(width, height, viewportWidth);
  return { x: r.x + r.w * HERO_SEQUENCE.compass.x, y: r.y + r.h * HERO_SEQUENCE.compass.y };
}
