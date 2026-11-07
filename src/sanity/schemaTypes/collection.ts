import { FolderIcon } from "@sanity/icons/Folder";
import { defineField, defineType } from "sanity";
import { featuredField, imageField, orderField } from "./fields";

export const COLLECTION_STYLES = [
  { title: "Gallery wall: mounted, like canvas paintings", value: "canvas" },
  { title: "Open and bold, without mounts (abstract)", value: "abstract" },
  { title: "Prints on notebook paper (polaroids)", value: "polaroids" },
  { title: "Taped into a sketchbook (sketches, cards)", value: "sketches" },
  { title: "Hanging from a line (bookmarks)", value: "bookmarks" },
];

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  icon: FolderIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "How the collection is called on the website, e.g. “Canvas paintings”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "The end of the web address: …/artworks/<this>. Click “Generate”. Changing it later breaks links people have saved.",
      options: { source: "name", maxLength: 48 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "singular",
      title: "One piece is called…",
      type: "string",
      description:
        "Used when a piece has no title, e.g. “Canvas painting”, “Bookmark”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "style",
      title: "Display style",
      type: "string",
      description:
        "How the works in this collection are laid out on the website.",
      options: { list: COLLECTION_STYLES, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      description:
        "A sentence or two shown at the top of the collection page, in your own words.",
    }),
    imageField({
      name: "cover",
      title: "Cover image",
      description:
        "Optional. If empty, the first artwork in the collection is used.",
    }),
    orderField,
    featuredField(
      "the homepage index first (featured collections are listed before the others)",
    ),
  ],
  orderings: [
    {
      title: "Display order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "style", media: "cover" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: COLLECTION_STYLES.find((s) => s.value === subtitle)?.title,
      media,
    }),
  },
});
