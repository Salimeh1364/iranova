"use client";

import { useLayoutEffect, useRef } from "react";
import { Object3D, SpotLight } from "three";
import { palette } from "@/lib/palette";
import { HALL } from "@/scene/hall";
import type { ArtworkPlacement } from "@/lib/types";

export type SpotlightGroupProps = {
  placements: readonly ArtworkPlacement[];
};

/** How far the lamp stands off the wall, in meters, so the beam washes the painting. */
const STAND_OFF = 1.35;

/**
 * One white spotlight for each work.
 * The lamp hangs just under the white ceiling and aims at the painting.
 * These lights match the ceiling spots: bright white, soft edge, no shadow map.
 * Daylight through the glazed door still casts the only shadow.
 */
export function SpotlightGroup({ placements }: SpotlightGroupProps) {
  return (
    <group>
      {placements.map((placement) => (
        <ArtworkSpot key={placement.id} placement={placement} />
      ))}
    </group>
  );
}

function ArtworkSpot({ placement }: { placement: ArtworkPlacement }) {
  const light = useRef<SpotLight>(null);
  const target = useRef<Object3D>(null);
  const [x, y, z] = placement.position;
  const head = lampPosition(placement.rotationY, x, z);

  useLayoutEffect(() => {
    if (!light.current || !target.current) return;
    // SpotLight aims at a separate object, not at a prop vector.
    light.current.target = target.current;
  }, []);

  return (
    <>
      <spotLight
        ref={light}
        position={head}
        angle={0.38}
        penumbra={0.72}
        // Picture light only. It does not add a shadow map.
        intensity={36}
        distance={10}
        decay={2}
        // #ffffff picture light, aimed at the frame center.
        color={palette.lamp}
      />
      {/* White housing under the ceiling, and a short stem down to the head. */}
      <mesh position={[head[0], HALL.wallHeight - 0.02, head[2]]}>
        <boxGeometry args={[0.08, 0.04, 0.14]} />
        <meshStandardMaterial color={palette.white} roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={[head[0], (head[1] + HALL.wallHeight) / 2, head[2]]}>
        <cylinderGeometry args={[0.008, 0.008, HALL.wallHeight - head[1], 8]} />
        <meshStandardMaterial color={palette.white} roughness={0.45} metalness={0.06} />
      </mesh>
      <object3D ref={target} position={[x, y, z]} />
    </>
  );
}

/** Place the head in front of the painting, based on which way the frame faces. */
function lampPosition(rotationY: number, x: number, z: number): [number, number, number] {
  const y = HALL.wallHeight - 0.55;
  // Wrap to -PI..PI. The wing's near wall faces -Z (PI), not +X.
  const yaw = Math.atan2(Math.sin(rotationY), Math.cos(rotationY));
  // Facing +Z: a far wall. The lamp steps into the room, toward +Z.
  if (Math.abs(yaw) < 0.2) return [x, y, z + STAND_OFF];
  // Facing -Z: the wing's near wall. The lamp steps toward -Z.
  if (yaw < -Math.PI + 0.2 || yaw > Math.PI - 0.2) return [x, y, z - STAND_OFF];
  // Facing +X: a west wall. The lamp steps toward +X.
  if (yaw > 0) return [x + STAND_OFF, y, z];
  // Facing -X: an east wall.
  return [x - STAND_OFF, y, z];
}
