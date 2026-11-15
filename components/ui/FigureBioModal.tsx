"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { figures } from "@/content/famousFigures";
import { landmarks } from "@/content/iranLandmarks";
import { useI18n } from "@/i18n/I18nProvider";
import { placeholderDataUrl } from "@/scene/artwork/portraitPlaceholder";
import { getSelectedExhibit, selectFigure, subscribeFigure } from "@/scene/controls/figureSession";

/**
 * Frosted card for the frame that was clicked, figures and landmarks alike.
 * The glass matches the walk prompt. Copy follows the active language.
 * A missing photograph uses the painted stand-in.
 */
export function FigureBioModal() {
  const { locale, messages } = useI18n();
  const selected = useSyncExternalStore(subscribeFigure, getSelectedExhibit, () => null);
  const figure = selected?.kind === "figure" ? figures.find((item) => item.id === selected.id) ?? null : null;
  const landmark = selected?.kind === "landmark" ? landmarks.find((item) => item.id === selected.id) ?? null : null;
  const open = figure ?? landmark;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectFigure(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const copy = open.copy[locale];
  const title = "name" in copy ? copy.name : copy.title;
  const meta = "field" in copy ? `${copy.field} · ${copy.years}` : copy.place;
  const body = "biography" in copy ? copy.biography : copy.description;
  const kicker = figure ? messages.figures.series : messages.landmarks.series;
  const credit = "credit" in open ? open.credit : undefined;

  return (
    <div className="figure-scrim" onClick={() => selectFigure(null)}>
      <aside
        className="figure-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="figure-name"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="figure-close" onClick={() => selectFigure(null)}>
          {messages.figures.close}
        </button>
        <ExhibitPhoto
          src={open.image}
          seed={open.placement.seed}
          name={title}
          landscape={Boolean(landmark)}
        />
        {/* Denser plate than the glass, so the biography stays sharp on the gallery. */}
        <div className="figure-copy">
          <p className="figure-kicker">{kicker}</p>
          <h2 id="figure-name">{title}</h2>
          <p className="figure-meta">{meta}</p>
          <p className="figure-bio">{body}</p>
          {credit ? (
            <p className="figure-credit">
              {messages.figures.photo} {credit}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

/** Tries the local file, then the painted stand-in. The stand-in cannot 404. */
function ExhibitPhoto({
  src,
  seed,
  name,
  landscape,
}: {
  src: string;
  seed: number;
  name: string;
  landscape: boolean;
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <img
      className={landscape ? "landscape" : undefined}
      src={current}
      alt={name}
      onError={() => setCurrent(placeholderDataUrl(seed))}
    />
  );
}
