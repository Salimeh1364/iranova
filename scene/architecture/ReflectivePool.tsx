"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";

const POOL = {
  width: 2.05,
  length: 12,
  centerZ: -1.2,
} as const;

/**
 * A shallow rectangular basin on the centerline.
 * MeshReflectorMaterial renders the hall once more into a mirror texture.
 * Resolution stays at 512 so that extra pass remains affordable.
 * The surrounding floor does not use a second reflector.
 */
export function ReflectivePool() {
  const rim = useMemo(
    () => ({
      y: 0.04,
      thickness: 0.08,
      height: 0.06,
    }),
    [],
  );

  return (
    <group position={[0, 0, POOL.centerZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <planeGeometry args={[POOL.width, POOL.length]} />
        <MeshReflectorMaterial
          color="#c9e0dc"
          roughness={0.12}
          metalness={0.08}
          mirror={1}
          resolution={512}
          blur={[140, 40]}
          mixBlur={0.4}
          mixStrength={1.15}
          depthScale={1.15}
          minDepthThreshold={0.2}
          maxDepthThreshold={1.45}
        />
      </mesh>

      <mesh position={[0, rim.y, POOL.length / 2]} receiveShadow>
        <boxGeometry args={[POOL.width + rim.thickness * 2, rim.height, rim.thickness]} />
        <meshStandardMaterial color="#d5dbe3" roughness={0.4} />
      </mesh>
      <mesh position={[0, rim.y, -POOL.length / 2]} receiveShadow>
        <boxGeometry args={[POOL.width + rim.thickness * 2, rim.height, rim.thickness]} />
        <meshStandardMaterial color="#d5dbe3" roughness={0.4} />
      </mesh>
      <mesh position={[-POOL.width / 2, rim.y, 0]} receiveShadow>
        <boxGeometry args={[rim.thickness, rim.height, POOL.length]} />
        <meshStandardMaterial color="#d5dbe3" roughness={0.4} />
      </mesh>
      <mesh position={[POOL.width / 2, rim.y, 0]} receiveShadow>
        <boxGeometry args={[rim.thickness, rim.height, POOL.length]} />
        <meshStandardMaterial color="#d5dbe3" roughness={0.4} />
      </mesh>
    </group>
  );
}
