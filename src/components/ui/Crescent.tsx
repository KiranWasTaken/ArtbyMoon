import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Crescent in a 100×100 box: outer circle (50,50) r42 minus inner circle
 * (62,40) r40; the two arcs meet at their intersection points.
 */
const CRESCENT = "M34.5 11 A42 42 0 1 0 85.6 72.3 A40 40 0 0 1 34.5 11 Z";

/**
 * ArtbyMoon's own mark: the moon from @art.by.moon_. `filled` for a small solid
 * glyph (the hero's i-tittle, the favicon); `line` for a pencil drawing whose
 * path carries data-draw so reveals can draw it in.
 */
export function Crescent({
  variant = "filled",
  className,
  ...props
}: SVGProps<SVGSVGElement> & { variant?: "filled" | "line" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      {...props}
      className={cn("overflow-visible", className)}
    >
      {variant === "filled" ? (
        <path d={CRESCENT} fill="currentColor" />
      ) : (
        <path
          data-draw
          d={CRESCENT}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
