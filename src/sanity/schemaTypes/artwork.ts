import { ImageIcon } from "@sanity/icons/Image";
import { defineArrayMember, defineField, defineType } from "sanity";
import { featuredField, imageField, orderField, seoFields } from "./fields";

const SUBJECTS = [
  { title: "Landscapes", value: "landscapes" },
  { title: "Portraits", value: "portraits" },
  { title: "Animals", value: "animals" },
  { title: "Flowers", value: "flowers" },
];

const AVAILABILITY = [
  { title: "Available", value: "available" },
  { title: "Sold", value: "sold" },
  { title: "Not for sale", value: "not-for-sale" },
  { title: "By commission only", value: "commission-only" },
];

export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  icon: ImageIcon,
  groups: [
    { name: "main", title: "Artwork", default: true },
    { name: "details", title: "Details" },
    { name: "words", title: "Words" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "main",
      description:
        "Optional. If a piece has no title, the website calls it by its collection (e.g. “Bookmark”).",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "main",
      description:
        "The end of this artwork's web address. Click “Generate”. Must be unique; changing it later breaks saved links.",
      options: {
        source: (doc) =>
          (doc.title as string) || `artwork-${String(doc._id).slice(-6)}`,
        maxLength: 64,
      },
      validation: (rule) =>
        rule.required().error("Click “Generate” to create the web address."),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
      group: "main",
      description: "Which collection this piece belongs to.",
      options: { disableNew: true },
      validation: (rule) => rule.required().error("Choose a collection."),
    }),
    imageField({
      name: "image",
      title: "Main photograph",
      group: "main",
      required: true,
      description:
        "The whole piece, straight on, cropped to its edges. At least 3000 pixels on the long side. See “Photographing your work”.",
    }),
    defineField({
      name: "gallery",
      title: "More photographs",
      type: "array",
      group: "main",
      description:
        "Optional: a close-up, the back of a bookmark, the piece on a wall for scale…",
      of: [
        defineArrayMember({
          type: "image",
          options: { metadata: ["lqip", "palette"] },
          fields: [
            defineField({
              name: "alt",
              title: "Describe the picture",
              type: "string",
              validation: (rule) =>
                rule.required().error("Please describe the picture."),
            }),
            defineField({
              name: "caption",
              title: "Short label",
              type: "string",
              description: "e.g. “Detail”, “Back”",
            }),
          ],
        }),
      ],
    }),
    featuredField("the homepage (in the section for its collection)"),
    orderField,

    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      group: "details",
      description: "e.g. “Acrylic on canvas”.",
    }),
    defineField({
      name: "dimensions",
      title: "Size",
      type: "object",
      group: "details",
      options: { columns: 4 },
      fields: [
        defineField({
          name: "width",
          title: "Width",
          type: "number",
          validation: (r) => r.positive(),
        }),
        defineField({
          name: "height",
          title: "Height",
          type: "number",
          validation: (r) => r.positive(),
        }),
        defineField({
          name: "depth",
          title: "Depth",
          type: "number",
          description: "Optional",
          validation: (r) => r.positive(),
        }),
        defineField({
          name: "unit",
          title: "Unit",
          type: "string",
          options: {
            list: ["cm", "in"],
            layout: "radio",
            direction: "horizontal",
          },
          initialValue: "cm",
        }),
      ],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "details",
      validation: (rule) =>
        rule
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "subjects",
      title: "Subjects",
      type: "array",
      group: "details",
      description:
        "Optional. Lets visitors filter a collection (mainly canvas paintings).",
      of: [defineArrayMember({ type: "string" })],
      options: { list: SUBJECTS, layout: "grid" },
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "array",
      group: "details",
      description: "Optional, e.g. “Autumn Love”. Type a name and press Enter.",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      group: "details",
      description:
        "Optional. Leave empty and the website says nothing about sale.",
      options: { list: AVAILABILITY, layout: "radio" },
    }),

    defineField({
      name: "caption",
      title: "Handwritten caption (polaroids)",
      type: "string",
      group: "words",
      description:
        "Only for polaroids: the words you wrote on it, exactly as written.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "words",
      description: "A factual sentence or two about the piece.",
    }),
    defineField({
      name: "note",
      title: "Your note",
      type: "text",
      rows: 4,
      group: "words",
      description:
        "Optional. The story behind the piece, in your own words. Shown as “From ArtbyMoon”.",
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: "Display order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      collection: "collection.name",
      featured: "featured",
      media: "image",
    },
    prepare: ({ title, collection, featured, media }) => ({
      title: title || "Untitled piece",
      subtitle: [collection, featured ? "★ Featured" : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
