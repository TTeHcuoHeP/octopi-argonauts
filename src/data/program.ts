export const programInclusions = [
  { label: "50 weeks of structured learning", detail: "Throughout 2027" },
  { label: "Weekly two-hour live sessions", detail: "Thursdays, 9–11 AM Pacific Time*" },
  { label: "Lectures and Q&A with elite coaches", detail: "Recordings available" },
  { label: "Weekly drills, quizzes, and study assignments", detail: "Applied practice" },
  { label: "Personal mentorship with Sam Greenwood", detail: "Private Discord & Octopi" },
  { label: "Private member community", detail: "Limited to 40" },
  { label: "Annual personal database review", detail: "For online players" },
  { label: "Octopi Professional subscription", detail: "Included for the program" },
  {
    label: "50% discount on additional Octopi courses and paid content",
    detail: "During the program",
  },
] as const;

export const scheduleNote =
  "*Sessions are currently scheduled for Thursdays, 9–11 AM Pacific Time. Session recordings are available to members.";

export const typicalSession = [
  {
    minutes: 30,
    title: "Theory & review",
    body: "Theory, homework review, or practical study led by the resident coach.",
  },
  {
    minutes: 90,
    title: "Guest coach lecture & Q&A",
    body: "A deep lecture from one of the program's elite coaches, followed by open questions.",
  },
] as const;
