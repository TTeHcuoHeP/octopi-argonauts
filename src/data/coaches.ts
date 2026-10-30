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

const ausmus: Profile = {
  name: "Jeremy Ausmus",
  role: "Guest Coach",
  image: "/images/coaches/cards/ausmus.webp",
  achievements: [
    "Multiple World Series of Poker bracelet winner",
    "A mainstay of high-stakes tournaments for over a decade",
    "Known for precise, composed decision-making under pressure",
  ],
};

const chidwick: Profile = {
  name: "Stephen Chidwick",
  role: "Guest Coach",
  image: "/images/coaches/cards/chidwick.webp",
  achievements: [
    "One of the most accomplished high-roller players of his generation",
    "Renowned for disciplined, theory-grounded play",
    "Respected across the game for his mastery of every format",
  ],
};

const leonard: Profile = {
  name: "Patrick Leonard",
  role: "Guest Coach",
  image: "/images/coaches/cards/leonard.webp",
  achievements: [
    "Long counted among the world’s best online tournament players",
    "Celebrated for sharp insight and constant adaptation",
    "A thoughtful voice on how the modern game is evolving",
  ],
};

const hellmuth: Profile = {
  name: "Phil Hellmuth",
  role: "Guest Coach",
  image: "/images/coaches/cards/hellmuth.webp",
  achievements: [
    "Record holder for the most World Series of Poker bracelets",
    "A defining figure of tournament poker across generations",
    "Famed for reading opponents and patient, disciplined play",
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
 * spread), the guests fan out to either side — the first half on the left
 * (outer → inner), the rest on the right (inner → outer). An odd guest count
 * puts the extra card on the left.
 */
export const coaches: Coach[] = [
  { id: "greenwood", ...greenwood },
  { id: "livschitz", ...livschitz },
  { id: "hellmuth", ...hellmuth },
  { id: "leonard", ...leonard },
  { id: "cates", ...cates },
  { id: "chidwick", ...chidwick },
  { id: "boivin", ...boivin },
  { id: "ausmus", ...ausmus },
  { id: "lichtenberger", ...lichtenberger },
];

/** How many head coaches lead the spread. */
export const leadCoachCount = 2;
