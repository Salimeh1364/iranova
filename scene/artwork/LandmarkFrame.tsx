"use client";

import type { IranLandmark } from "@/content/iranLandmarks";
import { useI18n } from "@/i18n/I18nProvider";
import { RaisedFrame, openingAspect } from "@/scene/artwork/RaisedFrame";
import { useNameplate } from "@/scene/artwork/nameplate";
import { usePhotoMap } from "@/scene/artwork/usePhotoMap";
import { selectLandmark } from "@/scene/controls/figureSession";

export type LandmarkFrameProps = {
  landmark: IranLandmark;
};

/**
 * A wide white frame for a landmark photograph.
 * The crop is centered unless the landmark sets `coverBias`.
 * Clicking opens the description in the active language.
 */
export function LandmarkFrame({ landmark }: LandmarkFrameProps) {
  const { locale } = useI18n();
  const copy = landmark.copy[locale];
  const { width, height } = landmark.placement;
  // Slim molding, so the crop uses the thinner border.
  const photo = usePhotoMap(
    landmark.image,
    landmark.placement.seed,
    openingAspect(width, height, true),
    landmark.coverBias ?? 0.5,
  );
  const plate = useNameplate(copy.title, copy.place, locale === "fa");

  return (
    <RaisedFrame
      width={width}
      height={height}
      position={landmark.placement.position}
      rotationY={landmark.placement.rotationY}
      map={photo}
      plate={plate}
      slim
      onSelect={() => selectLandmark(landmark.id)}
    />
  );
}
