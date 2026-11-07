import type { Copy } from "../types";

const draft = (text: string): Copy => ({ text, status: "draft" });

/**
 * Copy for /photography, /about, /contact and /workshops. All DRAFT until
 * ArtbyMoon approves or rewrites it (visible with ?review).
 */
export const pagesCopy = {
  photography: {
    title: draft("A separate visual journal"),
    intro: draft(
      "Photographs and behind-the-scenes moments, shown in a darker, quieter room so the images carry the page.",
    ),
    emptyTitle: draft("The darkroom is quiet for now"),
    emptyText: draft(
      "Photographs are being selected for this journal. Until then, new pictures appear on Instagram first.",
    ),
    emptyNote: draft("prints drying"),
  },
  about: {
    title: draft("About ArtbyMoon"),
    practiceTitle: draft("The practice"),
    bioPending: draft(
      "A fuller introduction, in ArtbyMoon's own words, is on its way.",
    ),
    exploreTitle: draft("Find your way around"),
  },
  contact: {
    title: draft("Say hello"),
    intro: draft(
      "The best way to reach ArtbyMoon is a direct message on Instagram. Choose what your message is about for a few pointers, then send it from Instagram.",
    ),
    external: draft(
      "Messages are sent and answered on Instagram, not through this website.",
    ),
    starterHint: draft(
      "Copy a short message to paste into Instagram, then edit it as you like.",
    ),
  },
  enquiries: [
    {
      id: "artwork",
      title: "Artwork enquiries",
      description: draft(
        "Ask about a painting, polaroid or bookmark you've seen here or on Instagram.",
      ),
      tips: [
        draft("The artwork's name, or a screenshot"),
        draft("Where you're based, if you're asking about delivery"),
      ],
      starter: "Hello ArtbyMoon, I'd like to ask about one of your artworks: ",
    },
    {
      id: "commission",
      title: "Commissions & collaborations",
      description: draft(
        "Something made for you, or a project you'd like to work on together.",
      ),
      tips: [
        draft("What you have in mind, and roughly what size"),
        draft("Any date you're working towards"),
      ],
      starter:
        "Hello ArtbyMoon, I'd like to ask about a commission or collaboration: ",
    },
    {
      id: "workshop",
      title: "Workshop enquiries",
      description: draft(
        "Questions about upcoming sessions, or interest in a workshop for a group.",
      ),
      tips: [
        draft("Which workshop, or what kind of session you'd like"),
        draft("How many people, if it's for a group"),
      ],
      starter: "Hello ArtbyMoon, I have a question about workshops: ",
    },
    {
      id: "general",
      title: "General messages",
      description: draft(
        "Anything else: a kind word, a question, or just hello.",
      ),
      tips: [],
      starter: "Hello ArtbyMoon, ",
    },
  ],
  workshops: {
    title: draft("Art workshops"),
    intro: draft(
      "ArtbyMoon has hosted art workshops and will announce future sessions here, with a simple way to reserve a seat.",
    ),
    empty: draft(
      "No sessions are published right now. New dates will appear here first.",
    ),
  },
} as const;

export type EnquiryKind = (typeof pagesCopy.enquiries)[number]["id"];
