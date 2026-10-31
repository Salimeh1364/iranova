"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { getMarbleTexture } from "@/scene/materials/surfaces";

const POOL = {
  width: 2.05,
  length: 12,
  centerZ: -1.2,
} as const;

const RIM = {
  y: 0.055,
  thickness: 0.16,
  height: 0.1,
} as const;

/**
 * A shallow stone basin on the centerline.
 * The water is a second reflector, at a lower resolution than the floor,
 * so the ceiling can mirror in the pool without a second full-size pass.
 */
export function ReflectivePool() {
  const marble = useMemo(() => getMarbleTexture(), []);
  const outerWidth = POOL.width + RIM.thickness * 2;
  const outerLength = POOL.length + RIM.thickness * 2;

  return (
    <group position={[0, 0, POOL.centerZ]}>
      {/* Water sits just above the floor so the floor reflector does not z-fight it. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[POOL.width - 0.06, POOL.length - 0.06]} />
        <MeshReflectorMaterial
          color="#f4f8f7"
          roughness={0.04}
          metalness={0.02}
          mirror={1}
          resolution={256}
          blur={[60, 20]}
          mixBlur={0.2}
          mixStrength={0.92}
          depthScale={1.1}
          minDepthThreshold={0.15}
          maxDepthThreshold={1.35}
        />
      </mesh>

      <mesh position={[0, RIM.y, POOL.length / 2]} receiveShadow>
        <boxGeometry args={[outerWidth, RIM.height, RIM.thickness]} />
        <meshStandardMaterial map={marble} color="#f7f4ef" roughness={0.28} metalness={0.06} />
      </mesh>
      <mesh position={[0, RIM.y, -POOL.length / 2]} receiveShadow>
        <boxGeometry args={[outerWidth, RIM.height, RIM.thickness]} />
        <meshStandardMaterial map={marble} color="#f7f4ef" roughness={0.28} metalness={0.06} />
      </mesh>
      <mesh position={[-POOL.width / 2, RIM.y, 0]} receiveShadow>
        <boxGeometry args={[RIM.thickness, RIM.height, outerLength]} />
        <meshStandardMaterial map={marble} color="#f7f4ef" roughness={0.28} metalness={0.06} />
      </mesh>
      <mesh position={[POOL.width / 2, RIM.y, 0]} receiveShadow>
        <boxGeometry args={[RIM.thickness, RIM.height, outerLength]} />
        <meshStandardMaterial map={marble} color="#f7f4ef" roughness={0.28} metalness={0.06} />
      </mesh>
    </group>
  );
}
