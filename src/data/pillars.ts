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
    body: "Weekly live lectures with the world's greatest tournament players, where they share how they think about the game, study and make decisions. Topics cover strategy, process, mindset and Q&A. Recordings are available to members.",
    icon: "/images/benefits/coaching.webp",
  },
  {
    numeral: "II",
    title: "Private Mentorship",
    body: "Direct access to Sam Greenwood for private hand-history reviews, strategic questions, and one-on-one growth guidance through private Discord and the Octopi Poker platform.",
    icon: "/images/benefits/mentorship.webp",
  },
  {
    numeral: "III",
    title: "Structured & Gamified Study",
    body: "Weekly study sessions with homework drills, quizzes, games and other challenges. Members can prepare and lead sessions themselves. Points are awarded all year on a leaderboard, with incredible prizes revealed to members later.",
    icon: "/images/benefits/improvement.webp",
  },
  {
    numeral: "IV",
    title: "Exclusive & Competitive Fellowship",
    body: "A small, committed community of ambitious players studying, competing, and improving together. Everyone works at their own pace and time; all materials are recorded and shared exclusively with the group.",
    icon: "/images/benefits/fellowship.webp",
  },
];
