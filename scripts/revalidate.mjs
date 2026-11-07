// `pnpm revalidate <site-url> [--all | <type> [slug] [collection]]`
//
// Manual fallback for on-demand revalidation, e.g. if a Sanity webhook
// delivery failed. Sends the same signed request Sanity sends, so it goes
// through the same checks in src/app/api/revalidate/route.ts.
//
//   pnpm revalidate https://your-domain --all
//   pnpm revalidate https://your-domain artwork my-painting canvas
//   pnpm revalidate http://localhost:3000 journalPost first-post
//
// Needs SANITY_REVALIDATE_SECRET in the environment (or .env.local) with the
// same value as the deployed site. The secret is never printed.
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const envFile = join(import.meta.dirname, "..", ".env.local");
if (!process.env.SANITY_REVALIDATE_SECRET && existsSync(envFile)) {
  const line = readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("SANITY_REVALIDATE_SECRET="));
  if (line)
    process.env.SANITY_REVALIDATE_SECRET = line
      .slice("SANITY_REVALIDATE_SECRET=".length)
      .trim()
      .replace(/^["']|["']$/g, "");
}

const [site, type, slug, collection] = process.argv.slice(2);
const secret = process.env.SANITY_REVALIDATE_SECRET;
const TYPES = [
  "artwork",
  "collection",
  "photograph",
  "workshop",
  "journalPost",
  "artistProfile",
];

if (!site || !type || (type !== "--all" && !TYPES.includes(type))) {
  console.error(
    `Usage: pnpm revalidate <site-url> --all\n       pnpm revalidate <site-url> <${TYPES.join("|")}> [slug] [collection-slug]`,
  );
  process.exit(1);
}
if (!secret) {
  console.error(
    "SANITY_REVALIDATE_SECRET is not set (environment or .env.local).",
  );
  process.exit(1);
}

const payload = JSON.stringify(
  type === "--all"
    ? { _type: "artbymoon.revalidateAll" }
    : { _id: `manual.${type}`, _type: type, slug, collection },
);
// Same format as @sanity/webhook: t=<ms>,v1=<base64url HMAC-SHA256 of "t.payload">.
const t = Date.now();
const signature = createHmac("sha256", secret)
  .update(`${t}.${payload}`)
  .digest("base64url");

const url = new URL("/api/revalidate", site);
const res = await fetch(url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "sanity-webhook-signature": `t=${t},v1=${signature}`,
  },
  body: payload,
});
const text = await res.text();
console.log(`${res.status} ${url.href}\n${text}`);
process.exit(res.ok ? 0 : 1);
