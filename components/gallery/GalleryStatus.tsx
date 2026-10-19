"use client";

import { useI18n } from "@/i18n/I18nProvider";

type GalleryStatusProps = {
  kind: "loading" | "unavailable";
};

export function GalleryStatus({ kind }: GalleryStatusProps) {
  const { messages } = useI18n();
  const text = kind === "loading" ? messages.gallery.loading : messages.gallery.unavailable;

  return (
    <div className="gallery-status" role="status">
      <p>{text}</p>
    </div>
  );
}
