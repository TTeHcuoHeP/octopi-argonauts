/** Returns true when the user prefers reduced motion (or on the server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !("matchMedia" in window)) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Coarse pointer / narrow viewport heuristic used to simplify animation on mobile. */
export function isCompactViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}
