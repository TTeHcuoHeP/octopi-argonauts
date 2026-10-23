# Argonauts 2027 — Landing Page

Premium, invitation-only membership landing page for **Argonauts 2027** by Octopi Poker.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger) · Lucide React · `next/font` · `next/image`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_APPLY_URL` once the application destination exists. Until then every **Apply to Join** button scrolls to the Membership section.

## Project structure

```
src/
  app/             layout (fonts, metadata, Open Graph), page, global styles
  styles/          tokens.css — design-system CSS variables (palette, lines)
  data/            editable content: site config, coaches, pillars, program, quest, faq
  components/
    layout/        Header (hide-on-scroll, mobile menu), Footer, ChartLens (site-wide map reveal)
    sections/      Hero (+ HeroSequence), Coaches (+ CoachCarousel), Experience, Quest (+ QuestJourney), Program, Forty,
                   Membership, Faq, FinalCta
    ui/            Button, SectionIntro, Accordion
    graphics/      CompassMark (brand mark), portolanChart (generative map)
  animations/      gsap.ts (plugin registration), useReveal.ts (scroll reveals)
  lib/             motion.ts (reduced-motion helpers), cn.ts
public/
  sequence/        compass/{1280,1920}/frame_001–047.webp — hero frame sequence
  video/           argonauts_short.mp4 (sequence source)
  images/          hero-sequence-poster.jpg (rest frame), og-image.jpg
```

## Hero frame sequence

The compass turns with the cursor: horizontal pointer position over the hero scrubs 47 frames (eased; settles back to the rest frame when the pointer leaves). Config lives in `sections/hero/sequence.ts`. Frames load after the page `load` event, mouse/trackpad only; touch devices and `prefers-reduced-motion` show the still poster. To regenerate from a new clip:

```bash
ffmpeg -i public/video/argonauts_short.mp4 -an -vf scale=1920:-2 -c:v libwebp -quality 74 public/sequence/compass/1920/frame_%03d.webp
ffmpeg -i public/video/argonauts_short.mp4 -an -vf scale=1280:-2 -c:v libwebp -quality 72 public/sequence/compass/1280/frame_%03d.webp
ffmpeg -i public/video/argonauts_short.mp4 -an -vf "select='eq(n\,23)'" -frames:v 1 -q:v 3 public/images/hero-sequence-poster.jpg
```

Update `count`, `restFrame` and `compass` in `sequence.ts` if the clip changes.

## Design system

Palette lives in `src/styles/tokens.css` and is exposed to Tailwind via `@theme` in `globals.css`:
`ocean` `slate` `gold` `limestone` `stone` `charcoal` plus derived `ocean-deep`, `ocean-soft`, `gold-light`, `gold-dim`, `limestone-soft`.

Typography: Cormorant Garamond (display), Cinzel (monumental wordmark / headline — `.monument`), Manrope (body/UI).

## Pending assets & decisions

- **Coach line-up** — four coaches for now (`src/data/coaches.ts`); Dan Cates and Jeremy Ausmus were removed until their busts exist. To add a coach: transparent bust WebP in `public/images/coaches/{id}.webp` (from a PNG: `ffmpeg -i bust.png -vf scale=1000:-2 -c:v libwebp -pix_fmt yuva420p -quality 84 out.webp`) plus an entry in `coaches`.
- **Application URL** — `NEXT_PUBLIC_APPLY_URL`.
- **Legal links** — footer placeholders in `src/data/site.ts`.
- **Point mechanics** — no numerical values are stated; FAQ items flagged `pending` carry an editorial placeholder.

## Cursor map-reveal (site-wide)

`layout/ChartLens.tsx` uncovers one continuous generative portolan chart (`graphics/portolanChart.ts`) under the whole page through a lens that trails the pointer. Layering: the lens is a fixed layer at `z-index: 1`, above section backgrounds and decorative art; `.site-container` sits at `z-index: 2`, so all text and UI stay on top. Keep new content inside `.site-container` (or give it `z-index` ≥ 2) and avoid `isolate` / transforms on section elements, or the map will cover them. The chart lives in page coordinates and only the region under the lens is drawn. It is seeded (`CHART_SEED`), rhumb lines radiate from the hero compass, colours come from `tokens.css`. Mouse/trackpad only: touch devices and `prefers-reduced-motion` render nothing.

## The Experience columns

`sections/Experience.tsx` shows a night scene of four columns (`public/images/experience/`, WebP versions of `public/section Experience/`). Hovering, focusing or tapping a column cross-fades its lit frame over `start.webp` and reveals its numeral, title and description; leaving the scene returns to the unlit frame. Column positions (normalised to the 1672 × 941 frame) and copy live in `src/data/pillars.ts`. Below `lg` the four commitments also appear as a list that lights the same columns.

## The Quest journey

`sections/quest/QuestJourney.tsx` is a pinned, scroll-scrubbed camera over `public/images/quest/quest-map.webp` (3840 px web version of `public/section 3 map/map_section4.jpg`, 5504 × 3072; regenerate with `ffmpeg -i "public/section 3 map/map_section4.jpg" -vf scale=3840:-2 -c:v libwebp -quality 84 public/images/quest/quest-map.webp` and update `questMap` width/height). Route, markers and label offsets are drawn in a fixed 1672 × 941 `questChart` space stretched over the image, so a new render of the same composition needs no coordinate changes. One GSAP timeline: contained map (70% width) → full bleed → 150% zoom on the first island → the gold route draws island to island, pausing at five checkpoints with HUD panels → the Golden Fleece, then the section unpins. Chapter text, map coordinates (normalised 0–1) and open-water route waypoints live in `src/data/quest.ts`; route positions are measured from the drawn path. Per-breakpoint zoom, focus and scroll length are in `CONFIGS` at the top of the component. Phones dock the HUD to the bottom of the screen; reduced motion shows the static chart with the chapters as text.

## Accessibility & motion

All animations respect `prefers-reduced-motion`; content renders visible without JS. The FAQ accordion uses native buttons with `aria-expanded` / labelled regions. Skip-link, semantic landmarks and a single `h1` are in place.
