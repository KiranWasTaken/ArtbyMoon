/**
 * Motion tokens — mirrored in globals.css (--ease-*, --duration-*).
 * "Brush, not bounce": long, decelerating strokes; nothing elastic.
 */
export const easeCurves = {
  /** Fast start, long soft landing — reveals, entrances, hovers. */
  brush: "0.22,1,0.36,1",
  /** Symmetric — tone changes, wipes, things that travel across the screen. */
  ink: "0.65,0,0.35,1",
} as const;

/** Seconds, for GSAP. */
export const duration = {
  micro: 0.16,
  ui: 0.32,
  reveal: 1.1,
  intro: 1.4,
} as const;

export const stagger = {
  chars: 0.04,
  lines: 0.09,
  items: 0.12,
} as const;

export const media = {
  motionOk: "(prefers-reduced-motion: no-preference)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 64rem)",
  finePointer: "(hover: hover) and (pointer: fine)",
  /**
   * Where scroll-pinned sequences run: wide screen, motion allowed, and a
   * mouse or trackpad. Touch devices scroll natively (Lenis does not smooth
   * touch), and a transform pin driven by native touch scrolling judders, so
   * touch tablets at desktop width get the swipeable layout instead.
   * Mirrored by the `pinned:` variant in globals.css.
   */
  pinnable:
    "(min-width: 64rem) and (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
} as const;
