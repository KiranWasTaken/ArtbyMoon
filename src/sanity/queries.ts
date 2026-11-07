/**
 * GROQ queries. Each returns plain data shaped for src/sanity/map.ts.
 * Incomplete documents (no slug, no collection, no image) are filtered out
 * here, so a half-finished entry can never break a page.
 */

/** Image fields: CDN URL, true pixel size, alt text, blur preview, dominant colour. */
const IMAGE = `{
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  "color": asset->metadata.palette.dominant.background
}`;

export const collectionsQuery = /* groq */ `
*[_type == "collection" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
  "slug": slug.current,
  "title": name,
  singular,
  style,
  intro,
  featured,
  "cover": cover${IMAGE}
}`;

export const artworksQuery = /* groq */ `
*[_type == "artwork" && defined(slug.current) && defined(collection->slug.current) && defined(image.asset)]
| order(coalesce(order, 999) asc, _createdAt asc) {
  "id": _id,
  "slug": slug.current,
  "collection": collection->slug.current,
  title, year, medium, dimensions, subjects, series, availability,
  featured, order, caption, description, note, seoTitle, seoDescription,
  "image": image${IMAGE},
  "gallery": gallery[defined(asset)]{ caption, "image": @${IMAGE} }
}`;

export const photographsQuery = /* groq */ `
*[_type == "photograph" && defined(image.asset)] | order(coalesce(order, 999) asc, takenAt desc, _createdAt desc) {
  "id": _id,
  "slug": slug.current,
  title, caption, location, takenAt, category, featured, order,
  "image": image${IMAGE},
  "gallery": gallery[defined(asset)]${IMAGE}
}`;

export const workshopsQuery = /* groq */ `
*[_type == "workshop" && defined(slug.current)] | order(startsAt asc) {
  "slug": slug.current,
  title, status, description, startsAt, timeZone, durationMinutes, venue,
  price, currency, priceNote, maxSeats, registrationDeadline, bookingUrl, bookingNote,
  "cover": cover${IMAGE}
}`;

/**
 * Posts whose publication date has arrived (scheduled posts appear on time,
 * within the hourly revalidation). In Draft Mode ($preview) undated and
 * scheduled drafts are included so editors can preview them; an undated
 * draft shows today's date in the preview only.
 */
const DUE = `((defined(publishedAt) && publishedAt <= now()) || $preview)`;
const PUBLISHED_AT = `"publishedAt": coalesce(publishedAt, now())`;

export const journalPostsQuery = /* groq */ `
*[_type == "journalPost" && defined(slug.current) && ${DUE}]
| order(coalesce(publishedAt, now()) desc) {
  "slug": slug.current,
  title, categories, ${PUBLISHED_AT}, excerpt, seoTitle, seoDescription,
  "cover": cover${IMAGE}
}`;

export const journalPostQuery = /* groq */ `
*[_type == "journalPost" && slug.current == $slug && ${DUE}][0] {
  "slug": slug.current,
  title, categories, ${PUBLISHED_AT}, excerpt, seoTitle, seoDescription,
  "cover": cover${IMAGE},
  body[]{
    ...,
    _type == "image" => { ..., "image": @${IMAGE} }
  }
}`;

export const profileQuery = /* groq */ `
*[_type == "artistProfile"][0] {
  name, intro, biography, instagramUrl, practice, materials, inspirations, approach,
  contact[]{ label, value, href },
  "portrait": portrait{ caption, "image": @${IMAGE} }
}`;
