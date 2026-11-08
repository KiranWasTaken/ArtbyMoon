import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, seoFields } from "./fields";

const CATEGORIES = [
  { title: "Art story", value: "story" },
  { title: "Process notes", value: "process" },
  { title: "Announcement", value: "announcement" },
  { title: "Exhibition", value: "exhibition" },
  { title: "Paint with Moon update", value: "workshop" },
];

export const journalPost = defineType({
  name: "journalPost",
  title: "Journal post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "main", title: "Post", default: true },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required().error("Click “Generate”."),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "main",
      description:
        "Set a future date to schedule the post: it appears on the website within an hour of that time.",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "string" })],
      options: { list: CATEGORIES, layout: "grid" },
      validation: (r) => r.min(1).error("Choose at least one category."),
    }),
    imageField({
      name: "cover",
      title: "Cover image",
      group: "main",
      description: "Optional.",
    }),
    defineField({
      name: "excerpt",
      title: "Short introduction",
      type: "text",
      rows: 3,
      group: "main",
      description: "One or two sentences shown in the list of posts.",
      validation: (r) => r.max(280),
    }),
    defineField({
      name: "body",
      title: "Post",
      type: "array",
      group: "main",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Small heading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
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
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", publishedAt: "publishedAt", media: "cover" },
    prepare: ({ title, publishedAt, media }) => ({
      title,
      subtitle: publishedAt
        ? new Date(publishedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date",
      media,
    }),
  },
});
