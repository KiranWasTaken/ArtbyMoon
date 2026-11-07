import { notFound } from "next/navigation";

/** Static 404 target for unknown journal posts (src/proxy.ts). */
export default function MissingJournalPost() {
  notFound();
}
