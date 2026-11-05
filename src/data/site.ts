/**
 * Site-wide configuration.
 * The application destination has not been supplied — set NEXT_PUBLIC_APPLY_URL
 * in your environment. Until then, the CTA scrolls to the Membership section.
 */
export const APPLY_URL =
  process.env.NEXT_PUBLIC_APPLY_URL && process.env.NEXT_PUBLIC_APPLY_URL.length > 0
    ? process.env.NEXT_PUBLIC_APPLY_URL
    : "#membership";

export const APPLY_IS_EXTERNAL = APPLY_URL.startsWith("http");

export const site = {
  name: "The Argonauts",
  tagline: "The Ultimate Tournament Poker Masterclass",
  description:
    "An invitation-only, year-long tournament poker membership by Octopi Poker. World-class coaching, personal mentorship, and a small fellowship of players pursuing excellence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://argonauts.octopipoker.ai",
  supporter: "Octopi Poker",
  membership: {
    price: 25000,
    /** Pay-as-you-go alternative to the full price, per quarter of 2027. */
    quarterly: 7000,
    quarters: 4,
    weeks: 50,
    applicationWindow: "November 1 – December 31, 2026",
    applicationOpens: "November 1, 2026",
    applicationCloses: "December 31, 2026",
    waveSize: "approximately 10 places",
  },
  schedule: {
    day: "Thursdays",
    time: "9–11 AM Pacific Time",
    durationHours: 2,
  },
} as const;

export const navLinks = [
  { label: "The Program", href: "#program" },
  { label: "Coaches", href: "#coaches" },
  { label: "The Experience", href: "#benefits" },
  { label: "The Quest", href: "#quest" },
  { label: "Membership", href: "#membership" },
  { label: "FAQ", href: "#faq" },
] as const;

export const footerLegalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Membership", href: "#" },
] as const;
