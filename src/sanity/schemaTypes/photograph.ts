import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";
import { featuredField, imageField, orderField } from "./fields";

export const photograph = defineType({
  name: "photograph",
  title: "Photograph",
  type: "document",
  icon: ImagesIcon,
  fields: [
    imageField({
      name: "image",
      title: "Photograph",
      required: true,
      description:
        "Long side at least 3000 pixels. Please remove location data from photos taken at home.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional.",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Optional. Click “Generate” if the photograph has a title.",
      options: { source: "title", maxLength: 64 },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
      description: "Optional. Shown under the photograph.",
    }),
    defineField({
      name: "location",
      title: "Place",
      type: "string",
      description: "Optional, e.g. a city or a park. Never a home address.",
    }),
    defineField({
      name: "takenAt",
      title: "Date taken",
      type: "date",
      description: "Optional.",
      options: { dateFormat: "D MMMM YYYY" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Optional, e.g. “Behind the scenes”. Filters appear on the photography page once there are 6+ photographs in 2+ categories.",
    }),
    defineField({
      name: "gallery",
      title: "More frames",
      type: "array",
      description: "Optional: other shots from the same moment.",
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
          ],
        }),
      ],
    }),
    featuredField("the homepage photography section"),
    orderField,
  ],
  orderings: [
    {
      title: "Display order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Date taken, newest first",
      name: "taken",
      by: [{ field: "takenAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      featured: "featured",
      media: "image",
    },
    prepare: ({ title, category, featured, media }) => ({
      title: title || "Untitled photograph",
      subtitle: [category, featured ? "★ Featured" : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
