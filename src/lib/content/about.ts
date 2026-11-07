import type { AboutContent } from "@/content/types";
import { source } from "./source";

/** Artist profile for /about (and anything else that needs her words). */
export async function getAbout(): Promise<AboutContent> {
  return (await source()).about();
}
