"use client";

import { HALL } from "@/scene/hall";
import { BrickSurface } from "@/scene/materials/BrickSurface";
import { PlasterSurface } from "@/scene/materials/PlasterSurface";

export type PlasterPierProps = {
  /** Floor-level center of the pier, in world space. */
  position: readonly [number, number, number];
};

const PIER = {
  width: 0.28,
  depth: 0.2,
  capital: 0.16,
} as const;

/**
 * A square plaster pier on the aisle face of an exhibition wall.
 * The capital is one brick course, tying the column to the vault above.
 */
export function PlasterPier({ position }: PlasterPierProps) {
  const [x, , z] = position;
  const shaftHeight = HALL.wallHeight - PIER.capital;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, shaftHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PIER.width, shaftHeight, PIER.depth]} />
        <PlasterSurface />
      </mesh>
      <mesh position={[0, HALL.wallHeight - PIER.capital / 2, 0]} castShadow>
        <boxGeometry args={[PIER.width + 0.06, PIER.capital, PIER.depth + 0.04]} />
        <BrickSurface bumpScale={0.025} roughness={0.72} />
      </mesh>
    </group>
  );
}
