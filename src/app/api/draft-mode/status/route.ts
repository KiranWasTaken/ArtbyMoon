import { draftMode } from "next/headers";
import { connection } from "next/server";

/**
 * Is this browser in a genuine Draft Mode session? Used by the preview
 * banner so it never claims "previewing" on a stale or hand-made cookie.
 */
export async function GET() {
  await connection(); // per request: never prerendered
  const { isEnabled } = await draftMode();
  return Response.json(
    { enabled: isEnabled },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
