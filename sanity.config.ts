"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, readSanityEnv } from "./src/sanity/env.mjs";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

/**
 * "use client": the Studio is a browser application; this file is passed
 * to <NextStudio> as a client reference (it would be empty on the server).
 *
 * Sanity Studio, embedded in the website at /studio (src/app/studio).
 * Project and dataset come from NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET.
 */
const { projectId, dataset } = readSanityEnv();

export default defineConfig({
  name: "artbymoon",
  title: "ArtbyMoon · Studio",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // "New artwork" from a collection list pre-selects that collection; no
    // "new" button for the single artist profile.
    templates: (templates) => [
      ...templates.filter((t) => !singletonTypes.has(t.schemaType)),
      {
        id: "artwork-in-collection",
        title: "Artwork in this collection",
        schemaType: "artwork",
        parameters: [{ name: "collectionId", type: "string" }],
        value: (params: { collectionId: string }) => ({
          collection: { _type: "reference", _ref: params.collectionId },
        }),
      },
    ],
  },
  document: {
    // The profile can be edited and published, never deleted or duplicated.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
  plugins: [
    structureTool({ title: "Content", structure }),
    // "Preview": shows the real website with unpublished changes (Draft Mode).
    presentationTool({
      title: "Preview",
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        locations: {
          artwork: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
              collection: "collection.slug.current",
            },
            resolve: (doc) =>
              doc?.slug && doc.collection
                ? {
                    locations: [
                      {
                        title: doc.title || "This artwork",
                        href: `/artworks/${doc.collection}/${doc.slug}`,
                      },
                      {
                        title: "Its collection",
                        href: `/artworks/${doc.collection}`,
                      },
                      { title: "Homepage", href: "/" },
                    ],
                  }
                : null,
          }),
          collection: defineLocations({
            select: { title: "name", slug: "slug.current" },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      {
                        title: doc.title || "Collection",
                        href: `/artworks/${doc.slug}`,
                      },
                    ],
                  }
                : null,
          }),
          photograph: defineLocations({
            message: "Photographs appear on the photography page.",
            resolve: () => ({
              locations: [{ title: "Photography", href: "/photography" }],
            }),
          }),
          artistProfile: defineLocations({
            select: { name: "name" },
            resolve: () => ({
              locations: [
                { title: "About", href: "/about" },
                { title: "Contact", href: "/contact" },
              ],
            }),
          }),
          workshop: defineLocations({
            select: { title: "title" },
            resolve: () => ({
              locations: [
                { title: "Workshops", href: "/workshops" },
                { title: "Homepage", href: "/" },
              ],
            }),
          }),
          journalPost: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      {
                        title: doc.title || "This post",
                        href: `/journal/${doc.slug}`,
                      },
                      { title: "Journal", href: "/journal" },
                    ],
                  }
                : null,
          }),
        },
      },
    }),
    // Query playground, for development only.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
