import type { Photograph } from "@/content/types";
import { source } from "./source";

/** Photography data access; the active source supplies the photographs (./source.ts). */

/** Filtering only helps once there is enough to filter. */
const MIN_PHOTOS_FOR_FILTER = 6;
const MIN_PER_CATEGORY = 2;

export async function getPhotographs(): Promise<Photograph[]> {
  return (await source()).photographs();
}

/**
 * Categories worth offering as filters: at least two categories, each with
 * at least two photographs, among at least six photographs. Otherwise none.
 */
export function filterCategories(photos: Photograph[]): string[] {
  if (photos.length < MIN_PHOTOS_FOR_FILTER) return [];
  const counts = new Map<string, number>();
  for (const p of photos)
    if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const useful = [...counts]
    .filter(([, n]) => n >= MIN_PER_CATEGORY)
    .map(([c]) => c);
  return useful.length >= 2 ? useful : [];
}
