"use client";

import { palette } from "@/lib/palette";

export type ExteriorStepsProps = {
  /** How many treads drop away from the threshold. */
  count?: number;
  /** Vertical drop of each tread, in meters. */
  rise?: number;
  /** Depth of each tread, in meters. */
  tread?: number;
  /** Width across the doorway, in meters. */
  width: number;
  /** Local Z of the inner edge of the top tread. +Z runs downhill, away from the foyer. */
  startZ?: number;
};

/**
 * Shallow stone steps outside a doorway.
 * The first tread is flush with the floor. Each one beyond it is one rise lower.
 */
export function ExteriorSteps({
  count = 3,
  rise = 0.14,
  tread = 0.46,
  width,
  startZ = 0.05,
}: ExteriorStepsProps) {
  // 7 cm thick, so the edge facing the foyer reads as a step rather than a ramp.
  const thick = 0.07;

  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        // index 0 sits at the floor. Later treads drop by `rise`.
        const top = -index * rise;
        const z = startZ + index * tread + tread / 2;
        // Nose sits on the outer edge, a few centimeters proud of the slab.
        const noseZ = startZ + (index + 1) * tread - 0.025;

        return (
          <group key={index}>
            <mesh position={[0, top - thick / 2, z]} castShadow receiveShadow>
              <boxGeometry args={[width, thick, tread]} />
              {/* #f0eee9, roughness 0.58. Same pale stone as the floor. */}
              <meshStandardMaterial color={palette.stone} roughness={0.58} metalness={0.04} />
            </mesh>
            <mesh position={[0, top - 0.02, noseZ]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.02, 0.04, 0.05]} />
              {/* #e4e0da along the nosing, a quiet edge against the pale tread. */}
              <meshStandardMaterial color={palette.stoneDeep} roughness={0.72} metalness={0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
