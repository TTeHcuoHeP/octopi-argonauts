export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** True when the answer contains an editorial placeholder awaiting confirmation. */
  pending?: boolean;
};

const PENDING =
  "Full details will be confirmed by the Argonauts admissions team before applications open.";

export const faq: FaqItem[] = [
  {
    id: "who",
    question: "Who is the Argonauts program designed for?",
    answer:
      "Argonauts is designed for serious, ambitious tournament poker players who want a full year of structured study alongside elite coaches, a personal mentor, and a small committed fellowship. It suits players who are prepared to invest time every week and want their improvement to be deliberate rather than incidental.",
  },
  {
    id: "pro",
    question: "Do I need to be a professional poker player?",
    answer: `Admission is by invitation following an application process, and the group is limited to 40 members. The program is built for committed players of a high standard; professional status is not the sole criterion. ${PENDING}`,
    pending: true,
  },
  {
    id: "time",
    question: "How much time should I commit each week?",
    answer:
      "The core commitment is one two-hour live session each week — currently scheduled for Thursdays, 9–11 AM Pacific Time — across 50 weeks of 2027. Beyond that, members work through weekly drills, quizzes, and study assignments, and engage with their mentor and the community between sessions.",
  },
  {
    id: "missed",
    question: "What happens if I cannot attend a live session?",
    answer:
      "Session recordings are available to members, so you can study the lecture and Q&A in your own time. Live attendance is encouraged — participation in weekly study sessions is one of the ways members earn points on the year-long quest.",
  },
  {
    id: "mentorship",
    question: "How does personal mentorship work?",
    answer:
      "Every member has direct access to Sam Greenwood, the program's Resident Coach and Personal Mentor, for hand-history reviews, strategic questions, and personalized guidance. Mentorship takes place through private Discord and Octopi.",
  },
  {
    id: "points",
    question: "How are points and rewards earned?",
    answer: `Members earn points through participation in weekly study sessions, drills and quizzes, questions to coaches, challenges, competitions and duels, tournament performance, and contributions to the member community. The highest-scoring participant becomes Champion and receives the Golden Fleece Trophy; members who complete the program receive commemorative rewards including a custom signed deck and the Golden Ram ring. The precise point mechanics are being finalised. ${PENDING}`,
    pending: true,
  },
  {
    id: "included",
    question: "What is included in the membership?",
    answer:
      "Fifty weeks of structured learning; weekly two-hour live sessions with lectures and Q&A from elite coaches; weekly drills, quizzes, and study assignments; personal mentorship with Sam Greenwood; a private member community; an annual personal database review for online players; an Octopi Professional subscription; and a 50% discount on additional Octopi courses and paid content during the program.",
  },
  {
    id: "apply",
    question: "How does the application process work?",
    answer: `Applications are open from November 1 to December 31, 2026. Admission is by invitation only following a review of your application, and admissions may be organised in waves of approximately 10 places. ${PENDING}`,
    pending: true,
  },
  {
    id: "installments",
    question: "Can I pay in installments?",
    answer:
      "Yes. The annual membership of $25,000 is paid as $7,000 upon acceptance, followed by three quarterly installments of $6,000.",
  },
];
