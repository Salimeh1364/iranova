"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { figures } from "@/content/famousFigures";
import { useI18n } from "@/i18n/I18nProvider";
import { placeholderDataUrl } from "@/scene/artwork/portraitPlaceholder";
import { getSelectedFigureId, selectFigure, subscribeFigure } from "@/scene/controls/figureSession";

/**
 * Side panel for the portrait that was clicked.
 * Copy follows the active language. A missing photograph uses the painted stand-in.
 */
export function FigureBioModal() {
  const { locale, messages } = useI18n();
  const selectedId = useSyncExternalStore(subscribeFigure, getSelectedFigureId, () => null);
  const figure = figures.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (!figure) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectFigure(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [figure]);

  if (!figure) return null;

  const copy = figure.copy[locale];

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
        <p className="figure-kicker">{messages.figures.series}</p>
        <Portrait src={figure.image} seed={figure.placement.seed} name={copy.name} />
        <h2 id="figure-name">{copy.name}</h2>
        <p className="figure-meta">
          {copy.field}
          <span aria-hidden="true"> · </span>
          {copy.years}
        </p>
        <p className="figure-bio">{copy.biography}</p>
      </aside>
    </div>
  );
}

/** Tries the local file, then the painted stand-in. The stand-in cannot 404. */
function Portrait({ src, seed, name }: { src: string; seed: number; name: string }) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <img
      src={current}
      alt={name}
      onError={() => setCurrent(placeholderDataUrl(seed))}
    />
  );
}
