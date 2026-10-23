import { cn } from "@/lib/cn";

type Props = { className?: string; title?: string };

/**
 * Fine-line compass rose used as the Argonauts brand mark.
 * Monoline SVG, inherits `currentColor` so it can sit in gold or limestone.
 */
export function CompassMark({ className, title = "Argonauts" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label={title}
    >
      <circle cx="32" cy="32" r="30" strokeOpacity="0.45" />
      <circle cx="32" cy="32" r="22" strokeOpacity="0.3" strokeDasharray="1.5 3" />
      <path d="M32 4v8M32 52v8M4 32h8M52 32h8" strokeOpacity="0.6" />
      <path d="M32 10 36.5 32 32 54 27.5 32Z" fill="currentColor" fillOpacity="0.9" stroke="none" />
      <path d="M10 32 32 27.5 54 32 32 36.5Z" fill="currentColor" fillOpacity="0.55" stroke="none" />
      <path d="M32 10 32 32 36.5 32Z" fill="#102235" fillOpacity="0.35" stroke="none" />
      <path d="M32 54 32 32 27.5 32Z" fill="#102235" fillOpacity="0.35" stroke="none" />
      <circle cx="32" cy="32" r="1.8" fill="#102235" stroke="none" />
    </svg>
  );
}
