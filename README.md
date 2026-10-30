# The Argonauts — Landing Page

Premium, invitation-only membership landing page for **The Argonauts** by Octopi Poker.

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
    sections/      Hero (+ HeroSequence), Coaches (+ CoachCards), Mentor (Victoria Livschitz ⇄ Sam Greenwood switcher), Quest (+ QuestJourney), Program, Forty,
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

- **Coach cards** — playing cards in `src/data/coaches.ts`: the first two are the head coaches, the rest are guests. On desktop all cards form one hand arching across the stage, each further card tilting more and dropping lower; the two head coaches are its outermost cards, only a little larger than the guests; everything is dealt from the centre on scroll. Below 1024px the heads sit side by side and the guests become a swipeable row. The spread sizes itself to the card count, so adding a card is just a new entry. Hover lifts a fanned card and straightens it; hover, keyboard focus or a tap turns a card over: the octopus back slowly darkens and the coach’s achievements rise in. To add or replace a card: face WebP in `public/images/coaches/cards/{id}.webp` (from a PNG: `ffmpeg -i card.png -vf scale=720:-2 -c:v libwebp -pix_fmt yuva420p -quality 84 out.webp`) plus a profile with `achievements` in `coaches`.
- **Application URL** — `NEXT_PUBLIC_APPLY_URL`.
- **Legal links** — footer placeholders in `src/data/site.ts`.
- **Point mechanics** — no numerical values are stated; FAQ items flagged `pending` carry an editorial placeholder.

## Cursor map-reveal (site-wide)

`layout/ChartLens.tsx` uncovers one continuous generative portolan chart (`graphics/portolanChart.ts`) under the whole page through a lens that trails the pointer. Layering: the lens is a fixed layer at `z-index: 1`, above section backgrounds and decorative art; `.site-container` sits at `z-index: 2`, so all text and UI stay on top. Keep new content inside `.site-container` (or give it `z-index` ≥ 2) and avoid `isolate` / transforms on section elements, or the map will cover them. The chart lives in page coordinates and only the region under the lens is drawn. It is seeded (`CHART_SEED`), rhumb lines radiate from the hero compass, colours come from `tokens.css`. Mouse/trackpad only: touch devices and `prefers-reduced-motion` render nothing.

## The Quest journey

`sections/quest/QuestJourney.tsx` shows `public/images/quest/quest-map.webp` (3840 px web version of `public/section 3 map/map_section4.jpg`, 5504 × 3072; regenerate with `ffmpeg -i "public/section 3 map/map_section4.jpg" -vf scale=3840:-2 -c:v libwebp -quality 84 public/images/quest/quest-map.webp` and update `questMap` width/height). Route, markers and label offsets are drawn in a fixed 1672 × 941 `questChart` space stretched over the image, so a new render of the same composition needs no coordinate changes. Scroll does one short pinned move: the chart starts almost open (`START_SCALE`, 97% of the open size) and settles in with a slight zoom until the whole route fits the screen, the title and a hover hint surface, and the gold route draws across all five islands. Then the pin releases and nothing else is scroll-driven: markers pulse, and hovering a marker, an island name or a chapter on the bottom rail (tap on touch, focus with the keyboard) opens that chapter’s panel beside its island. Chapter text, map coordinates (normalised 0–1) and open-water route waypoints live in `src/data/quest.ts`. Per-breakpoint vertical placement and scroll length are in `CONFIGS` at the top of the component. Phones dock the panel to the bottom of the screen; reduced motion shows the open chart at once, still explorable.

Below the map, `sections/quest/Rewards.tsx` sets "The rewards" (three across) above "How points are earned" (two columns) in one centred column on the plain ocean, with four prize cut-outs floating either side (`rewardPrizes` in `src/data/quest.ts`, trimmed 640px WebPs in `public/images/rewards/`): both cards hanging off the left edge of the page, the fleece trophy off the right with a smaller ring beside it. Each bobs gently (`prize-float` in globals.css) and drifts with scroll at its own depth (parallax); positions, depths and tilts are in `PLACES` at the top of the component. Phones tuck the prizes into the corners above and below the copy with a smaller drift; reduced motion keeps them still.

## Accessibility & motion

All animations respect `prefers-reduced-motion`; content renders visible without JS. The FAQ accordion uses native buttons with `aria-expanded` / labelled regions. Skip-link, semantic landmarks and a single `h1` are in place.
