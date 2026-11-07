import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { draftClient, publishedClient } from "./client";

/** Cache tag per document type; the webhook revalidates these (src/sanity/revalidate.ts). */
export type ContentTag =
  | "artwork"
  | "collection"
  | "photograph"
  | "workshop"
  | "journal"
  | "profile"
  | `journal:${string}`;

/**
 * The single way the site reads Sanity. Results are cached by Next.js on the
 * server ('use cache'): visitors never trigger a Sanity request, the browser
 * never talks to Sanity, and pages stay static.
 *
 * - Freshness: the webhook calls revalidateTag() for the changed type. An
 *   hourly background revalidation is a safety net if a webhook is missed.
 * - Outages: a failed fetch throws instead of returning empty data. During a
 *   build that stops a broken deploy; at runtime the previously cached page
 *   keeps being served. Errors are logged with the query's tags.
 * - Draft Mode: Next.js re-runs cached functions per request without saving
 *   the result, so draft content never enters the public cache.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  previewParam = false,
}: {
  query: string;
  params?: Record<string, string | number | boolean>;
  tags: ContentTag[];
  /** Pass $preview (true in Draft Mode) to the query. */
  previewParam?: boolean;
}): Promise<T> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 31_536_000 });
  cacheTag(...tags);

  const { isEnabled: preview } = await draftMode();
  const client = preview && draftClient ? draftClient : publishedClient;
  if (!client)
    throw new Error(
      "Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID).",
    );

  try {
    return await client.fetch<T>(
      query,
      previewParam ? { ...params, preview: preview && !!draftClient } : params,
    );
  } catch (error) {
    console.error(
      `[sanity] query failed (tags: ${tags.join(", ")}${preview ? ", draft mode" : ""})`,
      error,
    );
    throw error;
  }
}
