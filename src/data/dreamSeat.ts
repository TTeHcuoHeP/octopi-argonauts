/** PGT Championship Dream Seat — a sponsored perk awarded to one Argonaut. */
export const dreamSeat = {
  logo: { src: "/images/pgt/pgt-championship.webp", width: 1200, height: 623 },
  /** Approved promotional wording from PokerGO. */
  pitch:
    "A Dream Seat to the 2027 PGT Championship, a $500,000 freeroll at the PokerGO Studio in Las Vegas in January 2028.",
  short: "a $500,000 freeroll in Las Vegas",
  facts: [
    { k: "When", v: "January 2028" },
    { k: "Where", v: "PokerGO Studio, ARIA Las Vegas" },
    { k: "Prize pool", v: "$500,000" },
    { k: "Starting stack", v: "100 big blinds" },
  ],
  body: "There is one seat, and only one member will win it. The winner takes an entry into the finale of the 2027 PokerGO Tour season — no buy-in, a share of the anticipated $500,000 prize pool on the line.",
  note: "Two days, exact dates to be announced. The field: the top 40 eligible players from the season-long PGT leaderboard and select Dream Seat winners. Prize pool made up of cash and PGT Passport funds; the Dream Seat starts with 100,000 chips.",
} as const;
