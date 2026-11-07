import { draftMode } from "next/headers";
import { connection } from "next/server";
import { getPreviewRoutes } from "@/lib/content/routes";

/**
 * Content URLs including unpublished drafts, for editors in Draft Mode only.
 * Next.js validates the httpOnly draft-mode cookie: without a genuine one
 * (e.g. a hand-made cookie) the answer is 401 and nothing is revealed.
 */
export async function GET() {
  await connection(); // per request: never prerendered
  const { isEnabled } = await draftMode();
  if (!isEnabled)
    return Response.json(
      { ok: false },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  return Response.json(await getPreviewRoutes(), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
