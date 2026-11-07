import type { CSSProperties } from "react";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Typed escape hatch for CSS custom properties in `style`. */
export function cssVars(
  vars: Record<`--${string}`, string | number>,
): CSSProperties {
  return vars as CSSProperties;
}
