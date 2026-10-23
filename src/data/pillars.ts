export type Pillar = {
  numeral: string;
  title: string;
  body: string;
  /** Column centre in the Experience scene, normalised 0–1 across the image. */
  x: number;
  /** Which side of its column the copy sits on (the last column has no room to its right). */
  side: "right" | "left";
  /** Lit version of the scene for this pillar. */
  image: string;
};

/** The Experience scene: five frames of one composition (1672 × 941). */
export const experienceScene = {
  start: "/images/experience/start.webp",
  width: 1672,
  height: 941,
  /** Top of the capitals and foot of the bases, normalised 0–1 down the image. */
  capitalTop: 336 / 941,
  base: 805 / 941,
} as const;

export const pillars: Pillar[] = [
  {
    numeral: "I",
    title: "Elite Coaching",
    body: "Weekly live lectures and Q&A with some of the world's greatest tournament poker players. Recordings are available to members.",
    x: 245 / 1672,
    side: "right",
    image: "/images/experience/pillar-1.webp",
  },
  {
    numeral: "II",
    title: "Personal Mentorship",
    body: "Direct access to Sam Greenwood for hand-history reviews, strategic questions, and personalized guidance through private Discord and Octopi.",
    x: 643 / 1672,
    side: "right",
    image: "/images/experience/pillar-2.webp",
  },
  {
    numeral: "III",
    title: "Structured Improvement",
    body: "Weekly study sessions, drills, quizzes, challenges, and practical application of newly learned concepts.",
    x: 1037 / 1672,
    side: "right",
    image: "/images/experience/pillar-3.webp",
  },
  {
    numeral: "IV",
    title: "An Exclusive Fellowship",
    body: "A small, committed community of ambitious players studying, competing, and improving together.",
    x: 1430 / 1672,
    side: "left",
    image: "/images/experience/pillar-4.webp",
  },
];
