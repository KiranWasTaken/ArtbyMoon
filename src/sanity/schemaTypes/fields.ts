import { defineField } from "sanity";

/**
 * An image with required alt text. Hotspot is off on purpose for artwork:
 * the website never crops paintings, it always shows the whole piece.
 */
export function imageField({
  name,
  title,
  description,
  required = false,
  hotspot = false,
  group,
  extraFields = [],
}: {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
  hotspot?: boolean;
  group?: string;
  /** More fields stored with the image, e.g. a caption. */
  extraFields?: ReturnType<typeof defineField>[];
}) {
  return defineField({
    name,
    title,
    type: "image",
    group,
    description,
    options: { hotspot, metadata: ["lqip", "palette"] },
    fields: [
      defineField({
        name: "alt",
        title: "Describe the picture",
        type: "string",
        description:
          "One sentence saying what's in the picture, for people who can't see it, e.g. “A lavender field at dusk under a pink sky”. Required.",
        validation: (rule) =>
          rule.custom((alt, context) => {
            const parent = context.parent as { asset?: unknown } | undefined;
            if (parent?.asset && !alt?.trim())
              return "Please describe the picture before publishing.";
            return true;
          }),
      }),
      ...extraFields,
    ],
    validation: required
      ? (rule) => rule.required().error("Please add a photograph.")
      : undefined,
  });
}

/** Lower numbers come first. Shared by artworks, collections and photographs. */
export const orderField = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  description:
    "Optional. Lower numbers appear first (1, 2, 3…). Leave empty to show newest additions last.",
  validation: (rule) => rule.integer().min(0),
});

export const featuredField = (where: string) =>
  defineField({
    name: "featured",
    title: "Feature on the homepage",
    type: "boolean",
    description: `Switch on to show this in ${where}.`,
    initialValue: false,
  });

export const seoFields = [
  defineField({
    name: "seoTitle",
    title: "Search result title",
    type: "string",
    group: "seo",
    description:
      "Optional. Shown in Google and when shared. Leave empty to use the normal title.",
    validation: (rule) =>
      rule
        .max(70)
        .warning(
          "Search engines cut titles longer than about 60–70 characters.",
        ),
  }),
  defineField({
    name: "seoDescription",
    title: "Search result description",
    type: "text",
    rows: 3,
    group: "seo",
    description:
      "Optional. One or two sentences shown under the title in search results.",
    validation: (rule) =>
      rule.max(170).warning("Keep it under about 160 characters."),
  }),
];
