"use client";

import { useRef } from "react";
import type { Media } from "@/content/types";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { useLenis } from "@/lib/motion/SmoothScroll";

interface ArtworkViewerProps {
  media: Media;
  name: string;
}

/**
 * Full-screen viewing in the darkroom tone: the whole work fitted to the
 * screen (high-resolution original when supplied). A native <dialog> gives
 * focus trapping, Escape to close and focus return for free.
 */
export function ArtworkViewer({ media, name }: ArtworkViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const getLenis = useLenis();

  const open = () => {
    dialog.current?.showModal();
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
  };
  const onClose = () => {
    getLenis()?.start();
    document.documentElement.style.overflow = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="eyebrow ink-link"
        aria-haspopup="dialog"
      >
        View full screen
      </button>
      <dialog
        ref={dialog}
        onClose={onClose}
        aria-label={`${name}, full screen`}
        data-tone="darkroom"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 text-ink opacity-100 transition-opacity duration-(--duration-ui) backdrop:bg-black/80 starting:opacity-0"
      >
        <div className="flex h-full flex-col">
          <div className="page-x flex h-16 shrink-0 items-center justify-between gap-6">
            <p className="truncate font-display text-title">{name}</p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="eyebrow -mr-3 min-h-12 px-3"
              autoFocus
            >
              Close
            </button>
          </div>
          <div className="page-x flex min-h-0 flex-1 items-center justify-center pb-6">
            <ArtMedia
              media={media}
              sizes="100vw"
              quality={85}
              fit="contain"
              className="max-h-full"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
