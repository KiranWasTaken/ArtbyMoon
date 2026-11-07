// `pnpm check:build`: verifies a finished `next build` in .next/.
// Always: a normal build contains no sample artwork, sample images or sample
// text in shipped output. When ARTBYMOON_PRODUCTION=1: robots.txt and
// sitemap.xml use the configured origin and never example.com.
// Exits non-zero on any failure.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const root = join(import.meta.dirname, "..", ".next");
const failures = [];
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
};

if (!existsSync(root)) {
  console.error("No .next directory: run a build first.");
  process.exit(1);
}

const sampleBuild = process.env.ARTBYMOON_SAMPLE_CONTENT === "1";
const production = process.env.ARTBYMOON_PRODUCTION === "1";

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else yield p;
  }
}

console.log(
  `Checking .next (${sampleBuild ? "sample-content" : "normal"}${production ? ", production" : ""} build)`,
);

// 1. No sample content in a normal build. Source maps are excluded: they
//    contain source text (e.g. an import path), not shipped content.
if (!sampleBuild) {
  const markers = [
    "Sample canvas",
    "Sample photograph",
    "Sample polaroid",
    "Sample bookmark",
    "SAMPLE IMAGE",
  ];
  const sampleMedia =
    /^(canvas|abstract|polaroid|bookmark|detail|photo)-[\w.-]+\.(jpe?g|png|webp|avif)$/i;
  let hits = 0;
  for (const dir of ["static", "server"]
    .map((d) => join(root, d))
    .filter(existsSync)) {
    for (const file of files(dir)) {
      const name = file.split(/[\\/]/).pop();
      if (sampleMedia.test(name)) {
        fail(`sample image in build output: ${relative(root, file)}`);
        hits++;
        continue;
      }
      if (!/\.(js|html|json|rsc|body|css)$/.test(name)) continue;
      const text = readFileSync(file, "utf8");
      const marker = markers.find((m) => text.includes(m));
      if (marker) {
        fail(`"${marker}" found in ${relative(root, file)}`);
        hits++;
      }
    }
  }
  if (!hits) pass("no sample artwork, photographs or images in build output");
} else {
  console.log(
    "  • sample-content build: sample check skipped (never deploy this build)",
  );
}

// 2. SEO files point at the configured origin in production builds.
const body = (route) => {
  const f = join(root, "server", "app", `${route}.body`);
  return existsSync(f) ? readFileSync(f, "utf8") : null;
};
const robots = body("robots.txt");
const sitemap = body("sitemap.xml");
if (production) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : "";
  if (!robots || !sitemap)
    fail("robots.txt or sitemap.xml was not prerendered");
  else {
    if (/example\.(com|org|net)/.test(robots + sitemap))
      fail("example.com found in robots.txt or sitemap.xml");
    else pass("robots.txt and sitemap.xml contain no example.com");
    if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`))
      fail(`robots.txt does not reference ${origin}/sitemap.xml`);
    else pass(`robots.txt references ${origin}/sitemap.xml`);
    if (/Disallow: \/\s*$/m.test(robots))
      fail("robots.txt disallows the whole site");
    else pass("robots.txt allows crawling");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (!locs.length || locs.some((l) => !l.startsWith(origin)))
      fail(`sitemap URLs must all start with ${origin}`);
    else pass(`sitemap lists ${locs.length} URLs, all on ${origin}`);
  }
} else if (robots) {
  if (/Disallow: \/\s*$/m.test(robots))
    pass("non-production build: robots.txt disallows all (as intended)");
  else
    console.log(
      "  • robots.txt allows crawling (NEXT_PUBLIC_SITE_URL is a real origin)",
    );
}

// 3. Only the two known, non-secret variables are inlined via next.config env.
const config = readFileSync(
  join(import.meta.dirname, "..", "next.config.ts"),
  "utf8",
);
const envBlock = config.match(/env:\s*{([^}]*)}/)?.[1] ?? "";
const inlined = [...envBlock.matchAll(/(\w+)\s*:/g)].map((m) => m[1]);
if (inlined.every((k) => ["ARTBYMOON_SAMPLE_CONTENT"].includes(k))) {
  pass(
    `env inlined via next.config: ${inlined.join(", ") || "none"} (plus NEXT_PUBLIC_SITE_URL, public by design)`,
  );
} else fail(`unexpected env inlined via next.config: ${inlined.join(", ")}`);

// 4. Sanity secrets never appear in anything a browser can download.
const secrets = [
  "SANITY_API_READ_TOKEN",
  "SANITY_API_WRITE_TOKEN",
  "SANITY_REVALIDATE_SECRET",
].filter((k) => (process.env[k] ?? "").length >= 8);
if (secrets.length) {
  let leaks = 0;
  for (const dir of [join(root, "static"), join(root, "server", "app")].filter(
    existsSync,
  )) {
    for (const file of files(dir)) {
      if (!/\.(js|html|json|rsc|body|css|txt|meta)$/.test(file)) continue;
      const text = readFileSync(file, "utf8");
      for (const k of secrets)
        if (text.includes(process.env[k])) {
          fail(`value of ${k} found in ${relative(root, file)}`);
          leaks++;
        }
    }
  }
  if (!leaks) pass(`no Sanity secret values in output (${secrets.join(", ")})`);
} else
  console.log(
    "  • Sanity secrets not set in this shell: secret-value scan skipped",
  );

// 5. The Studio (about 2 MB of JavaScript) stays on /studio: every public
//    page's JavaScript must remain within budget.
const BUDGET_KB = 260;
const pages = [
  "index",
  "artworks",
  "photography",
  "about",
  "contact",
  "workshops",
  "journal",
];
const over = [];
let measured = 0;
for (const page of pages) {
  const f = join(root, "server", "app", `${page}.html`);
  if (!existsSync(f)) continue;
  const html = readFileSync(f, "utf8");
  let bytes = 0;
  for (const m of html.matchAll(
    /<script[^>]*src="\/_next\/(static\/[^"]+\.js)"/g,
  )) {
    const js = join(root, m[1]);
    if (existsSync(js)) bytes += gzipSync(readFileSync(js)).length;
  }
  measured++;
  if (bytes / 1024 > BUDGET_KB)
    over.push(`${page} ${(bytes / 1024).toFixed(0)} KB`);
}
if (over.length)
  fail(
    `public page JavaScript over ${BUDGET_KB} KB gzip (Studio leak?): ${over.join(", ")}`,
  );
else if (measured)
  pass(
    `${measured} public pages each under ${BUDGET_KB} KB gzip JavaScript (Studio not bundled)`,
  );

console.log(
  failures.length
    ? `\n${failures.length} check(s) failed.`
    : "\nAll build checks passed.",
);
process.exit(failures.length ? 1 : 0);
