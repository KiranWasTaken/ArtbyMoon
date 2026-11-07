// `pnpm sanity:seed-collections`: one-time setup for a new Sanity dataset.
//
// Creates the five existing collections (Canvas, Abstract, Polaroids,
// Sketches, Bookmarks) with their names, web addresses, presentation style
// and order, so artworks can be filed straight away and the current URLs
// (/artworks/canvas, …) keep working. Nothing else: no descriptions, cover
// images, artworks or sample content are uploaded. Write the descriptions in
// the Studio.
//
// Safe to run more than once: existing collections are never overwritten.
//
// Default (least privilege, no API token): imports through the Sanity CLI
// with YOUR login. Run `pnpm exec sanity login` once first. Needs
// NEXT_PUBLIC_SANITY_PROJECT_ID (and optionally NEXT_PUBLIC_SANITY_DATASET,
// default "production") in the environment or .env.local.
//   pnpm sanity:seed-collections
// Alternative: --token uses SANITY_API_WRITE_TOKEN (an Editor token you
// create, use once and delete). Never put that token on Vercel.
// --dry-run prints the five records without sending anything.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { apiVersion, readSanityEnv } from "../src/sanity/env.mjs";

const envFile = join(import.meta.dirname, "..", ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const COLLECTIONS = [
  ["canvas", "Canvas paintings", "Canvas painting"],
  ["abstract", "Abstract", "Abstract work"],
  ["polaroids", "Polaroids", "Polaroid"],
  ["sketches", "Sketches", "Sketch"],
  ["bookmarks", "Bookmarks", "Bookmark"],
];

const docs = COLLECTIONS.map(([slug, name, singular], i) => ({
  _id: `collection-${slug}`,
  _type: "collection",
  name,
  slug: { _type: "slug", current: slug },
  singular,
  style: slug,
  order: (i + 1) * 10,
}));

const dryRun = process.argv.includes("--dry-run");
const env = readSanityEnv();
const useToken = process.argv.includes("--token");
const token = process.env.SANITY_API_WRITE_TOKEN;

if (dryRun) {
  console.log(JSON.stringify(docs, null, 2));
  process.exit(0);
}
if (env.error || !env.configured) {
  console.error(env.error ?? "NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
  process.exit(1);
}
if (!useToken) {
  // Sanity CLI import with the editor's own login; --missing = never overwrite.
  const file = ".sanity-seed-collections.ndjson";
  writeFileSync(file, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "sanity",
      "datasets",
      "import",
      file,
      "--project",
      env.projectId,
      "--dataset",
      env.dataset,
      "--missing",
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  rmSync(file, { force: true });
  if (result.status !== 0) {
    console.error(
      "\nImport failed. Are you logged in? Run: pnpm exec sanity login",
    );
    process.exit(result.status ?? 1);
  }
  console.log(
    `Done. Collections present in "${env.dataset}" (existing ones left unchanged).`,
  );
  process.exit(0);
}
if (!token) {
  console.error(
    "SANITY_API_WRITE_TOKEN is not set (environment or .env.local).",
  );
  process.exit(1);
}

// SANITY_API_HOST is for local testing against a mock only.
const base = process.env.SANITY_API_HOST
  ? `${process.env.SANITY_API_HOST}/v${apiVersion}`
  : `https://${env.projectId}.api.sanity.io/v${apiVersion}`;
const res = await fetch(`${base}/data/mutate/${env.dataset}`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    mutations: docs.map((doc) => ({ createIfNotExists: doc })),
  }),
});
const text = await res.text();
if (!res.ok) {
  console.error(`Sanity answered ${res.status}: ${text.slice(0, 300)}`);
  process.exit(1);
}
console.log(
  `Done. Collections present in "${env.dataset}": ${COLLECTIONS.map((c) => c[0]).join(", ")} (existing ones left unchanged).`,
);
