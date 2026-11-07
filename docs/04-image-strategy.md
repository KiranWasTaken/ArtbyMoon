# 04 · Image strategy

The site is only as good as the photographs of the work. This is the plan for getting from Instagram screenshots to a production-quality archive, and for working honestly in the meantime.

## 1. The Instagram screenshots are reference only

- They are used to understand palette, subjects, variety and personality. **They are never cropped, upscaled or shipped as gallery images.**
- Keep them in `screenshot/` or `design-reference/`. Both are git-ignored and outside `public/`.
- The Phase 1 reference (a full-page capture of @art.by.moon_) was used for palette calibration and the observations in doc 01.

**What it tells us about formats:** canvases are mostly portrait (about 3:4 or 4:5). Polaroid-style paintings are about 0.82:1 including the white frame. Bookmarks run about 1:3 to 1:3.5, and the 1:3.4 placeholder matches. Greeting cards (Christmas wreaths, Thanksgiving) are portrait cards. For polaroids, photograph **the whole object including the frame and handwritten caption**: the caption is part of the work. Its text goes in `Artwork.caption`, transcribed by ArtbyMoon. The polaroid placeholder shows only a pencilled line where the caption will be.

## 2. Placeholders: honest stand-ins

`<PlaceholderArt kind aspect pigment />` is used everywhere a real image will go.

- **Holds the true aspect ratio.** Layouts are designed against the real proportions (4:5 canvas, 1:3.4 bookmark…), so when the photograph lands there's no layout shift and no redesign.
- **Always labelled:** "Placeholder · Canvas painting · 4:5", announced to screen readers as "Placeholder for a canvas painting… Photograph to come."
- **Material, not imitation.** Placeholders show primed-canvas weave, card stock with a punch hole, or photo paper, with a faint pigment wash. They cannot be mistaken for her paintings.
- **Data-driven.** A placeholder is just `media: { kind: "placeholder", … }` on an artwork record. Swapping in a photo means changing that one field to `{ kind: "image", image }`. Real works go in `src/content/artist/artworks.ts` (with `featured: true` for the homepage). `getHomeContent()` then uses them before any placeholder, slot by slot. Placeholders live in `src/content/placeholder/artworks.ts`.
- **Before launch:** add a check (script or CMS query) that fails if any published record still uses a placeholder.

## 3. Photographing the work

A one-day shoot, done properly once, beats months of phone snaps. Per artwork:

| Shot           | Purpose                                                              | Required?              |
| -------------- | -------------------------------------------------------------------- | ---------------------- |
| **Flat**       | Straight-on, square to the lens, cropped exactly to the painted edge | Yes, the master        |
| **Detail**     | Macro of brushwork or texture                                        | Recommended for canvas |
| **In context** | On an easel or wall, or in hand (bookmarks), for scale               | Recommended            |
| **Back**       | Bookmarks: reverse side (quotes, calligraphy)                        | Yes for bookmarks      |

**Capture guidelines:**

- **Light:** diffuse daylight or two lights at 45°. Use a polariser or angle changes to kill glare on varnish.
- **Colour:** include a grey card or colour checker in one frame per session, and correct colour against it.
- **Camera:** tripod, lens centred and parallel to the canvas. Use 50–90mm equivalent to avoid distortion.
- **Masters:** long edge ≥ 3000px (6000px+ for large canvases), sRGB, JPEG quality 90+, plus RAW or TIFF archived offline.
- **Photography (her own photos):** export sRGB, long edge ≥ 3000px. **Strip EXIF GPS** before upload.
- **Naming:** `{collection}-{slug}-{shot}.jpg`, e.g. `canvas-river-at-dusk-flat.jpg`. The slug comes from the title ArtbyMoon gives; use a temporary id if untitled.

## 4. Metadata: ArtbyMoon supplies the facts

| Field                                   | Source                           | Rule                                                         |
| --------------------------------------- | -------------------------------- | ------------------------------------------------------------ |
| `alt`                                   | Written or approved by ArtbyMoon | **Required.** Describes what is depicted                     |
| `collection`, `width`, `height`         | From the file                    | Required                                                     |
| `title`, `year`, `medium`, `dimensions` | ArtbyMoon                        | Optional. Omitted if unknown, **never guessed**              |
| `subjects`                              | ArtbyMoon or editor              | Tags for filtering                                           |
| `availability`                          | ArtbyMoon                        | Optional (available / sold / not for sale / commission only) |
| `note`                                  | ArtbyMoon's own words            | Optional. Never ghost-written                                |
| `focalPoint`                            | Editor (Sanity hotspot)          | Photography and journal covers only                          |

A simple intake spreadsheet (one row per work, columns as above) is the fastest way to collect this before the CMS exists. It imports cleanly into Sanity later.

## 5. Presentation rules

- **Paintings are never cropped.**
  - Collection grids use each work's true ratio, with spans curated per row.
  - Detail views show the whole work, mounted (paper margin plus hairline).
  - Zoom offers detail.
- **Photography may be cropped** for layout, using a focal point. The full frame is always available in the viewer.
- **Bookmarks** get their own components: the line on the home page, and a front/back pair on detail.
- **No visible watermarks** (they damage the work and are trivially removed). Instead:
  - Serve web derivatives capped around 2400px.
  - Keep masters offline.
  - State copyright in the footer and alt policy.
  - Don't disable right-click (hostile, and ineffective).

## 6. Adding a real artwork (Phase 3a)

1. Export the flat master at ≥ 3000px on the long edge (sRGB, JPEG quality 90+).
2. Put it in `public/images/artworks/` as `{collection}-{slug}-flat.jpg`.
3. Add a record to `src/content/artist/artworks.ts`:
   - **Required:** `id`, `slug` (stable, never reused), `collection`, `media: { kind: "image", image: { src, width, height, alt } }` with the file's real pixel size.
   - **Optional:** `blurDataURL`, `dominantColor` and `original` (a larger master for the full-screen viewer); `title`, `year`, `medium`, `dimensions`, `subjects`, `series`, `availability`, `caption` (polaroids), `description`, `note`; `gallery` (extra views with captions); `order`; `featured` (homepage).
4. Rebuild. The work appears on the overview, its collection, its own page and, if featured, the homepage.

`ArtMedia` is the only component that renders artwork. It never crops, reserves the photo's ratio (no layout shift), shows the dominant colour or blur while loading, and serves AVIF/WebP at the width each layout's `sizes` requests (quality 75 for thumbnails, 85 for detail and full screen).

## 7. Delivery pipeline

- **Phase 2:** local files in `public/images/{artworks,photography}` via `next/image`, with explicit `sizes`, AVIF/WebP and blur placeholders generated at build time (`plaiceholder` or a small `sharp` script).
- **Phase 3:** Sanity assets. `next/image` loader or `@sanity/image-url`, with LQIP and dominant colour from Sanity metadata, and `remotePatterns` set to `cdn.sanity.io`.
- **LCP:** only the first hero image uses `preload`. Everything else lazy-loads.
- **Budget:** about 250 KB for a full-width hero at 2× DPR on mobile; thumbnails under 60 KB.
