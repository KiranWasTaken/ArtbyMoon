# 03 · Sitemap and architecture

## Sitemap

```
/                              Home: studio wall → index → canvas → polaroids → bookmarks → photography → workshops → journal → closing
/artworks                      All collections (curated overview, not one giant grid)
/artworks/[collection]         canvas · abstract · polaroids · sketches · bookmarks
/artworks/[collection]/[slug]  Artwork detail: mounted image, wall label, extra views, enquiry
/photography                   Visual journal (darkroom tone for the whole route)
/photography/[series]          Optional: a series or story (decide once photos are known)
/workshops                     Upcoming (status-driven) and past workshops
/workshops/[slug]              Workshop detail with external booking link
/journal                       Stories, process notes, announcements, exhibitions, workshop updates
/journal/[slug]                Post
/about                         ArtbyMoon's story, in her words (no invented biography)
/contact                       Enquiries: artwork · commission · collaboration · workshop
/design-system                 Internal reference (noindex)
```

**Taxonomy.** Collections are formats (canvas, abstract, polaroids, sketches, bookmarks). Subjects are tags _within_ collections (landscape, animal, flower, portrait…) and work as filters, not separate pages. That avoids thin pages and double-listing. Greeting cards start inside **Sketches**.

**Polaroids (added in Phase 2).** Her polaroid-style paintings (small works in white frames with handwritten captions) are one of her own Instagram highlights. They are a format, so they fit the taxonomy cleanly: `/artworks/polaroids`. Their handwritten caption is part of the work and has its own field (`Artwork.caption`), transcribed by ArtbyMoon, never invented.

**Seasonal series** (her highlights include Christmas and Autumn Love) are better modelled as a `series` tag across collections than as collections, so a painting can be both "canvas" and "Autumn Love".

## Technical foundation

- **Framework:** Next.js 16.4 (App Router, Turbopack) with React 19.3.
  - `cacheComponents: true`: pages prerender statically; navigations keep up to 3 routes alive in React `<Activity>` (hidden, not unmounted).
  - `partialPrefetching: true`.
- **TypeScript:** strict, plus `noUncheckedIndexedAccess` and `noImplicitOverride`.
- **Tailwind CSS 4:** tokens in CSS `@theme`, no JS config.
- **Animation:** GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG, CustomEase, all free since 3.13) via `@gsap/react` `useGSAP`.
- **Scrolling:** Lenis 1.3.
- **Tooling:** ESLint (`eslint-config-next`, including React Compiler rules) and Prettier with the Tailwind class-sorting plugin.
- **Scripts:** `dev`, `build`, `lint`, `typecheck` (runs `next typegen` first), `format`, `format:check`.

## Source layout

```
src/
  app/                    routes, layout, globals.css (tokens), icon.svg, not-found
  components/
    layout/               SiteHeader (hide-on-scroll, <dialog> menu), SiteFooter, InlineScript
    ui/                   ArtMedia, PlaceholderArt, CopyText, Crescent, WallLabel, LinkButton, StatusChip, Handnote, BrushStroke
    motion/               RevealScope (client boundary for server-rendered sections)
    home/                 HeroStudioWall, ExploreIndex, CanvasEditorial, PolaroidTable, BookmarkLine,
                          PhotographyTeaser, WorkshopsSection, JournalSection, ClosingInvitation
    workshops/            WorkshopTicket, WorkshopEmpty
    journal/              JournalList, JournalContents
    design-system/        MotionLab
  content/
    types.ts              the content model (mirrors the future Sanity schema)
    artist/               GENUINE content only: profile, collections, artworks, workshops, journal
    placeholder/          labelled stand-ins (artworks.ts) and design-system fixtures (samples.ts)
    copy/                 interface copy with draft/approved status (home.ts)
  lib/
    content/home.ts       getHomeContent(), the homepage's single data source
    content/artworks.ts · photography.ts · workshops.ts   data access for the other routes
    seo.ts                per-page metadata (canonical, Open Graph)
    motion/               gsap.ts (single registration), tokens.ts, SmoothScroll.tsx, ToneZone.tsx, useReveal.ts
    fonts.ts · site.ts · format.ts · color.ts · cn.ts
docs/                     these documents
screenshot/, design-reference/   git-ignored: Instagram screenshots, reference only, never shipped
```

## Component strategy

**Server first.** Sections are Server Components that mark elements with `data-reveal="lines|unveil|rule|draw|deal|fade"`. A thin client boundary (`RevealScope`, or `ToneZone` for darkroom sections) animates them. Markup, SEO and no-JS rendering stay server-side; motion is progressive enhancement.

| Layer       | Components (✓ built)                                                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives  | ✓ PlaceholderArt · ✓ WallLabel · ✓ LinkButton · ✓ StatusChip · ✓ Handnote · ✓ BrushStroke · ✓ ArtMedia (image or placeholder at true ratio) · ✓ CopyText · ✓ Crescent |
| Layout      | ✓ SiteHeader · ✓ SiteFooter · PageIntro · SectionHeader                                                                                                               |
| Motion      | ✓ SmoothScroll · ✓ ToneZone · ✓ RevealScope / useReveal · RouteTone (darkroom per route)                                                                              |
| Art         | ArtworkGrid (curated spans, true ratios) · ArtworkFigure · ArtworkViewer (detail, zoom) · CollectionNav · SubjectFilter                                               |
| Photography | PhotoJournal · PhotoSeries · DarkroomViewer                                                                                                                           |
| Workshops   | ✓ WorkshopTicket / WorkshopEmpty · WorkshopList · WorkshopDetail · BookingCTA (external)                                                                              |
| Journal     | ✓ JournalList / JournalContents (previews) · PostList · PostBody (portable text) · PostCover                                                                          |
| Contact     | EnquiryForm (typed: artwork / commission / collaboration / workshop)                                                                                                  |

## Motion architecture: rules that keep it reliable

1. **One GSAP entry point.** Everything imports from `lib/motion/gsap.ts`, which registers plugins and custom eases once.
2. **`useGSAP` everywhere**, so cleanup is automatic. This matters doubly with `cacheComponents`: when a route is hidden by `<Activity>`, its layout effects are cleaned up, so ScrollTriggers, SplitText splits and inline styles revert. They are rebuilt when the route is shown again. Side effects outside the scope (such as `data-tone` on `<html>`) are undone in the `useGSAP` cleanup function.
3. **Lenis runs on GSAP's ticker** (`autoRaf: false`, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`). There is one rAF loop. Lenis is not instantiated for reduced motion, and is re-created if the preference changes mid-session. On every pathname change: `lenis.resize()` and `ScrollTrigger.refresh()` after paint.
4. **`gsap.matchMedia`** gates every motion branch on `prefers-reduced-motion` and, where relevant, on desktop width or a fine pointer.
5. **No flash before hydration.** An inline `<head>` script adds `html.js` before first paint. CSS hides `[data-intro]` only under `html.js` with motion allowed, and a 3.5s CSS failsafe reveals them anyway.
6. **The home intro plays once per visit.** Returning via back navigation or an Activity restore gets a short fade instead.
7. **One pinned sequence per page, pinned by transform.** The bookmark line uses `pinType: "transform"`. The default `position: fixed` pin registered a layout shift of about 1.0 (CLS) each time it toggled; transform pinning measured 0. It only runs with Lenis active (desktop, motion allowed), so scroll and pin update in the same frame. Sticky text columns use CSS `position: sticky`, not pinning.
8. **Dark sections carry their own tokens.** The photography section has `data-tone="darkroom"` itself, so its text keeps full contrast even mid-transition, with reduced motion or without JS. `ToneZone` additionally dims the whole page while it is in view.
9. **Route transitions use React `<ViewTransition>`** (built into React 19.3 and supported by the App Router), not GSAP. A shared `name` morphs a collection thumbnail into the artwork-detail hero. GSAP owns in-page choreography; the browser owns cross-route continuity. Without View Transitions support, navigation still works, just without the morph.

## Content model and CMS

Types live in `src/content/types.ts` and mirror the intended CMS schema: `Artwork`, `Collection`, `PreviewItem`, `CanvasSubject`, `ExploreRoom`, `Workshop`, `JournalPost`, `JournalCategoryInfo`, `ImageAsset`, `Media` (image or placeholder union) and `Copy` (text plus draft/approved status).

**Three kinds of content, kept apart:**

- `content/artist/`: genuine, confirmed content only. Today: name, Instagram handle, the collection list. Artworks, workshops and journal posts are empty arrays.
- `content/placeholder/`: stand-ins, every one marked `source: "placeholder"`, plus component fixtures used only on `/design-system`.
- `content/copy/`: interface wording. Every line is `status: "draft"` until ArtbyMoon approves it. `CopyText` renders drafts with `data-draft`, and adding `?review` to any URL highlights them.

**Fallback per slot:** `getHomeContent()` puts featured real artworks first and fills remaining slots with placeholders, so the homepage upgrades piece by piece as photographs arrive. Workshops and journal render their published state when entries exist and an honest empty state otherwise. Neither compares against today's date; `status: "past"` retires a workshop, which keeps the page statically rendered.

Every descriptive field is optional. **Missing facts stay `undefined` and the UI omits them**; nothing is back-filled.

**Recommendation: Sanity** (hosted Content Lake and Studio). It means no backend, database or auth of our own, which satisfies the "no backend yet" constraint. Reasons:

- Its image pipeline fits art: hotspot/crop, automatic **LQIP** and **dominant-colour palette** metadata, and AVIF/WebP via CDN.
- Portable Text for journal posts.
- Scheduled publishing and drafts with preview.
- Webhook → `revalidateTag` keeps static pages fresh without rebuilds.
- ArtbyMoon or an assistant can edit workshops and posts in a browser.

Alternatives considered:

- **Keystatic or Tina** (git-based): free and simple, but every edit is a commit and image handling is weaker.
- **Payload**: excellent, but needs a database and hosting, which is a backend.
- **Plain MDX in the repo**: fails the "no code change per update" requirement.

**Data-access seam:** pages and sections receive props from `src/lib/content/*` (`getHomeContent()`, `getArtworks()`, `getAbout()`, …); no component imports content files directly.

### Sanity integration (Phase 4)

Built as recommended. Full setup, webhook, revalidation and editing guide: [08 · CMS guide](08-cms-guide.md).

- **One content layer, two sources:** `src/lib/content/source.ts` uses Sanity (`src/sanity/source.ts`) when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, otherwise the local files. Sanity results are mapped to the same types (`src/sanity/map.ts`), so routes, components, empty states and `?review` are unchanged. CMS text is marked approved; missing fields stay `undefined`.
- **Collections are data:** `Collection.slug` is any string; its look comes from `Collection.style` (one of the five presentation presets), so ArtbyMoon can add collections without code.
- **Server-only fetching:** `sanityFetch()` (`src/sanity/fetch.ts`) runs inside `'use cache'` with a tag per document type (`artwork`, `collection`, `photograph`, `workshop`, `journal`, `journal:<slug>`, `profile`), `cacheLife` revalidate 1 h. The browser never queries Sanity; images load from `cdn.sanity.io` through a next/image loader (`src/sanity/image.ts`).
- **Freshness:** signed webhook → `/api/revalidate` → after a Sanity health check, `revalidateTag(tag, { expire: 0 })` for the changed type only plus `revalidatePath` for the concrete pages showing it (every collection/artwork or post page for those types, from the current route list), then the pages are requested once (`after()`). `{ expire: 0 }` alone does not expire prerendered pages (their entries carry only path tags), and expiring a dynamic route _pattern_ would rebuild its fallback shell at runtime, which fails here (root-layout client hooks), hence concrete paths. If Sanity is unreachable, tags are only marked stale (`"max"`) and pages are kept.
- **Draft Mode:** `/api/draft-mode/enable` (secret validated by Sanity with the Viewer token) → cached functions re-run per request with the drafts perspective and are not stored. A readable, non-secret `artbymoon-preview` cookie hints at the banner; the banner then confirms with `/api/draft-mode/status`, so public pages never read request state.
- **404s:** `src/proxy.ts` checks artwork and journal paths before rendering against `/api/routes`, a static list of published URLs tagged like the content (so the webhook expires it on every server; no per-server memory) and rewrites unknown ones to a static 404 page with status 404. With a draft-mode cookie, unpublished URLs are checked against `/api/routes/preview`, which only answers a cookie Next.js validates (401 otherwise). Fails open if the list can't be fetched.
- **Studio:** `/studio` is a static page rendering `NextStudio`; `/studio/:path+` rewrites to it. `SiteChrome` drops the header, footer and smooth scrolling there; its JavaScript is isolated to that route (checked by `check:build`).
- **Journal:** `/journal` and `/journal/[slug]` render Portable Text on the server (`RichText`), with unsafe link protocols dropped.

## Artwork gallery (Phase 3a)

**Routes:**

- `/artworks`: page introduction, the collection shelf (each collection's first work as its cover, or a pencil outline of its object while empty) and "All work", one wall of every artwork in collection order.
- `/artworks/[collection]`: one of five collections. `generateStaticParams` lists every collection, so each page is prerendered.
- `/artworks/[collection]/[slug]`: artwork detail. `generateStaticParams` lists every artwork. While there are none, Cache Components still requires one param, so it returns a placeholder `_` that renders the 404.
- `/artworks/missing`: internal static 404, the rewrite target of `src/proxy.ts`.

**Status codes.** Dynamic routes under Cache Components stream a static shell first, so a `notFound()` thrown while rendering arrives with HTTP 200 (plus `noindex`). `src/proxy.ts` checks the collection and slug before rendering and rewrites unknown paths to the static 404 with status 404. Measured: every unknown path returns 404, including on a cold server.

**Collection character** (`components/art/presentation.ts`):

| Collection | Layout                                               | Frame                             | Surface    |
| ---------- | ---------------------------------------------------- | --------------------------------- | ---------- |
| Canvas     | wall (spans by orientation, rows offset alternately) | mount (paper margin and hairline) | paper      |
| Abstract   | bold (larger spans, more air)                        | edge (hairline only)              | paper      |
| Polaroids  | table (tilted prints, straighten on hover)           | print                             | notebook   |
| Sketches   | wall                                                 | tape                              | sketchbook |
| Bookmarks  | line (auto-fill, ~6–8rem wide, hanging from pegs)    | hang                              | paper      |

**Gallery wall algorithm** (`GalleryWall`): items are packed into rows of a 12-column grid with spans chosen by aspect ratio, never by cropping. Each row's first item is offset alternately left and right so the wall reads as hung, not tiled. DOM order equals visual order, so keyboard order is natural. On phones, landscape works take both columns.

**Subject filter:** `?subject=` is read by a small client component inside `<Suspense>`; the fallback is the same links with "All" active, so prerendered HTML and no-JS visitors get working links. Filtering injects a scoped `<style>` that hides non-matching items, without re-rendering the server-rendered gallery, and announces "Showing …" in a live region. Unknown subjects are ignored.

**Artwork detail:**

- The image is shown at its natural ratio, sized so its height stays within ~76% of the viewport. Canvases and sketches are mounted.
- "View full screen" opens a native `<dialog>` in the darkroom tone, using `image.original` when supplied.
- Extra views (`gallery`) show below the image.
- Facts appear only when supplied, and so does the story: polaroid caption, description, and "From ArtbyMoon" note.
- Enquiry is a direct message on Instagram (her own "DM for order"). The copy never implies the work is for sale unless `availability` says so, and says it has found a home when `sold`.
- Previous / next within the collection, related works, and VisualArtwork JSON-LD built from supplied fields only.

**Shared-element transition:** the thumbnail and the detail image both sit in `<ViewTransition name="artwork-{id}" share="morph" default="none">`. The morph plays on forward navigation in browsers with the View Transitions API (Chromium verified: `document.startViewTransition` is called on click). Back navigation restores the preserved route instantly (Activity) at its previous scroll position. Without browser support, navigation is unchanged. Reduced motion disables all view-transition animations in CSS.

**Sample-content mode:** building with `ARTBYMOON_SAMPLE_CONTENT=1` adds `content/placeholder/sample-artworks.ts`: watermarked "SAMPLE IMAGE · NOT ARTWORK" JPEGs generated by `scripts/generate-sample-images.mjs`, titles "Sample …", year 2099. A red banner shows on every page. Sketches is left empty on purpose. The flag is inlined at build time (`next.config.ts`), and the default build contains no sample text or images (verified by scanning `.next`).

## Photography, About, Contact, SEO (Phase 3b)

- **Photography** (`/photography`): `RouteTone` puts the whole route, header and footer included, in the darkroom tone. It applies before first paint via an inline script and on client navigation via a layout effect, and is removed when the route is left or hidden by Activity. `PhotoJournal` lays photographs out with the shared `packRows` (`components/art/presentation.ts`), the same row packing as the artwork wall.
  - **Viewer:** a native `<dialog>` with previous/next buttons (wrap-around), arrow keys and horizontal swipe (≥ 48px, mostly horizontal; `touch-action: pan-y` keeps vertical scroll and pinch-zoom).
  - **Accessibility:** Escape closes it; focus goes to Close on open and back to the photograph that opened it on close. A live region announces "name, n / total".
  - **Motion:** a GSAP slide-and-fade between photos, skipped with reduced motion.
  - **Data:** `content/artist/photographs.ts` (empty) via `lib/content/photography.ts`. Sample photographs exist only in sample-content builds.
- **About** (`/about`): every sentence comes from `content/artist/about.ts` (`AboutContent`). Sections without confirmed content are omitted. With no portrait supplied, the page shows her crescent mark in pencil, never a stand-in photo.
- **Contact** (`/contact`): no form, because no submission service exists. Instagram DM link (`ig.me/m/art.by.moon_`, new tab, announced as such) and an enquiry guide (native radio group). "Copy message" uses the Clipboard API and shows "Copied" only on success, or a select-and-copy fallback on failure.
- **Workshops** (`/workshops`): published tickets or the "To be announced" ticket, via `lib/content/workshops.ts` (shared with the homepage).
- **SEO:**
  - `lib/seo.ts` `pageMetadata()` gives every page a title, description, canonical (clean path, so `?review` and filters consolidate) and Open Graph/Twitter metadata, defaulting to the generated `/opengraph-image`. A page-level `openGraph` replaces the parent's, so the default image is restated explicitly.
  - `sitemap.ts` lists only real public routes, plus artist-supplied artworks, with no invented `lastModified` dates.
  - `robots.ts` allows all and points at the sitemap; `/design-system` stays crawlable so its `noindex` is seen.
  - Sample-content builds: robots `Disallow: /`, an empty sitemap and `noindex` on every page.
  - The origin comes from `NEXT_PUBLIC_SITE_URL` (`.env.example`); builds warn when it is unset.

## Workshops and booking (no payments in v1)

`Workshop.status` drives the UI: `to-be-announced | open | waitlist | full | past`. Date, price and seats appear only when supplied. Booking is an **external link** (`bookingUrl`) to a tool ArtbyMoon chooses, such as Luma, Eventbrite, Calendly or a Tally form. Pick it based on how she already takes payments. An on-site checkout can come later without changing the content model.

## SEO, accessibility, performance

**SEO:**

- Per-route `generateMetadata`, plus Open Graph images per artwork and post (`opengraph-image.tsx`).
- `sitemap.ts` and `robots.ts`.
- JSON-LD: `Person` on home and about, `VisualArtwork` on artwork detail (only supplied fields), `Event` on workshops (only when date and location exist), `BlogPosting` on journal posts.

**Accessibility:**

- Semantic landmarks and a skip link.
- `<dialog>` mobile menu (focus trap and Escape for free).
- Visible cobalt focus ring, AA contrast tokens.
- SplitText keeps `aria-label` on split text.
- Alt text is a required field on every image, and placeholders announce themselves.
- No information conveyed by motion alone.

**Performance budgets** (mobile, 4G):

| Metric                | Budget                                                                  |
| --------------------- | ----------------------------------------------------------------------- |
| LCP                   | < 2.5s                                                                  |
| CLS                   | < 0.05 (placeholders and images reserve true aspect ratios)             |
| JS (first load, home) | < 220 KB gzip (modern browsers; excludes the `nomodule` polyfill chunk) |

**Measured in Phase 1** (`pnpm build`, home): about 200 KB gzip. That breaks down as React/Next runtime about 133 KB, GSAP with ScrollTrigger/SplitText/DrawSVG/CustomEase about 51 KB, Lenis about 10 KB, and app code a few KB.

GSAP is registered in one module (`lib/motion/gsap.ts`) imported by the header, so it ships with every route. That is acceptable at this size. If later routes push past budget, the header's hide-on-scroll can move to a small scroll listener, and plugins can register per route.

Images go through `next/image` with explicit `sizes`, `preload` only for the LCP image, and AVIF/WebP.
