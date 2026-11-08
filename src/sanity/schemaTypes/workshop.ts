import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineField, defineType } from "sanity";
import { imageField } from "./fields";

const STATUSES = [
  { title: "To be announced (date not fixed yet)", value: "to-be-announced" },
  { title: "Booking open", value: "open" },
  { title: "Waitlist", value: "waitlist" },
  { title: "Fully booked", value: "full" },
  { title: "Past (hide from upcoming)", value: "past" },
];

function isTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const workshop = defineType({
  name: "workshop",
  title: "Paint with Moon session",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "main", title: "Session", default: true },
    { name: "when", title: "When & where" },
    { name: "booking", title: "Booking" },
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
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required().error("Click “Generate”."),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "main",
      options: { list: STATUSES, layout: "radio" },
      initialValue: "to-be-announced",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "main",
    }),
    imageField({
      name: "cover",
      title: "Cover image",
      group: "main",
      description: "Optional.",
    }),

    defineField({
      name: "startsAt",
      title: "Date and start time",
      type: "datetime",
      group: "when",
    }),
    defineField({
      name: "timeZone",
      title: "Time zone",
      type: "string",
      group: "when",
      description:
        "Where the session happens, e.g. “Europe/London” or “Asia/Kathmandu”, so the time shows correctly.",
      validation: (r) =>
        r.custom(
          (v) =>
            !v ||
            isTimeZone(v) ||
            "Not a recognised time zone, e.g. Europe/London",
        ),
    }),
    defineField({
      name: "durationMinutes",
      title: "Duration (minutes)",
      type: "number",
      group: "when",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      group: "when",
      description: "Name and town, or “Online”.",
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "booking",
      description: "Optional. Leave empty if free or not decided.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "booking",
      description: "Three-letter code, e.g. GBP, EUR, USD, NPR.",
      validation: (r) =>
        r.custom((v, ctx) => {
          const price = (ctx.document as { price?: number } | undefined)?.price;
          if (typeof price === "number" && !v)
            return "Add a currency for the price.";
          return (
            !v ||
            /^[A-Z]{3}$/.test(v) ||
            "Use a three-letter code in capitals, e.g. GBP"
          );
        }),
    }),
    defineField({
      name: "priceNote",
      title: "Price note",
      type: "string",
      group: "booking",
      description: "Optional, e.g. “Materials included”.",
    }),
    defineField({
      name: "maxSeats",
      title: "Maximum seats",
      type: "number",
      group: "booking",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "registrationDeadline",
      title: "Book by",
      type: "datetime",
      group: "booking",
      description: "Optional.",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking link",
      type: "url",
      group: "booking",
      description:
        "Where people book (e.g. a Luma, Eventbrite or form page). Bookings happen there, not on this website.",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "bookingNote",
      title: "How to book (if there's no link)",
      type: "string",
      group: "booking",
      description: "e.g. “Message me on Instagram to reserve a seat”.",
    }),
  ],
  orderings: [
    {
      title: "Date",
      name: "date",
      by: [{ field: "startsAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      startsAt: "startsAt",
      status: "status",
      media: "cover",
    },
    prepare: ({ title, startsAt, status, media }) => ({
      title,
      subtitle: [
        startsAt
          ? new Date(startsAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "No date yet",
        STATUSES.find((s) => s.value === status)?.title,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
