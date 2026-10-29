export type Pillar = {
  numeral: string;
  title: string;
  body: string;
  /** Gold emblem for the benefits cards (transparent WebP). */
  icon: string;
};

export const pillars: Pillar[] = [
  {
    numeral: "I",
    title: "Elite Coaching",
    body: "Weekly live lectures and Q&A with some of the world's greatest tournament poker players. Recordings are available to members.",
    icon: "/images/benefits/coaching.webp",
  },
  {
    numeral: "II",
    title: "Personal Mentorship",
    body: "Direct access to Sam Greenwood for hand-history reviews, strategic questions, and personalized guidance through private Discord and Octopi.",
    icon: "/images/benefits/mentorship.webp",
  },
  {
    numeral: "III",
    title: "Structured Improvement",
    body: "Weekly study sessions, drills, quizzes, challenges, and practical application of newly learned concepts.",
    icon: "/images/benefits/improvement.webp",
  },
  {
    numeral: "IV",
    title: "An Exclusive Fellowship",
    body: "A small, committed community of ambitious players studying, competing, and improving together.",
    icon: "/images/benefits/fellowship.webp",
  },
];
