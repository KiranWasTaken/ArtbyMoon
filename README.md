# ArtbyMoon: portfolio and creative studio

Portfolio for ArtbyMoon (@art.by.moon\_): acrylic paintings, abstract work, polaroid-style paintings, sketches, hand-painted bookmarks, photography and art workshops.

**Status:** Phase 4 (Sanity CMS integration). All pages are built: homepage, artwork gallery, photography, about, contact, workshops and journal, plus sitemap, robots and social metadata. The site reads content from **Sanity** when a project is configured, and from the local files in `src/content/artist/` otherwise. The ArtbyMoon Sanity project is connected (with `.env.local`) and holds the first published artworks; photography, biography, workshops and journal are still empty, so those pages show their empty states. **The site has not been deployed and the Sanity webhook is not configured yet** (see [docs/08-cms-guide.md](docs/08-cms-guide.md)). Without Sanity variables the site falls back to the local files in `src/content/artist/`. All interface copy is draft until ArtbyMoon approves it. Nothing about her work or life has been invented. **No physical-device testing has been done yet**; see [docs/06-device-testing.md](docs/06-device-testing.md).

## Requirements

- Node.js 24 (developed on 24.20) and pnpm 9 (`corepack enable` or `npm i -g pnpm`)

## Install and develop

```bash
pnpm install
pnpm dev                      # http://localhost:3000 (development server)
```

Quality checks, all expected to pass before any deployment:

```bash
pnpm lint
pnpm format:check             # pnpm format to fix
pnpm typecheck
pnpm build && pnpm check:build
```

Pages: `/` · `/artworks` · `/artworks/[collection]` (canvas, abstract, polaroids, sketches, bookmarks, plus any added in the CMS) · `/artworks/[collection]/[slug]` · `/photography` · `/about` · `/contact` · `/workshops` · `/journal` · `/journal/[slug]` · `/studio` (Sanity Studio, noindex) · internal `/design-system` (noindex, never linked). Generated: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`. API routes: `/api/revalidate` (Sanity webhook), `/api/draft-mode/enable` and `/disable` (editor preview).

**Review mode:** add `?review` to any URL (e.g. `/?review`) to highlight copy that still needs ArtbyMoon's approval. This is separate from the CMS Draft Mode preview.

## Builds

| Command                    | Use                                                                                                                                                                                                         | Indexable?                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm build && pnpm start` | Local or preview build                                                                                                                                                                                      | Only if `NEXT_PUBLIC_SITE_URL` is a real https origin; otherwise every page is noindex, robots.txt disallows all and the sitemap is empty |
| `pnpm build:production`    | **The deployable build.** Fails unless `NEXT_PUBLIC_SITE_URL` is a real https origin, sample content is off and (with Sanity) the webhook secret is set; then runs `check:build`                            | Yes                                                                                                                                       |
| `pnpm preview:sample`      | Sample-content preview: watermarked "SAMPLE IMAGE · NOT ARTWORK" galleries, red banner, on http://localhost:3000. **Never deploy**                                                                          | No (noindex, robots disallow all, refused by `build:production`)                                                                          |
| `pnpm check:build`         | Inspects the last build: no sample artwork or images; no Sanity secret values in output; public pages' JavaScript within budget (Studio not bundled); in production, sitemap and robots use the real origin | n/a                                                                                                                                       |

For phone testing on your local network: `pnpm build && pnpm start` (it listens on your network by default), then open `http://<your-computer's-IP>:3000`. See [docs/06-device-testing.md](docs/06-device-testing.md) (the clipboard needs HTTPS).

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored) for local values. On Vercel, set them under Project → Settings → Environment Variables.

| Variable                        | Required                           | Purpose                                                                                                                                                                                                                                                                |
| ------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | **Yes, for production**            | Origin for canonical URLs, Open Graph, sitemap and robots, e.g. `https://www.her-domain.com` (no trailing slash). Public by design (it appears in page HTML). Placeholder, local, `.test` and `.example` hosts are rejected by `build:production` and never indexable. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | To use the CMS                     | Sanity project ID. Empty = local content files. Public by design.                                                                                                                                                                                                      |
| `NEXT_PUBLIC_SANITY_DATASET`    | No (default `production`)          | Sanity dataset. Public by design.                                                                                                                                                                                                                                      |
| `SANITY_API_READ_TOKEN`         | For Draft Mode preview             | **Secret, server only.** Sanity Viewer token, used only to show drafts to editors.                                                                                                                                                                                     |
| `SANITY_API_WRITE_TOKEN`        | No (leave empty)                   | **Secret, local only.** Only for the optional `--token` seeding alternative; seeding normally uses your own `sanity login`. Never on Vercel.                                                                                                                           |
| `SANITY_REVALIDATE_SECRET`      | **Yes, with Sanity in production** | **Secret, server only.** Shared with the Sanity webhook; verifies its signature.                                                                                                                                                                                       |
| `ARTBYMOON_SAMPLE_CONTENT`      | No                                 | `1` turns on the sample-content preview. Never set in production; `build:production` refuses it.                                                                                                                                                                       |
| `ARTBYMOON_PRODUCTION`          | No                                 | Set to `1` by `pnpm build:production` to enable the strict checks. Vercel production builds (`VERCEL_ENV=production`) are strict automatically.                                                                                                                        |

Secrets never start with `NEXT_PUBLIC_`: every build fails if a `NEXT_PUBLIC_` variable looks like a token or secret, and `check:build` scans the output for the secret values.

## Content management (Sanity)

Full setup and the editing guide for ArtbyMoon: **[docs/08-cms-guide.md](docs/08-cms-guide.md)**.

- **Studio:** embedded at `/studio` (e.g. `http://localhost:3000/studio` in development). Editors sign in with their Sanity account. It is a separate client app: its JavaScript loads only on `/studio`, never on public pages.
- **Content layer:** pages read everything through `src/lib/content/*`, which picks the source: Sanity (`src/sanity/source.ts`) when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, otherwise the local files. Components, routes, empty states and `?review` are identical for both.
- **Caching:** Sanity is queried on the server only and cached by Next.js (`'use cache'` with tags). Publishing in Sanity triggers the webhook → `/api/revalidate`, which immediately expires the changed type's data and the pages showing it: new URLs work and removed ones are 404 as soon as it answers. An hourly background refresh is a safety net; if Sanity is unreachable, the last cached pages keep being served.
- **Contact page:** the Instagram account and extra contact lines come from the published artist profile.
- **Images:** served and resized by Sanity's image CDN (AVIF/WebP via `auto=format`), never downloaded by the Next.js server.
- **Scripts:**
  - `pnpm sanity:seed-collections` creates the five collections (names, web addresses, presentation style) in a new dataset, using your own `pnpm exec sanity login` (no token). No descriptions, images or artworks are uploaded. `--dry-run` to preview.
  - `pnpm revalidate <site-url> --all` (or `<type> [slug] [collection]`): manual signed refresh if a webhook was missed. Also the way to see newly published content in `pnpm dev` (the webhook can't reach localhost): `pnpm revalidate http://localhost:3000 --all`, or hard-reload the page.

## Adding content without the CMS (local files)

With no Sanity project configured, content lives in typed files under `src/content/artist/` (genuine content only).

- **Photographs from ArtbyMoon:** she follows [docs/07-photographing-your-work.md](docs/07-photographing-your-work.md) (lighting, shapes, sizes, file names, the details to send).
- **Artwork:**
  1. Put the file in `public/images/artworks/` (e.g. `canvas-river-at-dusk-main.jpg`).
  2. Add a record to `src/content/artist/artworks.ts` with `id`, a permanent `slug`, `collection`, and `media: { kind: "image", image: { src, width, height, alt } }` using the file's real pixel size and her approved alt text.
  3. Add optional facts only as supplied: title, year, medium, dimensions, subjects, availability, caption, description, note, extra views (`gallery`), `featured: true` for the homepage.

  It then appears in the gallery, its collection, its own page and, if featured, the homepage. Details: [docs/04-image-strategy.md §6](docs/04-image-strategy.md).

- **Photography:** put files in `public/images/photography/` (location data removed) and add records to `src/content/artist/photographs.ts`. Title, caption, date (`YYYY-MM` or `YYYY-MM-DD`), location and category are optional. Category filters appear automatically once there are 6+ photos in 2+ categories.
- **About:** edit `src/content/artist/about.ts` (intro, biography paragraphs, portrait, materials, inspirations, approach). Empty sections are hidden.
- **Workshops:** add entries to `src/content/artist/workshops.ts` with confirmed details only and an external `bookingUrl`; set `status: "past"` to retire one.
- **Wording:** `src/content/copy/*.ts`; change `status` to `"approved"` once ArtbyMoon approves a line.

Rebuild after any change to local files. Once Sanity is connected, artworks, photography, workshops, journal and the artist profile are edited in the Studio instead; interface wording stays in `src/content/copy/`.

## Deployment prerequisites

Nothing has been deployed. Before the first deployment:

1. **Confirm the domain** with ArtbyMoon and set `NEXT_PUBLIC_SITE_URL` in the hosting provider's production environment. Do not guess it.
2. **Sanity (if used):** create the project, tokens, CORS origins and webhook as described in [docs/08-cms-guide.md](docs/08-cms-guide.md), and set the Sanity variables on Vercel.
3. **Build with `pnpm build:production`** (or a Vercel production deployment, which is strict automatically). It must pass, including `check:build`.
4. **Run the physical-device checklist** in [docs/06-device-testing.md](docs/06-device-testing.md) on Android Chrome, iOS Safari and desktop Chrome, on an HTTPS preview deployment.
5. **Content:** real photographs for at least the featured homepage slots, ArtbyMoon's approval of all draft copy (`?review`), and confirmation of the Instagram contact route.
6. Make sure `ARTBYMOON_SAMPLE_CONTENT` is not set in the production environment (the strict build refuses it anyway).

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS 4 · GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG) · Lenis · Sanity (Studio v6, next-sanity 13, Portable Text).

## Docs

1. [Creative direction](docs/01-creative-direction.md): "The Open Studio" concept
2. [Design system](docs/02-design-system.md): colour, type, spacing, lines, motion principles
3. [Architecture](docs/03-architecture.md): sitemap, components, motion rules, content model, SEO
4. [Image strategy](docs/04-image-strategy.md): placeholders, image pipeline, adding artworks
5. [Implementation plan](docs/05-implementation-plan.md): phases, dependencies, risks
6. [Device testing](docs/06-device-testing.md): what was automated, what needs a real phone
7. [Photographing your work](docs/07-photographing-your-work.md): a guide for ArtbyMoon
8. [CMS guide](docs/08-cms-guide.md): Sanity setup, webhook, deployment, and step-by-step editing for ArtbyMoon

## Content rules

- Facts about the work (title, year, medium, size, price, availability, polaroid captions) come from ArtbyMoon only. Missing fields stay empty and are not shown.
- Instagram screenshots are reference material: keep them in `screenshot/` or `design-reference/` (both git-ignored), never in `public/`.
- Nothing is uploaded to Sanity automatically except the five empty collection records (`pnpm sanity:seed-collections`, run by hand).
