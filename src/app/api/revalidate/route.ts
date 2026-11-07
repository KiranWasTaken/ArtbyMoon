import { revalidatePath, revalidateTag } from "next/cache";
import { after, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { getPublishedRoutes } from "@/lib/content/routes";
import { publishedClient } from "@/sanity/client";
import {
  ALL_TAGS,
  planRevalidation,
  type RevalidationPlan,
  type WebhookPayload,
} from "@/sanity/revalidate";

/**
 * Sanity webhook → on-demand revalidation (docs/08-cms-guide.md).
 *
 * 1. Verifies the request signature with SANITY_REVALIDATE_SECRET (HMAC);
 *    anything unsigned or wrongly signed gets 401 and changes nothing.
 * 2. Waits for Sanity's eventual consistency, so the refetch sees the change.
 * 3. Expires only what the change affects, immediately (not stale-while-
 *    revalidate), on every server:
 *    - the changed type's data tags (revalidateTag, expire: 0), so the next
 *      render refetches them from Sanity; other types stay cached;
 *    - the pages that show it (revalidatePath), including the list of
 *      published URLs used by the proxy for 404s (/api/routes, which carries
 *      the artwork/collection/journal tags).
 *    Both take effect as this request completes, so once Sanity gets a 200
 *    the next visitor sees the change: a new artwork's URL works, a renamed
 *    or removed one is a 404.
 * 4. After answering, requests the affected pages once so they are rebuilt
 *    before visitors arrive.
 *
 * Outage safety: Sanity is checked first. If it can't be reached, the tags
 * are only marked stale (stale-while-revalidate) and pages are not expired,
 * so visitors keep the last good copy; the change appears once Sanity
 * answers again (next visit after recovery, or `pnpm revalidate`).
 *
 * Repeated deliveries are harmless: revalidating an already-stale tag is a
 * no-op. Errors are logged; responses never include internal details.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error(
      "[revalidate] SANITY_REVALIDATE_SECRET is not set; webhook ignored.",
    );
    return Response.json(
      { ok: false, message: "Revalidation is not configured." },
      { status: 500 },
    );
  }

  let parsed: Awaited<
    ReturnType<typeof parseBody<WebhookPayload & { _type?: string }>>
  >;
  try {
    parsed = await parseBody<WebhookPayload>(request, secret, true);
  } catch (error) {
    console.error("[revalidate] could not read webhook body", error);
    return Response.json(
      { ok: false, message: "Bad request." },
      { status: 400 },
    );
  }

  if (!parsed.isValidSignature) {
    console.warn("[revalidate] rejected a request with an invalid signature");
    return Response.json(
      { ok: false, message: "Invalid signature." },
      { status: 401 },
    );
  }
  const body = parsed.body;
  if (!body?._type)
    return Response.json(
      { ok: false, message: "Missing document type." },
      { status: 400 },
    );

  // Manual "refresh everything" (scripts/revalidate.mjs --all), signed the same way.
  const everything = body._type === "artbymoon.revalidateAll";
  const plan: RevalidationPlan | null = everything
    ? { tags: ALL_TAGS, paths: ["/"] }
    : planRevalidation(body);
  if (!plan) {
    return Response.json({
      ok: true,
      revalidated: [],
      message: `Nothing to refresh for ${body._type}.`,
    });
  }

  const tags = [...new Set(plan.tags)];
  if (!(await sanityReachable())) {
    for (const tag of tags) revalidateTag(tag, "max");
    console.error(
      `[revalidate] Sanity unreachable: ${tags.join(", ")} marked stale only; cached pages kept`,
    );
    return Response.json(
      { ok: true, revalidated: tags, mode: "stale-while-revalidate" },
      { status: 202 },
    );
  }
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  const paths = [...new Set(plan.paths)];
  // Concrete pages only: expiring a dynamic route pattern would also rebuild
  // its prerendered fallback shell at request time, which this app can't do.
  // The current (pre-change) list includes a renamed item's old address.
  const sections = everything ? ["artworks", "journal"] : (plan.sections ?? []);
  const existing = sections.length ? await getPublishedRoutes() : null;
  const pages = new Set(paths);
  if (existing && sections.includes("artworks")) {
    for (const c of existing.collections) pages.add(`/artworks/${c}`);
    for (const a of existing.artworks) pages.add(`/artworks/${a}`);
  }
  if (existing && sections.includes("journal"))
    for (const p of existing.journal) pages.add(`/journal/${p}`);
  if (everything)
    for (const p of [
      "/artworks",
      "/photography",
      "/workshops",
      "/journal",
      "/about",
      "/contact",
      "/sitemap.xml",
    ])
      pages.add(p);
  for (const page of pages) revalidatePath(page);
  console.info(
    `[revalidate] ${body._type}${body.slug ? ` "${body.slug}"` : ""}: ${tags.join(", ")}`,
  );

  const origin = request.nextUrl.origin;
  after(async () => {
    await Promise.allSettled(
      [...paths, "/api/routes"].map((path) =>
        fetch(new URL(path, origin), {
          signal: AbortSignal.timeout(10_000),
        }).then(
          (r) => r.body?.cancel(),
          (error) =>
            console.warn(`[revalidate] warm-up of ${path} failed`, error),
        ),
      ),
    );
  });

  return Response.json({ ok: true, revalidated: tags });
}

/** A trivial query, so a publish during an outage never expires good pages. */
async function sanityReachable() {
  if (!publishedClient) return true; // local content files: nothing to reach
  try {
    await publishedClient.fetch("1", {}, { signal: AbortSignal.timeout(4000) });
    return true;
  } catch (error) {
    console.error("[revalidate] Sanity health check failed", error);
    return false;
  }
}
