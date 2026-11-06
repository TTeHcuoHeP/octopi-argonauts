import { QuestJourney } from "./quest/QuestJourney";

/** The Quest: the whole voyage toward the Golden Fleece on one static chart. */
export function Quest() {
  return (
    <section id="quest" aria-labelledby="quest-title" className="relative bg-ocean">
      <QuestJourney />
    </section>
  );
}
