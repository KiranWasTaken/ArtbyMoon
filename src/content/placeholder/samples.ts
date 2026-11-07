import type { JournalPost, Workshop } from "../types";

/**
 * COMPONENT FIXTURES, NOT CONTENT. Used only on /design-system (noindex) to
 * preview the "published" states of the workshop and journal components.
 * Never import these into public pages. The far-future year and "Example…"
 * titles make them unmistakable.
 */
export const sampleWorkshops: Workshop[] = [
  {
    slug: "sample-open",
    status: "open",
    title: "Example workshop title",
    startsAt: "2099-03-14T10:00:00-04:00",
    timeZone: "America/Toronto",
    durationMinutes: 150,
    location: "Example venue",
    priceLabel: "Example price",
    seats: 8,
    bookingUrl: "https://example.com/booking",
  },
  {
    slug: "sample-full",
    status: "full",
    title: "Second example workshop",
    startsAt: "2099-04-11T14:00:00-04:00",
    timeZone: "America/Toronto",
  },
];

export const sampleJournalPosts: JournalPost[] = [
  {
    slug: "sample-1",
    title: "Example journal entry title",
    category: "process",
    publishedAt: "2099-02-01",
    excerpt:
      "Example excerpt. A sentence or two introducing the entry appears here.",
  },
  {
    slug: "sample-2",
    title: "Second example entry",
    category: "announcement",
    publishedAt: "2099-01-18",
  },
  {
    slug: "sample-3",
    title: "Third example entry",
    category: "workshop",
    publishedAt: "2099-01-04",
  },
];
