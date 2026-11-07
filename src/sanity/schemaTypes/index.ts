import { artistProfile } from "./artistProfile";
import { artwork } from "./artwork";
import { collection } from "./collection";
import { journalPost } from "./journalPost";
import { photograph } from "./photograph";
import { workshop } from "./workshop";

export const schemaTypes = [
  artistProfile,
  artwork,
  collection,
  photograph,
  workshop,
  journalPost,
];

/** Types with exactly one document, edited in place (no "create new", no delete). */
export const singletonTypes = new Set(["artistProfile"]);
