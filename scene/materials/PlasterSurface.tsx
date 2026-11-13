"use client";

import { useMemo } from "react";
import { palette } from "@/lib/palette";
import { getPlasterBump } from "@/scene/materials/surfaces";

export type PlasterSurfaceProps = {
  /** Wall paint. Light olive sage is #8a9a86. */
  color?: string;
  /** 0.85 keeps the olive matte, with just enough tooth to catch the spotlights. */
  roughness?: number;
};

/**
 * Matte gallery paint.
 * Roughness stays high so the olive walls do not mirror the floor.
 */
export function PlasterSurface({ color = palette.plaster, roughness = 0.85 }: PlasterSurfaceProps) {
  const bumpMap = useMemo(() => getPlasterBump(), []);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0}
      bumpMap={bumpMap}
      // A light grain, so #8a9a86 is not a flat fill under the spots.
      bumpScale={0.012}
    />
  );
}
