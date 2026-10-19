"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export function GalleryChrome({ children }: { children: React.ReactNode }) {
  const { messages } = useI18n();

  return (
    <div className="gallery-stage">
      {children}
      {/* Floats above the canvas. The stage itself has no solid bar, so the hall fills the viewport. */}
      <div className="gallery-overlay">
        <div className="gallery-title-block">
          <p className="gallery-kicker">{messages.gallery.kicker}</p>
          <h1 id="gallery-title">{messages.gallery.title}</h1>
          <p className="gallery-subtitle">{messages.gallery.subtitle}</p>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
