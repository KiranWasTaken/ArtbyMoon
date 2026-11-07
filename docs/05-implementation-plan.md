# 05 · Implementation plan

## Phase 1: Foundation and direction ✅

- Next.js 16 / React 19 / TS strict / Tailwind 4 / ESLint / Prettier scaffold.
- Design tokens, fonts and the motion layer (GSAP registration, Lenis on GSAP ticker, reveals, tone switching).
- Content model types with placeholder data.
- Home prototype (studio wall, index, bookmark line, darkroom teaser, workshops card), `/design-system` and a 404.
- Docs 01–05.

**Exit criterion:** ArtbyMoon and the team approve the direction, or give feedback on it.

## Phase 2: Homepage completion ✅

- Typed content layer: `content/artist` (genuine), `content/placeholder` (stand-ins and fixtures), `content/copy` (draft/approved), `getHomeContent()` as the single data source.
- Homepage sections: hero (crescent mark), Explore the work, Canvas paintings, **Polaroids (new collection)**, Bookmarks, Photography, Workshops (published and empty states), Journal (published and empty states), closing invitation; slimmer footer.
- `?review` mode highlights draft copy; `/design-system` previews the published workshop and journal states with labelled fixtures.
- QA in headless Chrome (desktop 1440, 1024, tablet 768, phone 390; reduced motion; OS dark preference; keyboard; hover). CLS 0 after switching the bookmark pin to transform pinning.

## Content intake (parallel track, owned by ArtbyMoon)

- [x] Instagram reference screenshot supplied; pigment tokens calibrated from it (doc 02).
- [x] Polaroids become a collection (Phase 2).
- [ ] Decide how seasonal series appear (doc 03).
- [ ] Review all draft copy (`?review`) and approve or rewrite it in `src/content/copy/home.ts`.
- [ ] Photography shoot per `04-image-strategy.md` (start with 15–25 strongest works across all collections).
- [ ] Intake spreadsheet: titles, years, media, sizes, availability, alt text, notes.
- [ ] Her words: hero line, about text, collection intros. Handwriting samples and signature for the wordmark.
- [ ] Decisions: domain, contact email, booking tool. Confirm the Instagram link (set to @art.by.moon_ from the screenshot).

## Phase 3a: Artwork gallery ✅

- `/artworks` (collection shelf and the full gallery wall), `/artworks/[collection]` (five collections, each with its own layout, frame and surface, plus subject filters), `/artworks/[collection]/[slug]` (artwork detail).
- `lib/content/artworks.ts` data layer. The homepage reads artworks through it too.
- Thumbnail → detail shared-element morph with React `<ViewTransition>`; full-screen viewer in a native `<dialog>`.
- True 404 status for unknown collections and artworks via `src/proxy.ts`.
- Sample-content mode (`ARTBYMOON_SAMPLE_CONTENT=1`) for reviewing layouts with watermarked sample images; never on by default.

## Phase 3b: Photography, About, Contact, SEO ✅

- `/photography`: darkroom route (`RouteTone`), editorial journal at natural ratios, category filter (only with ≥ 6 photos and ≥ 2 categories of ≥ 2 each), full-screen viewer (buttons, arrow keys, swipe, Escape, focus returned to the opening photo). Empty state when no photographs exist.
- `/about`: driven by `content/artist/about.ts`; only confirmed context (acrylics on canvas, handmade bookmarks). Biography, materials, inspirations, approach and portrait appear only when supplied.
- `/contact`: no form (no submission service). Instagram DM links plus an enquiry guide: categories, what to include, and a copy-to-clipboard starter message with real success and failure states.
- `/workshops`: minimal page reusing the workshop tickets, so the existing navigation link resolves.
- Navigation: Artworks, Photography, Workshops, About, Contact. Footer adds Home. Journal removed from the nav until it has a page.
- SEO: `sitemap.ts`, `robots.ts`, canonical URLs and Open Graph on every page (`lib/seo.ts`), typographic social card (`opengraph-image.tsx`), site origin from `NEXT_PUBLIC_SITE_URL`; sample-content builds are noindex and blocked in robots.txt.

## Phase 3c: Launch preparation ✅ (device testing still to do)

- Audit for mobile risks. Fixed:
  - pinned bookmarks now pin only with a mouse or trackpad (touch tablets get the native swipe row);
  - the photo viewer allows pinch-zoom;
  - Fraunces italic is no longer preloaded (−149 KB of font preload).
- Production safety:
  - `pnpm build:production` refuses to build without a real https `NEXT_PUBLIC_SITE_URL`, or with sample content;
  - any non-production build is noindex everywhere;
  - `pnpm check:build` verifies there is no sample content and correct SEO origins.
- Docs: [06 device testing](06-device-testing.md) (automated vs. physical checklist), [07 photographing your work](07-photographing-your-work.md) (for ArtbyMoon), README rewritten.

**Still open:**

- The physical-device pass in doc 06 (Android Chrome, iOS Safari, desktop Chrome, iPad).
- The confirmed production domain.
- `/journal` once there are entries.

## Phase 4: CMS and editable content ✅ (Sanity project connected; webhook and deployment pending)

1. ✅ Schemas (artist profile, artworks, collections, photography, workshops, journal) and an embedded Studio at `/studio`.
2. ✅ Workshops (status-driven, external `bookingUrl`, no payments) and Journal (Portable Text, scheduled publication).
3. ✅ Signed webhook → targeted `revalidateTag`, manual `pnpm revalidate`, and Draft Mode preview.
4. ✅ Placeholders are **not** migrated (decision: only genuine content goes into Sanity). `pnpm sanity:seed-collections` creates the five empty collection records only.
5. ⏳ Create the Sanity project, tokens, CORS and webhook, then test with real content ([08 · CMS guide](08-cms-guide.md) Part B). Only mock-API tests have been run so far.

## Phase 5: Polish and launch

- Motion pass on every route (one choreographed moment each), plus reduced-motion review.
- Accessibility audit (keyboard, screen reader, contrast, zoom to 200%) and Lighthouse/WebPageTest against the budgets.
- Real-device testing: iOS Safari (Lenis, `svh`, pinning), Android Chrome, low-end Android.
- Analytics (privacy-friendly, e.g. Vercel Analytics or Plausible), domain, redirects, launch.

## Dependencies

| Dependency                     | Blocks                                                   |
| ------------------------------ | -------------------------------------------------------- |
| Individual artwork photographs | Final collections, detail pages, and real launch quality |
| ArtbyMoon's metadata and copy  | Wall labels, about page, SEO descriptions                |
| Booking tool choice            | Workshop CTAs                                            |
| CMS account (Sanity)           | Phase 4                                                  |

## Technical risks

| Risk                                                                                                                  | Likelihood | Mitigation                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Photography quality is the real bottleneck.** The site amplifies whatever it's given.                               | High       | Shoot guide (doc 04), start small with the best 20 works, placeholders that hold true ratios.                                                                                                                                 |
| **Lenis + ScrollTrigger + `<Activity>` route preservation.** Stale triggers or wrong positions after navigating back. | Medium     | `useGSAP` cleanup on hide; refresh and resize on pathname change; test the back/forward matrix in Phase 3.                                                                                                                    |
| **Pinned sections on iOS Safari** (address-bar resize, `svh`).                                                        | Medium     | Pins only at ≥ 64rem with motion allowed; native scroll rows elsewhere; `invalidateOnRefresh`.                                                                                                                                |
| **View Transitions support varies** (Safari and Firefox partial).                                                     | Medium     | Progressive enhancement: navigation works without the morph.                                                                                                                                                                  |
| **SplitText and font swap** shifting line breaks.                                                                     | Low        | `autoSplit` with animations returned from `onSplit`; chars-only for the hero name.                                                                                                                                            |
| **Shared JS weight** (GSAP and plugins in the root bundle via the header).                                            | Medium     | Measured in Phase 1 at about 200 KB gzip total, with motion libraries about 61 KB (see 03, Performance). If over the 220 KB budget, move the header's scroll logic to a plain scroll listener and register plugins per route. |
| **CMS lock-in.**                                                                                                      | Low        | Content model and data-access seam are CMS-agnostic.                                                                                                                                                                          |
| **Invented content slipping in** (copy, dates, prices).                                                               | Medium     | Optional-field model, visible "to be confirmed" states, and a launch check for placeholders and draft copy.                                                                                                                   |
| **Next.js 16 conventions differ from older docs** (e.g. `cacheComponents`, `preload` replacing `priority`).           | Medium     | Consult `node_modules/next/dist/docs/` (see `AGENTS.md`) before using any API.                                                                                                                                                |
