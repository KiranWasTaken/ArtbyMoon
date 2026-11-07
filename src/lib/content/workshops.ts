import type { Workshop } from "@/content/types";
import { source } from "./source";

/**
 * Workshop data access. Upcoming = anything not marked past, sorted by date
 * with undated sessions last. Never compares against today's date, so pages
 * stay statically rendered; retire a session with status "past".
 */
export async function getUpcomingWorkshops(): Promise<Workshop[]> {
  const workshops = await (await source()).workshops();
  return workshops
    .filter((w) => w.status !== "past")
    .toSorted((a, b) =>
      (a.startsAt ?? "9999").localeCompare(b.startsAt ?? "9999"),
    );
}
