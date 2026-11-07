import { journalCategories } from "@/content/artist/journal";
import type { JournalPost } from "@/content/types";
import { source } from "./source";

/** Journal data access: newest first, published (and due) posts only. */
export async function getJournalPosts(): Promise<JournalPost[]> {
  const posts = await (await source()).journalPosts();
  return posts.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getJournalPost(
  slug: string,
): Promise<JournalPost | null> {
  return (await source()).journalPost(slug);
}

export { journalCategories };
