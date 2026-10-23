export type Coach = {
  id: string;
  name: string;
  alias?: string;
  role: string;
  /** Path under /public. Leave undefined until an authentic portrait is supplied. */
  image?: string;
  featured: boolean;
};

/**
 * Coaching team, in carousel order. Images are sculpted marble busts
 * (transparent WebP) under /public/images/coaches.
 */
export const coaches: Coach[] = [
  {
    id: "chidwick",
    name: "Stephen Chidwick",
    role: "Guest Coach",
    image: "/images/coaches/chidwick.webp",
    featured: true,
  },
  {
    id: "boivin",
    name: "Thomas Boivin",
    role: "Guest Coach",
    image: "/images/coaches/boivin.webp",
    featured: true,
  },
  {
    id: "greenwood",
    name: "Sam Greenwood",
    role: "Resident Coach & Personal Mentor",
    image: "/images/coaches/greenwood.webp",
    featured: true,
  },
  {
    id: "hellmuth",
    name: "Phil Hellmuth",
    role: "Guest Coach",
    image: "/images/coaches/hellmuth.webp",
    featured: true,
  },
];

/** Coach shown in the centre of the carousel on load. */
export const initialCoachId = "greenwood";

export const programLeadership = [
  {
    id: "greenwood-mentor",
    name: "Sam Greenwood",
    role: "Resident Coach & Personal Mentor",
    note: "Your direct line throughout the year — hand-history reviews, strategic questions, and personalised guidance.",
  },
  {
    id: "livschitz",
    name: "Victoria Livschitz",
    role: "Program Director",
    note: "Oversees the curriculum, the weekly rhythm, and the admissions process.",
  },
] as const;
