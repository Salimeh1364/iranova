"use client";

import { PlasterSurface } from "@/scene/materials/PlasterSurface";

export type FlatWallProps = {
  /** Center of the wall, in world meters. */
  position: readonly [number, number, number];
  /** Width, height, thickness, in meters. */
  size: readonly [number, number, number];
  color: string;
};

/**
 * One flat exhibition wall with a low baseboard.
 * The wall is a thin slab, not a thickened block.
 */
export function FlatWall({ position, size, color }: FlatWallProps) {
  const [width, height, depth] = size;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <PlasterSurface color={color} />
      </mesh>
      {/* #cfc8bc base, 9 cm tall, 1.5 cm proud of the paint. */}
      <mesh position={[0, -height / 2 + 0.045, 0]} receiveShadow>
        <boxGeometry args={[width + 0.015, 0.09, depth + 0.015]} />
        <meshStandardMaterial color="#cfc8bc" roughness={0.62} metalness={0} />
      </mesh>
    </group>
  );
}
