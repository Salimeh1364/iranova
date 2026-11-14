"use client";

import type { FamousFigure } from "@/content/famousFigures";
import { useI18n } from "@/i18n/I18nProvider";
import { RaisedFrame, openingAspect } from "@/scene/artwork/RaisedFrame";
import { useNameplate } from "@/scene/artwork/nameplate";
import { usePhotoMap } from "@/scene/artwork/usePhotoMap";
import { selectFigure } from "@/scene/controls/figureSession";

export type PortraitFrameProps = {
  figure: FamousFigure;
};

/**
 * A raised white portrait frame.
 * Clicking it opens the biography in the active language.
 * The photograph is cropped from the top so the face fills the opening.
 */
export function PortraitFrame({ figure }: PortraitFrameProps) {
  const { locale } = useI18n();
  const copy = figure.copy[locale];
  const { width, height } = figure.placement;
  // Low bias keeps the head inside the opening. 0 is the top of the photograph.
  const portrait = usePhotoMap(figure.image, figure.placement.seed, openingAspect(width, height), 0.16);
  const plate = useNameplate(copy.name, copy.field, locale === "fa");

  return (
    <RaisedFrame
      width={width}
      height={height}
      position={figure.placement.position}
      rotationY={figure.placement.rotationY}
      map={portrait}
      plate={plate}
      onSelect={() => selectFigure(figure.id)}
    />
  );
}
