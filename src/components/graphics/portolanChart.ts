import { createNoise2D, createRandom, hashSeed } from "@/lib/noise";

/**
 * Generative portolan chart in page (document) coordinates — one continuous
 * map beneath the whole site, revealed through the cursor lens.
 *
 * One seeded noise field drives the composition: land where the field is
 * high, depth contours (isobaths) stepping into open sea, soundings only in
 * deep water. A rhumb-line network radiates from the compass in the hero.
 * Every element is a pure function of world position, so any region can be
 * drawn on its own and neighbouring regions always line up.
 */

export type ChartPalette = {
  limestone: string;
  gold: string;
  goldLight: string;
  goldDim: string;
  slate: string;
};

/** Centre of the rhumb-line network, in page px. */
export type ChartAnchor = { x: number; y: number };

export const CHART_SEED = "argonauts-2027-colchis";

/** World scale in px — fixed, so the map does not change with the viewport. */
const UNIT = 900;
/** Field sampling step in px. */
const CELL = 9;
/** Field level above which the chart is land. */
const LAND = 0.38;
/** Isobath levels below the coast, shallow → deep. */
const DEPTHS = [0.24, 0.1, -0.04, -0.18];
/** Soundings: one candidate per cell of this size. */
const SOUNDING_CELL = 64;

function rgba(hex: string, alpha: number) {
  const h = hex.trim().replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Deterministic [0, 1) hash of an integer lattice point. */
function hash2(i: number, j: number, salt: number) {
  let h = Math.imul(i, 0x27d4eb2d) ^ Math.imul(j, 0x165667b1) ^ salt;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

type Grid = { values: Float32Array; cols: number; rows: number; x0: number; y0: number };

export function createPortolanChart(palette: ChartPalette, seed = CHART_SEED) {
  const noise = createNoise2D(createRandom(seed));
  const salt = hashSeed(`${seed}:soundings`);
  const landCanvas = document.createElement("canvas");
  const landCtx = landCanvas.getContext("2d");
  const slate = parseInt(palette.slate.trim().replace("#", ""), 16);

  // Two octaves: broad coastlines plus a rougher shoreline.
  const field = (x: number, y: number) => {
    const u = (x / UNIT) * 1.5;
    const v = (y / UNIT) * 1.5;
    return noise(u, v) * 0.72 + noise(u * 2.3 + 17, v * 2.3 - 9) * 0.28;
  };

  /** Samples the field on the world-aligned lattice covering the region. */
  const sample = (ox: number, oy: number, size: number): Grid => {
    const x0 = Math.floor(ox / CELL) * CELL;
    const y0 = Math.floor(oy / CELL) * CELL;
    const cols = Math.ceil((ox + size - x0) / CELL) + 1;
    const rows = Math.ceil((oy + size - y0) / CELL) + 1;
    const values = new Float32Array((cols + 1) * (rows + 1));
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) values[j * (cols + 1) + i] = field(x0 + i * CELL, y0 + j * CELL);
    }
    return { values, cols, rows, x0, y0 };
  };

  const drawLand = (ctx: CanvasRenderingContext2D, g: Grid) => {
    if (!landCtx) return;
    // Rasterise at lattice resolution, then let the browser smooth it up.
    landCanvas.width = g.cols + 1;
    landCanvas.height = g.rows + 1;
    const img = landCtx.createImageData(g.cols + 1, g.rows + 1);
    for (let i = 0; i < g.values.length; i++) {
      img.data[i * 4] = (slate >> 16) & 255;
      img.data[i * 4 + 1] = (slate >> 8) & 255;
      img.data[i * 4 + 2] = slate & 255;
      img.data[i * 4 + 3] = smoothstep(LAND - 0.02, LAND + 0.06, g.values[i]) * 255;
    }
    landCtx.putImageData(img, 0, 0);
    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // Pixel i covers lattice point i, so centre it on the point.
    ctx.drawImage(landCanvas, g.x0 - CELL / 2, g.y0 - CELL / 2, (g.cols + 1) * CELL, (g.rows + 1) * CELL);
    ctx.restore();
  };

  /** Marching squares: strokes the isoline at `level` as one path. */
  const traceContour = (ctx: CanvasRenderingContext2D, g: Grid, level: number) => {
    const { values, cols, rows, x0: gx, y0: gy } = g;
    const at = (i: number, j: number) => values[j * (cols + 1) + i];
    const lerp = (a: number, b: number) => (level - a) / (b - a);

    ctx.beginPath();
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = at(i, j);
        const b = at(i + 1, j);
        const c = at(i + 1, j + 1);
        const d = at(i, j + 1);
        const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;

        const x0 = gx + i * CELL;
        const y0 = gy + j * CELL;
        const top: [number, number] = [x0 + CELL * lerp(a, b), y0];
        const right: [number, number] = [x0 + CELL, y0 + CELL * lerp(b, c)];
        const bottom: [number, number] = [x0 + CELL * lerp(d, c), y0 + CELL];
        const left: [number, number] = [x0, y0 + CELL * lerp(a, d)];

        const seg = (p: [number, number], q: [number, number]) => {
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        };

        switch (idx) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(top, left); break;
          case 5: seg(top, right); seg(left, bottom); break;
          case 10: seg(top, left); seg(bottom, right); break;
        }
      }
    }
    ctx.stroke();
  };

  const drawGraticule = (ctx: CanvasRenderingContext2D, ox: number, oy: number, size: number) => {
    const step = UNIT / 5;
    ctx.strokeStyle = rgba(palette.limestone, 0.07);
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    for (let x = Math.floor(ox / step) * step + step / 2; x < ox + size; x += step) {
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy + size);
    }
    for (let y = Math.floor(oy / step) * step + step / 2; y < oy + size; y += step) {
      ctx.moveTo(ox, y);
      ctx.lineTo(ox + size, y);
    }
    ctx.stroke();
  };

  const drawRhumbs = (ctx: CanvasRenderingContext2D, anchor: ChartAnchor) => {
    const { x: cx, y: cy } = anchor;
    const reach = 40000; // long enough to cross the whole page
    const ringR = UNIT * 0.46;
    const ray = (x: number, y: number, angle: number) => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * reach, y + Math.sin(angle) * reach);
    };

    // Central rose: 32 winds in three weights — principal, half, quarter.
    const tiers: [number, string, number][] = [
      [8, rgba(palette.gold, 0.42), 0.9],
      [16, rgba(palette.goldDim, 0.32), 0.7],
      [32, rgba(palette.goldDim, 0.2), 0.6],
    ];
    tiers.forEach(([count, color, lw], tier) => {
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        if (tier > 0 && i % 2 === 0) continue; // already drawn by a heavier tier
        ray(cx, cy, (i / count) * Math.PI * 2);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.stroke();
    });

    // Secondary roses on the ring, each casting the eight principal winds.
    const satellites: [number, number][] = [];
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const sx = cx + Math.cos(a) * ringR;
      const sy = cy + Math.sin(a) * ringR;
      satellites.push([sx, sy]);
      for (let k = 0; k < 8; k++) ray(sx, sy, (k / 8) * Math.PI * 2);
    }
    ctx.strokeStyle = rgba(palette.goldDim, 0.12);
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.strokeStyle = rgba(palette.gold, 0.4);
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, ringR * 0.62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = rgba(palette.goldLight, 0.7);
    for (const [sx, sy] of satellites) {
      ctx.beginPath();
      ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawSoundings = (ctx: CanvasRenderingContext2D, ox: number, oy: number, size: number) => {
    // Jittered lattice, deep water only; each cell decides for itself.
    ctx.strokeStyle = rgba(palette.goldLight, 0.5);
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    const i0 = Math.floor(ox / SOUNDING_CELL);
    const j0 = Math.floor(oy / SOUNDING_CELL);
    const i1 = Math.ceil((ox + size) / SOUNDING_CELL);
    const j1 = Math.ceil((oy + size) / SOUNDING_CELL);
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        if (hash2(i, j, salt) > 0.3) continue;
        const x = (i + 0.15 + hash2(i, j, salt + 1) * 0.7) * SOUNDING_CELL;
        const y = (j + 0.15 + hash2(i, j, salt + 2) * 0.7) * SOUNDING_CELL;
        if (field(x, y) > DEPTHS[DEPTHS.length - 1]) continue;
        const s = 2.5 + hash2(i, j, salt + 3) * 1.5;
        ctx.moveTo(x - s, y);
        ctx.lineTo(x + s, y);
        ctx.moveTo(x, y - s);
        ctx.lineTo(x, y + s);
      }
    }
    ctx.stroke();
  };

  /**
   * Draws the square world region [ox, ox+size] × [oy, oy+size].
   * `ctx` must already map world px to canvas px (translate by -ox, -oy).
   */
  return function drawRegion(
    ctx: CanvasRenderingContext2D,
    ox: number,
    oy: number,
    size: number,
    anchor: ChartAnchor,
  ) {
    const grid = sample(ox, oy, size);
    drawLand(ctx, grid);

    // Isobaths fade and break up as the water deepens.
    DEPTHS.forEach((level, i) => {
      ctx.strokeStyle = rgba(palette.limestone, 0.3 - i * 0.06);
      ctx.lineWidth = 0.75;
      ctx.setLineDash(i >= 2 ? [2, 4] : []);
      traceContour(ctx, grid, level);
    });
    ctx.setLineDash([]);
    ctx.strokeStyle = rgba(palette.limestone, 0.55);
    ctx.lineWidth = 1;
    traceContour(ctx, grid, LAND);

    drawGraticule(ctx, ox, oy, size);
    drawRhumbs(ctx, anchor);
    drawSoundings(ctx, ox, oy, size);
  };
}
