/**
 * The year-long quest. Point mechanics are still being finalised —
 * no numerical rules or values are stated anywhere in this data.
 */
export const pointSources = [
  "Participation in weekly study sessions",
  "Drills and quizzes",
  "Questions to coaches",
  "Challenges, competitions, and duels",
  "Tournament performance",
  "Contributions to the member community",
] as const;

export const rewards = [
  {
    id: "trophy",
    title: "The Golden Fleece Trophy",
    body: "Awarded to the Champion — the highest-scoring participant of the year.",
  },
  {
    id: "deck",
    title: "A Custom Signed Deck",
    body: "A commemorative reward for members who complete the program.",
  },
  {
    id: "ring",
    title: "The Golden Ram Ring",
    body: "A lasting emblem of the journey, for those who see it through.",
  },
] as const;

/**
 * The illustrated map behind the Quest journey — 3840 px web version of
 * /public/section 3 map/map_section4.jpg (5504 × 3072). Its size sets the aspect.
 */
export const questMap = {
  src: "/images/quest/quest-map.webp",
  width: 3840,
  height: 2144,
} as const;

/**
 * Drawing space for the route, markers and label offsets. Independent of the
 * image resolution: it is stretched over the map, so a sharper image of the
 * same composition needs no coordinate changes.
 */
export const questChart = { width: 1672, height: 941 } as const;

/** Icons available to HUD tags (mapped to Lucide icons in the component). */
export type QuestIcon =
  | "members"
  | "invitation"
  | "lectures"
  | "qa"
  | "experts"
  | "drills"
  | "quizzes"
  | "challenges"
  | "community"
  | "deck"
  | "trophy"
  | "ring";

export type QuestCheckpoint = {
  id: string;
  /** Island name — shown over the island and on the chapter rail. */
  subtitle: string;
  /** Short line under the island name, before the chapter opens. */
  tagline: string;
  title: string;
  /** Optional overline above the title (used by the final chapter). */
  headline?: string;
  description: string[];
  /** Supporting labels with icons, drawn from the description. */
  tags?: { label: string; icon: QuestIcon }[];
  /** Position on the map image, normalised 0–1. */
  x: number;
  y: number;
  /** Height of the island label above the marker, in `questChart` units (clears the island). */
  labelOffset: number;
  /**
   * Fraction of the route length at this checkpoint. Leave undefined to have it
   * measured from the drawn path (the route always passes through every point).
   */
  routePosition?: number;
  /** Marks the destination — larger marker, longer pause. */
  final?: boolean;
};

/**
 * Storytelling chapters for the website — not five sequential course modules.
 * x / y are normalised 0–1 over the map (authored in the `questChart` 1672 × 941 space).
 */
export const questCheckpoints: QuestCheckpoint[] = [
  {
    id: "call",
    subtitle: "The Call",
    tagline: "Answer the call.",
    title: "The Call",
    description: [
      "Your journey begins with an exclusive fellowship of up to 40 ambitious poker enthusiasts.",
    ],
    tags: [
      { label: "Up to 40 members", icon: "members" },
      { label: "Invitation only", icon: "invitation" },
    ],
    x: 145 / 1672,
    y: 422 / 941,
    labelOffset: 78,
  },
  {
    id: "minds",
    subtitle: "Elite Minds",
    tagline: "Learn from the best.",
    title: "Learn from the Greatest Minds",
    description: [
      "Weekly lectures, open Q&A sessions, and direct access to world-class tournament poker experts.",
    ],
    tags: [
      { label: "Lectures", icon: "lectures" },
      { label: "Q&A", icon: "qa" },
      { label: "Expert access", icon: "experts" },
    ],
    x: 515 / 1672,
    y: 505 / 941,
    labelOffset: 132,
  },
  {
    id: "trials",
    subtitle: "The Trials",
    tagline: "Test your edge.",
    title: "The Trials",
    description: [
      "Develop your skills through drills, quizzes, challenges, and competitive study activities.",
      "Members can earn points through participation, study assignments, tournament results, and community contributions.",
    ],
    tags: [
      { label: "Drills", icon: "drills" },
      { label: "Quizzes", icon: "quizzes" },
      { label: "Challenges", icon: "challenges" },
    ],
    x: 1000 / 1672,
    y: 490 / 941,
    labelOffset: 92,
  },
  {
    id: "fellowship",
    subtitle: "The Fellowship",
    tagline: "Rise together.",
    title: "The Fellowship",
    description: [
      "Learn and compete alongside a private community of committed players.",
      "Earn progress toward collecting a custom deck of Argonauts playing cards.",
    ],
    tags: [
      { label: "Private community", icon: "community" },
      { label: "Custom card deck", icon: "deck" },
    ],
    x: 1345 / 1672,
    y: 515 / 941,
    labelOffset: 98,
  },
  {
    id: "fleece",
    subtitle: "The Golden Fleece",
    tagline: "A higher game awaits.",
    headline: "The Golden Fleece",
    title: "The ultimate prize awaits the Champion of the Argonauts.",
    description: [
      "The highest-scoring participant becomes Champion and receives the Golden Fleece Trophy.",
      "Members who complete the program also receive commemorative rewards, including a signed custom deck and Golden Ram ring.",
    ],
    tags: [
      { label: "Trophy", icon: "trophy" },
      { label: "Signed deck", icon: "deck" },
      { label: "Golden Ram ring", icon: "ring" },
    ],
    x: 1600 / 1672,
    y: 395 / 941,
    labelOffset: 86,
    final: true,
  },
];

/**
 * Open-water waypoints between consecutive checkpoints (`questChart` units). The route is a
 * smooth curve through checkpoint → waypoint → checkpoint …, which gives the
 * wave of an old sea chart and keeps the line in the water between islands.
 */
export const questRouteVia: [number, number][] = [
  [330, 520],
  [700, 445],
  [1180, 535],
  [1490, 470],
];
