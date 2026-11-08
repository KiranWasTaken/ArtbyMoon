# 08 · CMS guide (Sanity)

This guide has two parts:

- **Part A: for ArtbyMoon.** How to add and change things on the website, step by step. No code.
- **Part B: setup and technical notes.** For whoever sets up the Sanity project and deploys the site (one-time).

> **Status:** the ArtbyMoon Sanity project is connected and the first artworks are published. **The webhook (Part B §7) and deployment (§11) are not set up yet.** Without the Sanity variables, the website uses the local content files and `/studio` shows "Studio not set up yet".

---

## Part A: editing the website (for ArtbyMoon)

The **Studio** is where you edit the website. Everything you publish there appears on the site by itself, usually within a minute. You can't break the design: you fill in fields, and the website lays them out.

**A few things that apply everywhere**

- **Publish** (bottom right) makes a change live. Until you press it, your changes are a private **draft** that only editors can see.
- **"Describe the picture"** is required for every image. Write one plain sentence about what is in it, e.g. "Orange poppies against a pale blue sky, acrylic on canvas". People using screen readers hear this, and search engines read it.
- **"Web address"**: click **Generate** after typing the title. It becomes part of the link (e.g. `/artworks/canvas/autumn-poppies`). **Don't change it after publishing**, or old links stop working. Two pieces can't share the same web address; the Studio warns you.
- Fields marked _Optional_ can be left empty: the website simply leaves them out. Nothing is ever filled in for you.
- **Display order**: smaller numbers come first (10, 20, 30… leaves room to slot things in between). Empty means "after the numbered ones".

### 1. Log in

1. Go to **`https://<the website address>/studio`** (for example `https://www.your-domain.com/studio`). While testing on a computer, it's `http://localhost:3000/studio`.
2. Sign in with the Google account, GitHub account or email you were invited with.
3. On the left you'll see **Artist profile, Artworks, Collections, Photography, Paint with Moon, Journal**.

### 2. Add a new painting

1. Click **Artworks → By collection**, choose the collection (e.g. _Canvas paintings_), then the **+** (pencil) button. The collection is already selected for you.
   _(Or **Artworks → All artworks → +** and choose the collection yourself.)_
2. **Title**: the name of the piece. Leave empty if it has none; the site then calls it by the collection's name for one piece (e.g. "Canvas painting").
3. **Web address**: click **Generate**.
4. **Main photograph**: upload the photo (see step 3).
5. Fill in what you know under **Details** (medium, size, year, subjects, availability) and **Words** (description, your note). Leave out anything you're unsure of.
6. Press **Publish**.

### 3. Upload artwork photos

- Use the best photo you have: **at least 2000 pixels on the long side**, straight-on, evenly lit, with no frame or background cropped in (see [07 · Photographing your work](07-photographing-your-work.md)).
- **Main photograph**: drag the file onto the box, or click **Upload**. Then fill in **Describe the picture**.
- **More photographs** (optional): details, the back, the piece on a wall. Each one needs its own description; **Short label** is e.g. "Detail".
- You only upload once. The website automatically makes small, fast versions for phones and keeps the full-size one for the zoomed view.
- Remove location data from phone photos if you'd rather not share where they were taken.

### 4. Choose the collection

- Every artwork belongs to exactly one collection: **Collection** field, top of the artwork.
- The collection decides where it appears (e.g. `/artworks/polaroids`) and how it's framed: polaroids get the white polaroid frame and handwritten caption, bookmarks hang from a line, and so on.
- To **move** a piece, choose a different collection and publish. Its link changes to the new collection.
- **New collection** (e.g. "Greeting cards"): **Collections → +**. Give it a name, generate the web address, choose a **Display style** (which existing look it borrows), set the display order, publish. It appears on the Artworks page automatically.

### 5. Add descriptions and captions

All in the artwork's **Words** tab:

- **Handwritten caption (polaroids)**: the words written on the polaroid. Shown in handwriting style.
- **Description**: a factual sentence or two about the piece.
- **Your note**: optional, in your own voice (what inspired it, how it was made).
- **Search & sharing** tab (optional): a different title or short description for Google and for link previews on WhatsApp/Instagram. If empty, the title and description are used.

### 6. Feature an artwork on the homepage

1. Open the artwork and switch on **Feature on the homepage**. Publish.
2. It appears in the homepage section for its collection, in its **Display order**.
3. To see everything that's featured: **Artworks → Featured on homepage**. Switch it off on any piece to remove it.
4. Collections can also be featured (**Collections → open one → Feature on the homepage**): featured collections are listed first.

### 7. Add photographs (Photography page)

1. **Photography → +**.
2. Upload the **Photograph** and describe it.
3. Optional: title (then **Generate** the web address), caption, place (a city or park, **never a home address**), date taken, category, **More frames**.
4. **Feature on the homepage** puts it in the homepage photography strip.
5. Publish. Category filters appear on the page by themselves once there are enough photographs in two or more categories.

### 8. Update your biography

1. Click **Artist profile** (there is only one).
2. **About you**: name, introduction (one or two sentences), biography (paragraphs; you can make words bold, italic or a link), portrait photo with optional caption.
3. **Your practice**: practice, materials and techniques (type one, press Enter), inspirations, "How you work, in your words".
4. **Contact**: your Instagram profile link (e.g. `https://www.instagram.com/art.by.moon_/`) and any other contact details you want public (label, what's displayed, optional `https://` or `mailto:` link). They appear on the **Contact page**, and its "Message" buttons open a direct message to that Instagram account. Leave Instagram empty to keep the current account.
5. Publish. Empty sections are hidden on the About page.

### 9. Publish a Paint with Moon session

Paint with Moon is the name of your workshops. Each session is one entry.

1. **Paint with Moon → +**.
2. **Session** tab: title, **Generate** web address, **Status** (_To be announced_, _Booking open_, _Waitlist_, _Fully booked_, _Past_), description, optional cover image.
3. **When & where**: date and start time, **time zone** where it happens (e.g. `Asia/Kathmandu`, `Europe/London`) so the time displays correctly, duration in minutes, venue (or "Online").
4. **Booking**: price and currency (e.g. `NPR`, `GBP`), optional price note, maximum seats, "Book by" date, and the **Booking link** to where people actually book (an Eventbrite/Luma/Google Form page). **Bookings and payments don't happen on this website.** No link? Fill in "How to book" instead, e.g. "Message me on Instagram to reserve a seat".
5. Publish. When it's over, set Status to **Past** to take it off the upcoming list.

### 10. Create a journal post

1. **Journal → +**.
2. Title, **Generate** web address, **Publication date**, categories, optional cover image, **Short introduction** (shown in the list).
3. **Post**: write the text. Use **Heading** for sections, **Quote** for quotes, and the image button to add pictures (each needs a description).
4. Publish. A post with a **future publication date** stays hidden and appears on its own after that date (within about an hour).

### 11. Preview before publishing

1. Open the piece you're editing and click **Preview** at the top of the Studio (the eye/"Preview" tool).
2. The real website opens beside your form, showing your **unpublished** changes, with a blue **"Previewing unpublished changes · Exit preview"** label at the bottom.
3. Only signed-in editors can see this; visitors and Google never do. You can preview new pieces that have never been published, and journal posts that have no publication date yet.
4. Happy? Press **Publish**. Not happy? Use the **⋯ menu → Discard changes** to go back to the published version.

**Unpublish or delete:** in the ⋯ menu next to Publish. _Unpublish_ takes it off the website but keeps your draft; _Delete_ removes it completely. Either way the website updates by itself.

**If something doesn't update after a few minutes**, tell your developer: there is a manual refresh (Part B §9).

---

## Part B: setup and technical notes

### 1. Architecture

```
Editors ─► Sanity Studio (/studio, embedded; editors sign in with their own Sanity account)
                │ publish
                ▼
        Sanity Content Lake ──webhook (signed)──► /api/revalidate ─► expire changed data + its pages
                │                                                     │
                │ server-side GROQ (published only, no token)         ▼
                └──────────────► Next.js 'use cache' (tags) ─► static / ISR pages ─► visitors
Images: <img srcset> → cdn.sanity.io (resized, AVIF/WebP) directly from the browser
404s:   src/proxy.ts → /api/routes (static list of published URLs, expired by the webhook)
```

- No custom database or API server. Sanity is the only content backend; Vercel hosts the site.
- The browser **never** queries Sanity: content is fetched on the server and cached by Next.js (`src/sanity/fetch.ts`). Only images come from Sanity's CDN.
- Content layer: `src/lib/content/source.ts` chooses **Sanity** when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, else the **local files** in `src/content/artist/`. Pages and components are identical either way.

| File                                    | Role                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `sanity.config.ts`                      | Studio configuration (tools, templates, singleton rules, preview)       |
| `src/sanity/schemaTypes/*`              | Content types and validation                                            |
| `src/sanity/structure.ts`               | Studio sidebar                                                          |
| `src/sanity/queries.ts` · `map.ts`      | GROQ queries · mapping to the site's types                              |
| `src/sanity/source.ts` · `fetch.ts`     | Sanity content source · cached fetch with tags                          |
| `src/sanity/revalidate.ts`              | What each document type affects (data tags, pages)                      |
| `src/app/api/revalidate/route.ts`       | Webhook endpoint                                                        |
| `src/app/api/draft-mode/*`              | Editor preview: enable, disable, status                                 |
| `src/proxy.ts` + `src/app/api/routes/*` | Real 404 status: published URL list (and a draft list for editors only) |
| `src/lib/content/contact.ts`            | Contact page details from the artist profile                            |

### 2. Credentials at a glance (least privilege)

| What                       | Where it comes from                                    | Secret?                     | Needed for                                | Stored in                                                                                          |
| -------------------------- | ------------------------------------------------------ | --------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Project ID**             | sanity.io/manage → project page                        | No (public identifier)      | Everything                                | `NEXT_PUBLIC_SANITY_PROJECT_ID`, local and Vercel                                                  |
| **Dataset name**           | `production` (created with the project)                | No                          | Everything                                | `NEXT_PUBLIC_SANITY_DATASET`, local and Vercel                                                     |
| **Public read access**     | dataset visibility **Public**                          | No credential at all        | The website reading _published_ content   | nothing to store                                                                                   |
| **Viewer token**           | sanity.io/manage → API → Tokens, permission **Viewer** | **Yes** (read-only)         | Draft Mode preview only                   | `SANITY_API_READ_TOKEN` on Vercel (and locally to test preview)                                    |
| **Webhook signing secret** | you generate it (command in §3)                        | **Yes**                     | Verifying that webhook calls are genuine  | `SANITY_REVALIDATE_SECRET` on Vercel and in the Sanity webhook; locally only for `pnpm revalidate` |
| **Studio editor login**    | each person's own Sanity account (project Members)     | Personal; never stored here | Editing in `/studio`; seeding collections | the browser session / `sanity login`, nowhere in the code                                          |
| _Editor token (optional)_  | API → Tokens, permission **Editor**                    | **Yes, can write**          | Only the `--token` seeding alternative    | your shell for one command, then delete the token. **Never on Vercel**                             |

- The public website needs **no token**: it only reads published content from a Public dataset. Drafts can never be read without a token, even in a Public dataset.
- The only token on Vercel is the **Viewer** token (read-only). In normal operation **no write token exists anywhere**: editors write through the Studio with their own login.
- Nothing secret is ever `NEXT_PUBLIC_`: the build fails if a `NEXT_PUBLIC_` variable looks like a token or secret, and `pnpm check:build` scans the build output for the secret values.

### 3. Create the Sanity project (one time; needs your Sanity login)

1. Sign in at **https://www.sanity.io/manage** (create a free account if needed). This account owns the project.
2. **Create new project** → name "ArtbyMoon" → free plan. Copy the **Project ID** (shown on the project page; lowercase letters and digits).
3. **Datasets**: keep the default `production` dataset and check that its visibility is **Public**.
4. **Members → Invite**: ArtbyMoon, role **Administrator** or **Editor**. She signs in to the Studio with that account; no token is involved.
5. **API → CORS origins → Add CORS origin**, each with **Allow credentials ✓** (required for signing in to the embedded Studio):
   - `http://localhost:3000` (local Studio)
   - the production origin, e.g. `https://www.her-domain.com`, once the domain is confirmed
6. **API → Tokens → Add API token**: name "Website preview", permission **Viewer**. Copy it (it isn't shown again) → `SANITY_API_READ_TOKEN`.
7. Generate the webhook signing secret on your computer:
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` → `SANITY_REVALIDATE_SECRET`.

### 4. Environment variables

**Local** (`.env.local` in the project folder; git-ignored):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<viewer token>        # only to test Draft Mode locally
SANITY_REVALIDATE_SECRET=<the secret>       # only to run pnpm revalidate locally
```

**Vercel** (Project → Settings → Environment Variables):

| Variable                        | Production                 | Preview deployments                             |
| ------------------------------- | -------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | the confirmed https domain | leave unset (previews are noindex)              |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | project ID                 | same, or unset to use the local files           |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`               | same                                            |
| `SANITY_API_READ_TOKEN`         | Viewer token               | same, only if you preview drafts there          |
| `SANITY_REVALIDATE_SECRET`      | the secret                 | same (harmless: the webhook targets production) |
| `SANITY_API_WRITE_TOKEN`        | **do not set**             | **do not set**                                  |

`pnpm build:production` and Vercel production builds refuse a Sanity build without `SANITY_REVALIDATE_SECRET`, and any build refuses a secret-looking `NEXT_PUBLIC_` variable.

### 5. First-time content setup (no token needed)

```bash
pnpm exec sanity login                      # once: your own Sanity account, in the browser
pnpm sanity:seed-collections --dry-run      # shows the five collection records
pnpm sanity:seed-collections                # creates them with your login (never overwrites)
```

This creates only Canvas paintings, Abstract, Polaroids, Sketches and Bookmarks with their web addresses and display styles, so the existing URLs keep working. No descriptions, images, artworks or sample content are uploaded; ArtbyMoon adds those in the Studio. Until she writes collection introductions there, the previous labelled draft text is shown.

_Alternatives:_ create the five collections by hand in the Studio (Collections → +, with the web addresses `canvas`, `abstract`, `polaroids`, `sketches`, `bookmarks`), or run `pnpm sanity:seed-collections --token` with a temporary Editor token in `SANITY_API_WRITE_TOKEN` (delete the token afterwards).

### 6. Studio commands

- **Embedded Studio** (default): `pnpm dev` → http://localhost:3000/studio; deployed with the site at `/studio`.
- The Studio's JavaScript (~2 MB) loads **only** on `/studio`; `pnpm check:build` fails if a public page's JavaScript exceeds its budget.
- Optional standalone Studio on `<name>.sanity.studio`: `pnpm exec sanity deploy` (with the two `NEXT_PUBLIC_SANITY_*` variables set in the shell). Not required.
- Schema changes take effect when the site is rebuilt and redeployed.

### 7. Webhook (on-demand revalidation)

sanity.io/manage → project → **API → Webhooks → Create webhook**:

| Setting     | Value                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------- |
| Name        | Website revalidation                                                                      |
| URL         | `https://<production domain>/api/revalidate`                                              |
| Dataset     | `production`                                                                              |
| Trigger on  | **Create, Update, Delete**                                                                |
| Filter      | `_type in ["artwork","collection","photograph","workshop","journalPost","artistProfile"]` |
| Projection  | `{_id, _type, "slug": slug.current, "collection": collection->slug.current}`              |
| Drafts      | **off** (drafts never appear on public pages)                                             |
| Versions    | off                                                                                       |
| HTTP method | POST                                                                                      |
| Secret      | the value of `SANITY_REVALIDATE_SECRET`                                                   |

Requests without a valid signature get 401 and change nothing. Draft IDs are ignored. _Unpublish_ and _Delete_ both arrive as a Delete event.

### 8. Revalidation behaviour

When a signed webhook arrives, the endpoint:

1. checks that Sanity is reachable (see Outages below);
2. **expires immediately** (no stale copy) the changed type's data, and the pages that show it;
3. answers 200: from then on, the next request on any server gets the new content;
4. requests those pages once in the background, so visitors find them already rebuilt.

| Change         | Data fetched again | Pages expired                                                                                         |
| -------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| Artwork        | `artwork`          | `/`, `/artworks`, `/about`, sitemap, and **every collection and artwork page** (neighbours, old slug) |
| Collection     | `collection`       | same as artwork                                                                                       |
| Photograph     | `photograph`       | `/`, `/photography`                                                                                   |
| Workshop       | `workshop`         | `/`, `/workshops`                                                                                     |
| Journal post   | `journal`          | `/`, `/journal`, sitemap, every post page                                                             |
| Artist profile | `profile`          | `/about`, `/contact`                                                                                  |

Only the changed type is fetched again from Sanity; other content stays cached, so re-rendering the expired pages is cheap.

- **New URLs work immediately; removed ones are 404 immediately.** The proxy decides 404s from `/api/routes`, a static list of published URLs that carries the artwork, collection and journal tags, so it is rebuilt on the first request after a publish, on every server. This covers new, renamed, deleted and unpublished artworks; new and changed collections; and new, renamed and removed journal posts.
- Every cached query also refreshes in the background after **1 hour**: a safety net for a missed webhook, and the moment scheduled journal posts appear.
- **Outages:** if Sanity can't be reached when a webhook arrives, the endpoint only marks the data stale (answers 202) and keeps every cached page; the change appears once Sanity answers again (or run `pnpm revalidate … --all`). At other times an outage simply leaves cached pages in place. Errors are logged (`[sanity]`, `[proxy]`, `[revalidate]` in Vercel logs). Sanity requests are bounded (2 retries, 10-second timeout). A page that was never cached shows a "couldn't load just now" message (noindex). A deploy while Sanity is down fails the build instead of publishing empty pages.
- Redelivered webhooks are harmless.

**Local development (`pnpm dev`).** Sanity's webhook can't reach `localhost`, so a local server isn't told about publishes. `next dev` keeps cached Sanity results in memory and serves them until they're refreshed (restarting `pnpm dev` empties that memory, which is why a restart "fixes" it). After publishing, use either:

- `pnpm revalidate http://localhost:3000 --all` (or a single type, e.g. `artwork <slug> <collection>`): the same signed request as the webhook; needs `SANITY_REVALIDATE_SECRET` in `.env.local`; or
- a **hard reload** of the page (Ctrl+Shift+R / Cmd+Shift+R). In `next dev` only, this refetches the page's cached data and the URL list used for 404s. A normal reload doesn't.

Without either, local content refreshes on the hourly schedule, like production without a webhook. Caching itself is not switched off in development, so local behaviour stays close to production.

### 9. Manual revalidation (fallback)

If a webhook delivery failed (sanity.io/manage → API → Webhooks → the webhook → attempts log), run from the project with `SANITY_REVALIDATE_SECRET` in `.env.local`:

```bash
pnpm revalidate https://<production domain> --all
pnpm revalidate https://<production domain> artwork <slug> <collection-slug>
```

Redeploying on Vercel also rebuilds every page from current content.

### 10. Draft Mode preview

- The Studio's **Preview** tool calls `/api/draft-mode/enable` with a short-lived secret that Sanity creates for the signed-in editor. The route checks it against the dataset with the Viewer token; missing or wrong secrets get **401** and nothing changes. Only same-site paths are used as the destination.
- In Draft Mode, pages fetch with the drafts perspective using the server-only token. Responses are `private, no-store`, marked **noindex**, and never written to the shared cache.
- Status codes match what the editor sees: genuine unpublished pieces and posts (including posts with no date) answer **200**, unknown slugs answer **404**. The proxy asks `/api/routes/preview` for the draft URL list, which answers only for a Draft Mode cookie that Next.js accepts as genuine (**401** otherwise). A hand-made cookie therefore gets ordinary published pages, real 404s and no drafts.
- The "Previewing" banner appears only after `/api/draft-mode/status` confirms the session.
- `/api/draft-mode/disable` (and "Exit preview") turns Draft Mode off and clears the banner cookie.
- Separate from `?review` (which highlights unapproved interface copy).
- Without `SANITY_API_READ_TOKEN`, the enable route answers 501.

### 11. Deployment (Vercel)

1. Import the project into Vercel (framework: Next.js; install `pnpm install`; build `pnpm build`).
2. Set the variables in §4. Production builds on Vercel run the strict checks automatically.
3. Deploy, then add the production origin to Sanity's CORS origins (§3, step 5) and create the webhook (§7) pointing at the production domain.
4. Run the checks in §13.
5. If Vercel Deployment Protection is on for preview deployments, the proxy's internal request to `/api/routes` may be refused there. Requests are then let through: on protected previews only, unknown URLs show the 404 page with status 200 and noindex. Production is unaffected.

### 12. Local fallback

- No `NEXT_PUBLIC_SANITY_PROJECT_ID` → the site reads `src/content/artist/*` exactly as in earlier phases; `/studio` shows setup instructions; the webhook and preview routes answer "not configured".
- `pnpm preview:sample` (sample images, never deployable) uses the local source.
- Switching sources needs a rebuild or restart.

### 13. What has been tested, and what to check with the real project

**Tested locally against a mock of Sanity's HTTP API** (test-only `SANITY_API_HOST`, which production builds refuse): content on every page, CDN image URLs, published versus draft perspective, webhook signatures (unsigned, forged, wrong secret, tampered body), immediate availability after a webhook for new, renamed and deleted artworks, new collections, new journal posts, photographs and workshops, Contact page updates from the profile, Draft Mode (genuine versus hand-made cookie, unpublished pieces, undated posts, unknown slugs, exit), the sitemap, 404s, and an outage at the moment of a publish.

**Not tested (needs the real project):** Studio sign-in and CORS, real image uploads and CDN responses, the Studio Preview tool's secret flow end to end, a real webhook delivery and signature, `pnpm sanity:seed-collections` with a real login, and Vercel's shared cache across servers.

After setup, check:

1. `/studio` opens and ArtbyMoon can sign in.
2. Seed the collections (§5): they appear in the Studio, and `/artworks` still works.
3. Create a test artwork in a collection and click **Preview**: it shows with the blue banner. Publish it: the webhook's attempt log shows **200**, and its URL opens straight away.
4. Unpublish it: its URL is a 404 within seconds. Then delete it.
