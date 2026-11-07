import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface HandnoteProps {
  children: ReactNode;
  arrow?: "right" | "down" | false;
  className?: string;
}

const arrows = {
  right: {
    viewBox: "0 0 120 64",
    shaft: "M4 10 C 34 2, 78 8, 104 44",
    head: "M90 44 L105 46 L103 31",
  },
  down: {
    viewBox: "0 0 64 110",
    shaft: "M18 4 C 6 34, 14 70, 44 98",
    head: "M30 98 L45 99 L46 84",
  },
} as const;

/**
 * A pencilled margin note. Interim typeface — intended to become ArtbyMoon's own
 * digitised handwriting. Paths carry data-draw so GSAP can draw them in.
 */
export function Handnote({
  children,
  arrow = false,
  className,
}: HandnoteProps) {
  const a = arrow ? arrows[arrow] : null;
  return (
    <span
      className={cn(
        "inline-flex items-start gap-1 font-hand text-[1.65rem] leading-none text-ink-muted",
        className,
      )}
    >
      <span className="-rotate-3">{children}</span>
      {a && (
        <svg
          viewBox={a.viewBox}
          className={arrow === "right" ? "mt-3 h-auto w-16" : "h-auto w-8"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path data-draw d={a.shaft} />
          <path data-draw d={a.head} />
        </svg>
      )}
    </span>
  );
}
