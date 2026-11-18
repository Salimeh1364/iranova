"use client";

import { palette } from "@/lib/palette";
import { TERRACE } from "@/scene/architecture/terracePlan";

/**
 * A stone landing outside the garden doors, then four short steps down.
 * The first tread is one rise below the landing. The photograph is not moved.
 */
export function ExteriorSteps() {
  const width = TERRACE.halfWidth * 2;
  // Local Z: the portal group is centered on the entrance wall.
  const landingZ = TERRACE.landingZ - TERRACE.wallZ;
  const thick = 0.1;
  const stepThick = 0.07;
  const stepStart = landingZ + TERRACE.landingDepth;

  return (
    <group>
      {/* Landing, flush with the gallery floor. */}
      <mesh position={[0, -thick / 2, landingZ + TERRACE.landingDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, thick, TERRACE.landingDepth]} />
        <meshStandardMaterial color={palette.stone} roughness={0.58} metalness={0.04} />
      </mesh>
      {/* Quiet edge where the landing drops to the first tread. */}
      <mesh position={[0, -0.02, stepStart - 0.025]} receiveShadow>
        <boxGeometry args={[width + 0.02, 0.04, 0.05]} />
        <meshStandardMaterial color={palette.stoneDeep} roughness={0.72} metalness={0} />
      </mesh>

      {Array.from({ length: TERRACE.steps }, (_, index) => {
        const top = -(index + 1) * TERRACE.rise;
        const z = stepStart + index * TERRACE.tread + TERRACE.tread / 2;
        const noseZ = stepStart + (index + 1) * TERRACE.tread - 0.025;

        return (
          <group key={index}>
            <mesh position={[0, top - stepThick / 2, z]} castShadow receiveShadow>
              <boxGeometry args={[width, stepThick, TERRACE.tread]} />
              <meshStandardMaterial color={palette.stone} roughness={0.58} metalness={0.04} />
            </mesh>
            <mesh position={[0, top - 0.02, noseZ]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.02, 0.04, 0.05]} />
              <meshStandardMaterial color={palette.stoneDeep} roughness={0.72} metalness={0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
