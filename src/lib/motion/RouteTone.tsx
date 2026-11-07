"use client";

import { useLayoutEffect } from "react";
import { InlineScript } from "@/components/layout/InlineScript";

/**
 * Puts the whole page (header and footer included) in the darkroom tone
 * while this route is shown. The inline script applies it before first paint
 * on a hard load; the layout effect covers client navigation and removes it
 * when the route is left or hidden by <Activity>.
 */
export function RouteTone({ tone }: { tone: "darkroom" }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-tone", tone);
    return () => root.removeAttribute("data-tone");
  }, [tone]);

  return (
    <InlineScript
      html={`document.documentElement.setAttribute("data-tone","${tone}")`}
    />
  );
}
