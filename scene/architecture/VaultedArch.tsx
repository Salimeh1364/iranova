"use client";

import { useMemo } from "react";
import { ExtrudeGeometry } from "three";
import { palette } from "@/lib/palette";
import { BAY_DEPTH, HALL, INNER_SPAN } from "@/scene/hall";
import { createArchBandShape } from "@/scene/geometry/archProfile";
import { tileByPosition } from "@/scene/geometry/surfaceUvs";
import { BrickSurface } from "@/scene/materials/BrickSurface";

export type VaultedArchProps = {
  /** World Z of the bay's entrance edge. The bay extends toward -Z. */
  z: number;
};

/** Rounder than a flat lid, still wider than a semicircle, so the soffit reads as a vault. */
const VAULT_CURVE = { shoulder: 0.46, lift: 0.52 };

/**
 * One bay of the brick vault.
 * The profile is extruded along local Z, then lifted so the springs sit on the side walls.
 * Curve segments stay high so the soffit is a continuous curve rather than a faceted tube.
 */
export function VaultedArch({ z }: VaultedArchProps) {
  const shell = useMemo(() => {
    const shape = createArchBandShape(INNER_SPAN / 2, HALL.vaultRise, HALL.vaultThickness, VAULT_CURVE);
    const geometry = new ExtrudeGeometry(shape, {
      depth: BAY_DEPTH,
      bevelEnabled: false,
      curveSegments: 48,
    });
    // ExtrudeGeometry grows toward +Z. Shift it so the bay occupies [z - bay, z].
    geometry.translate(0, 0, -BAY_DEPTH);
    const half = INNER_SPAN / 2;
    tileByPosition(
      geometry,
      (x) => (x / half) * 11,
      (_x, _y, z) => (z / BAY_DEPTH) * 8,
    );
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const rib = useMemo(() => {
    const shape = createArchBandShape(
      INNER_SPAN / 2,
      HALL.vaultRise,
      HALL.vaultThickness * 0.55,
      VAULT_CURVE,
    );
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.18,
      bevelEnabled: false,
      curveSegments: 40,
    });
    geometry.translate(0, 0, -0.09);
    const half = INNER_SPAN / 2;
    tileByPosition(
      geometry,
      (x) => (x / half) * 11,
      (_x, _y, z) => z * 6,
    );
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group position={[0, HALL.wallHeight, z]}>
      <mesh geometry={shell} castShadow receiveShadow>
        <BrickSurface
          bumpScale={0.07}
          roughness={0.72}
          emissive={palette.sunlight}
          emissiveIntensity={0.2}
          doubleSided
        />
      </mesh>
      <mesh geometry={rib} position={[0, -0.015, 0]} castShadow>
        <BrickSurface bumpScale={0.03} roughness={0.7} color="#f0e2cc" />
      </mesh>
      {/* Cove light under the crown. No shadow map: the sun already shadows the hall. */}
      <pointLight
        position={[0, HALL.vaultRise * 0.35, -BAY_DEPTH / 2]}
        intensity={1.8}
        distance={8}
        decay={2}
        color={palette.sunlight}
      />
    </group>
  );
}
