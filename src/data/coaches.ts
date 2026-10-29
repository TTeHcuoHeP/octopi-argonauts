export type Coach = {
  id: string;
  name: string;
  role: string;
  /** Card face (WebP, 720 × 1082, transparent rounded corners). */
  image: string;
  /** Read on the card's back after it turns over. Qualitative — no figures. */
  achievements: string[];
};

/** Shared card back (the Argonauts octopus). */
export const coachCardBack = "/images/coaches/cards/back.webp";
export const coachCardSize = { width: 720, height: 1082 } as const;

type Profile = Omit<Coach, "id">;

const lichtenberger: Profile = {
  name: "Andrew Lichtenberger",
  role: "Guest Coach",
  image: "/images/coaches/cards/lichtenberger.webp",
  achievements: [
    "A long-standing name at the highest stakes of tournament poker",
    "Celebrated for creative, aggressive lines grounded in theory",
    "A respected teacher of the modern game",
  ],
};

const cates: Profile = {
  name: "Daniel Cates",
  role: "Guest Coach",
  image: "/images/coaches/cards/cates.webp",
  achievements: [
    "One of the most feared heads-up players in online history",
    "World Series of Poker bracelet winner",
    "Fearless, unconventional strategy across every format",
  ],
};

const boivin: Profile = {
  name: "Thomas Boivin",
  role: "Guest Coach",
  image: "/images/coaches/cards/boivin.webp",
  achievements: [
    "A fixture of the international high-roller circuit",
    "Known for meticulous, solver-informed preparation",
    "Among France’s most accomplished tournament players",
  ],
};

const greenwood: Profile = {
  name: "Sam Greenwood",
  role: "Resident Coach & Personal Mentor",
  image: "/images/coaches/cards/greenwood.webp",
  achievements: [
    "Your direct line throughout the year",
    "Hand-history reviews and strategic questions",
    "Personalised guidance through private Discord and Octopi",
  ],
};

const livschitz: Profile = {
  name: "Victoria Livschitz",
  role: "Program Director",
  image: "/images/coaches/cards/livschitz.webp",
  achievements: [
    "Oversees the curriculum",
    "Sets the weekly rhythm of study",
    "Leads the admissions process",
  ],
};

/**
 * Coaching line-up as cards: the first two are the head coaches (centre of the
 * spread), the other six fan out three to each side. The guest faces repeat
 * for now until the remaining cards arrive — replace an entry's profile (and
 * its achievements) as each one lands.
 */
export const coaches: Coach[] = [
  { id: "greenwood", ...greenwood },
  { id: "livschitz", ...livschitz },
  { id: "lichtenberger", ...lichtenberger },
  { id: "boivin", ...boivin },
  { id: "cates", ...cates },
  { id: "boivin-2", ...boivin },
  { id: "cates-2", ...cates },
  { id: "lichtenberger-2", ...lichtenberger },
];

/** How many head coaches lead the spread. */
export const leadCoachCount = 2;
