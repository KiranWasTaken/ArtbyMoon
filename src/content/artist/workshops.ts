import type { Workshop } from "../types";

/**
 * Published workshops. Empty: no sessions have been announced, so the
 * homepage shows its "To be announced" state. Add entries only with details
 * ArtbyMoon has confirmed; leave unknown fields out rather than guessing.
 * Use `status: "past"` to retire a session (the homepage never compares
 * against today's date, so pages stay statically rendered).
 */
export const workshops: Workshop[] = [];
