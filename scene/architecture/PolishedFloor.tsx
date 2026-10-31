"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { HALL } from "@/scene/hall";
import { getConcreteTexture } from "@/scene/materials/surfaces";

/**
 * Polished light-grey concrete.
 * MeshReflectorMaterial draws the hall once into a blurred mirror.
 * mixStrength stays under 1 so the arches read as a sheen, not a second copy of the room.
 * Resolution is 512. The pool uses a smaller pass of its own.
 */
export function PolishedFloor() {
  const concrete = useMemo(() => getConcreteTexture(), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[HALL.width, HALL.length]} />
      <MeshReflectorMaterial
        map={concrete}
        color="#e7edf2"
        roughness={0.42}
        metalness={0.06}
        mirror={0}
        resolution={512}
        blur={[280, 90]}
        mixBlur={0.85}
        mixStrength={0.48}
        depthScale={0.7}
        minDepthThreshold={0.35}
        maxDepthThreshold={1.3}
      />
    </mesh>
  );
}
