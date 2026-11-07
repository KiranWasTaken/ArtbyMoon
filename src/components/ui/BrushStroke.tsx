import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * A single loaded-brush underline in the accent pigment. Size it by width
 * only: the aspect ratio is fixed so DrawSVG can measure the path, and the
 * stroke thickens naturally with the underline's length.
 */
export function BrushStroke({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 600 40"
      fill="none"
      aria-hidden="true"
      {...props}
      className={cn("pointer-events-none h-auto text-accent", className)}
    >
      <path
        data-draw
        d="M6 27 C 110 14, 250 31, 372 19 S 548 12, 594 21"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
