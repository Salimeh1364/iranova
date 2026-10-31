"use client";

import { useLayoutEffect, useMemo } from "react";
import { DoubleSide, FrontSide, type Side } from "three";
import { useThree } from "@react-three/fiber";
import { getBrickBump, getBrickTexture } from "@/scene/materials/surfaces";

export type BrickSurfaceProps = {
  /** How far the mortar joints sink. Kept small so the vault stays smooth. */
  bumpScale?: number;
  roughness?: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  /** The vault soffit is the inner face of the extrusion, so it needs both sides. */
  doubleSided?: boolean;
};

/**
 * Cream brick with a bump of the same bond.
 * Anisotropy is capped so the grazing view along the vault stays sharp without a full 16x cost.
 */
export function BrickSurface({
  bumpScale = 0.04,
  roughness = 0.8,
  color = "#fff8f0",
  emissive = "#000000",
  emissiveIntensity = 0,
  doubleSided = false,
}: BrickSurfaceProps) {
  const side: Side = doubleSided ? DoubleSide : FrontSide;
  const gl = useThree((state) => state.gl);
  const map = useMemo(() => getBrickTexture(), []);
  const bumpMap = useMemo(() => getBrickBump(), []);

  useLayoutEffect(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    map.anisotropy = anisotropy;
    bumpMap.anisotropy = anisotropy;
  }, [bumpMap, gl, map]);

  return (
    <meshStandardMaterial
      map={map}
      bumpMap={bumpMap}
      bumpScale={bumpScale}
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      roughness={roughness}
      metalness={0}
      side={side}
    />
  );
}
