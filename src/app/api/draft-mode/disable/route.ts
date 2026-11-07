import { cookies, draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { PREVIEW_HINT_COOKIE, previewHintCookie } from "@/sanity/preview";

/**
 * Turns Draft Mode off and returns to the page the editor was on. Only
 * same-origin paths are accepted as the destination (no open redirect:
 * "//host" and "/\host" resolve to another origin and are refused).
 */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  (await cookies()).set(PREVIEW_HINT_COOKIE, "", {
    ...previewHintCookie,
    maxAge: 0,
  });

  const origin = request.nextUrl.origin;
  const requested = request.nextUrl.searchParams.get("redirect") ?? "/";
  let destination = "/";
  try {
    const url = new URL(requested, origin);
    if (url.origin === origin && requested.startsWith("/"))
      destination = url.pathname + url.search;
  } catch {
    // keep "/"
  }
  return NextResponse.redirect(new URL(destination, origin), 307);
}

/** The Studio's Preview tool disables via POST. */
export const POST = GET;
