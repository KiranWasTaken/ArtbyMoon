import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField } from "./fields";

/** A single document (one profile). The Studio opens it directly. */
export const artistProfile = defineType({
  name: "artistProfile",
  title: "Artist profile",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "about", title: "About you", default: true },
    { name: "practice", title: "Your practice" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "about",
      initialValue: "ArtbyMoon",
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      group: "about",
      description: "One or two sentences at the top of the About page.",
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "array",
      group: "about",
      description:
        "Your story, in your own words. Paragraphs, links and emphasis are kept.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Paragraph", value: "normal" }],
          lists: [],
        }),
      ],
    }),
    imageField({
      name: "portrait",
      title: "Portrait or studio photograph",
      group: "about",
      description: "Optional.",
      extraFields: [
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
          description: "Optional.",
        }),
      ],
    }),

    defineField({
      name: "practice",
      title: "Your practice",
      type: "text",
      rows: 4,
      group: "practice",
      description:
        "What you make and how. Shown under “The practice” on the About page.",
    }),
    defineField({
      name: "materials",
      title: "Materials and techniques",
      type: "array",
      group: "practice",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Type one and press Enter, e.g. “Acrylic on canvas”.",
    }),
    defineField({
      name: "inspirations",
      title: "Inspirations",
      type: "array",
      group: "practice",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "approach",
      title: "How you work, in your words",
      type: "text",
      rows: 4,
      group: "practice",
      description: "Optional. Shown as a quote.",
    }),

    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
      group: "contact",
      description:
        "Your Instagram profile link, e.g. https://www.instagram.com/art.by.moon_/. The Contact page's “Message” buttons open a direct message to this account. (The header and footer link is set in the website code.)",
      validation: (r) =>
        r
          .uri({ scheme: ["https"] })
          .custom(
            (v) =>
              !v ||
              /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]{1,30}\/?$/.test(
                v,
              ) ||
              "Use your profile link, e.g. https://www.instagram.com/your.name/",
          ),
    }),
    defineField({
      name: "contact",
      title: "Other contact details",
      type: "array",
      group: "contact",
      description:
        "Optional, only what you want public, e.g. an email address. Shown on the Contact page.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. “Email”",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "value",
              title: "Shown as",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "url",
              description: "Optional, e.g. mailto:you@example.com",
              validation: (r) => r.uri({ scheme: ["https", "mailto"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Artist profile" }) },
});
