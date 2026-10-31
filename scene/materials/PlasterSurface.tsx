"use client";

import { useMemo } from "react";
import { palette } from "@/lib/palette";
import { getPlasterBump } from "@/scene/materials/surfaces";

/** Matte gallery plaster. Roughness stays high so the partitions do not mirror the pool. */
export function PlasterSurface() {
  const bumpMap = useMemo(() => getPlasterBump(), []);

  return (
    <meshStandardMaterial
      color={palette.plaster}
      roughness={0.9}
      metalness={0}
      bumpMap={bumpMap}
      bumpScale={0.012}
    />
  );
}
