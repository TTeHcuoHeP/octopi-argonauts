import { questChart, questCheckpoints, questMap, questRouteVia } from "@/data/quest";

export type Point = [number, number];

/** Checkpoints and open-water waypoints, interleaved, in `questChart` units. */
export function routePoints(): Point[] {
  const pts: Point[] = [];
  questCheckpoints.forEach((cp, i) => {
    pts.push([cp.x * questChart.width, cp.y * questChart.height]);
    if (questRouteVia[i]) pts.push(questRouteVia[i]);
  });
  return pts;
}

/** Catmull-Rom spline through every point, as cubic Bézier SVG path data. */
export function smoothPath(pts: Point[]): string {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/**
 * Fraction of the path length at each checkpoint, in order. Uses the data's
 * `routePosition` when given, otherwise finds the closest point on the path,
 * searching forward from the previous checkpoint.
 */
export function measureCheckpoints(path: SVGPathElement): number[] {
  const total = path.getTotalLength();
  const steps = 1600;
  let from = 0;
  return questCheckpoints.map((cp, i) => {
    if (cp.routePosition !== undefined) return cp.routePosition;
    if (i === 0) return 0;
    if (i === questCheckpoints.length - 1) return 1;
    const tx = cp.x * questChart.width;
    const ty = cp.y * questChart.height;
    let best = from;
    let bestD = Infinity;
    for (let s = Math.round(from * steps); s <= steps; s++) {
      const p = path.getPointAtLength((s / steps) * total);
      const d = (p.x - tx) ** 2 + (p.y - ty) ** 2;
      if (d < bestD) {
        bestD = d;
        best = s / steps;
      }
    }
    from = best;
    return best;
  });
}

export type Viewport = { w: number; h: number };

/** Map size at "cover" scale for the viewport — the scale-1 reference. */
export function coverSize(vp: Viewport) {
  const aspect = questMap.width / questMap.height;
  const w = Math.max(vp.w, vp.h * aspect);
  return { w, h: w / aspect };
}

/** Position on one axis: centred when smaller than the view, else clamped so no edge shows. */
function axis(target: number, size: number, view: number) {
  if (size <= view) return (view - size) / 2;
  return Math.min(0, Math.max(view - size, target));
}

/**
 * Camera → world transform. Puts the map point (cx, cy) (normalised) at the
 * screen point (fx, fy) (fractions of the viewport) at scale `s` relative to
 * cover size, then clamps so the viewport never shows past the map edge.
 */
export function cameraTransform(vp: Viewport, s: number, cx: number, cy: number, fx: number, fy: number) {
  const cover = coverSize(vp);
  const w = cover.w * s;
  const h = cover.h * s;
  const tx = axis(fx * vp.w - cx * w, w, vp.w);
  const ty = axis(fy * vp.h - cy * h, h, vp.h);
  return { tx, ty, s, cover };
}
