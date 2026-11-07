import type { ComponentPropsWithoutRef, ElementType } from "react";
import type { Copy } from "@/content/types";

type CopyTextProps<T extends ElementType> = {
  copy: Copy;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "children">;

/**
 * Renders a line of copy and tags drafts with data-draft, which `?review`
 * mode highlights (globals.css). Keeps unapproved wording findable in the
 * DOM as well as in src/content/copy.
 */
export function CopyText<T extends ElementType = "span">({
  copy,
  as,
  ...props
}: CopyTextProps<T>) {
  const Tag: ElementType = as ?? "span";
  return (
    <Tag {...props} data-draft={copy.status === "draft" ? "" : undefined}>
      {copy.text}
    </Tag>
  );
}
