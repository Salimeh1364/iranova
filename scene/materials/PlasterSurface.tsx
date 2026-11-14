"use client";

import { useMemo } from "react";
import { palette } from "@/lib/palette";
import { getPlasterBump } from "@/scene/materials/surfaces";

export type PlasterSurfaceProps = {
  /** Wall paint. The airy olive is #a8b8a4. */
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
      // A light grain, so #a8b8a4 is not a flat fill under the spots.
      bumpScale={0.012}
    />
  );
}
