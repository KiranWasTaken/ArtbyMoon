import type { JournalCategoryInfo, JournalPost } from "../types";

/** Published journal entries. Empty until ArtbyMoon writes the first one. */
export const journalPosts: JournalPost[] = [];

/**
 * The journal's sections, from the brief. Titles are structural; the
 * descriptions are draft copy.
 */
export const journalCategories: JournalCategoryInfo[] = [
  {
    slug: "story",
    title: "Art stories",
    description: {
      text: "The ideas and moments behind individual pieces.",
      status: "draft",
    },
  },
  {
    slug: "process",
    title: "Process notes",
    description: {
      text: "How a painting comes together, from sketch to final layer.",
      status: "draft",
    },
  },
  {
    slug: "announcement",
    title: "Announcements",
    description: {
      text: "New work, availability and news from the studio.",
      status: "draft",
    },
  },
  {
    slug: "exhibition",
    title: "Exhibitions",
    description: {
      text: "Shows and events featuring the work.",
      status: "draft",
    },
  },
  {
    slug: "workshop",
    title: "Paint with Moon updates",
    description: {
      text: "New dates, recaps and notes from sessions.",
      status: "draft",
    },
  },
];
