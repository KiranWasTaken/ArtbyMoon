import { CalendarIcon } from "@sanity/icons/Calendar";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { FolderIcon } from "@sanity/icons/Folder";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { StarIcon } from "@sanity/icons/Star";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

/**
 * The Studio's left-hand menu, in the order ArtbyMoon uses it: her profile,
 * then her work, then announcements.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("ArtbyMoon's studio")
    .items([
      S.listItem()
        .title("Artist profile")
        .icon(UserIcon)
        .child(
          S.document()
            .schemaType("artistProfile")
            .documentId("artistProfile")
            .title("Artist profile"),
        ),
      S.divider(),
      S.listItem()
        .title("Artworks")
        .icon(ImageIcon)
        .child(
          S.list()
            .title("Artworks")
            .items([
              S.listItem()
                .title("All artworks")
                .icon(ImageIcon)
                .child(
                  S.documentTypeList("artwork")
                    .title("All artworks")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("By collection")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("collection")
                    .title("Choose a collection")
                    .child((collectionId) =>
                      S.documentList()
                        .title("Artworks")
                        .schemaType("artwork")
                        .filter(
                          '_type == "artwork" && collection._ref == $collectionId',
                        )
                        .params({ collectionId })
                        .defaultOrdering([{ field: "order", direction: "asc" }])
                        .initialValueTemplates([
                          S.initialValueTemplateItem("artwork-in-collection", {
                            collectionId,
                          }),
                        ]),
                    ),
                ),
              S.listItem()
                .title("Featured on homepage")
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title("Featured artworks")
                    .schemaType("artwork")
                    .filter('_type == "artwork" && featured == true'),
                ),
            ]),
        ),
      S.documentTypeListItem("collection")
        .title("Collections")
        .icon(FolderIcon),
      S.documentTypeListItem("photograph")
        .title("Photography")
        .icon(ImagesIcon),
      S.divider(),
      S.documentTypeListItem("workshop")
        .title("Paint with Moon")
        .icon(CalendarIcon),
      S.documentTypeListItem("journalPost")
        .title("Journal")
        .icon(DocumentTextIcon),
    ]);
