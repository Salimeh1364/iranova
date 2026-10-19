"use client";

import { useLayoutEffect, useRef } from "react";
import { Object3D, SpotLight } from "three";
import { HALL } from "@/scene/hall";
import type { ArtworkPlacement } from "@/lib/types";

export type SpotlightGroupProps = {
  placements: readonly ArtworkPlacement[];
};

/**
 * One warm spotlight over each frame.
 * These lights do not cast shadow maps. A single sun shadow covers the hall,
 * and four extra shadow maps would multiply the cost of the water reflection.
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

  useLayoutEffect(() => {
    if (!light.current || !target.current) return;
    // SpotLight aims at a separate object, not at a prop vector.
    light.current.target = target.current;
  }, []);

  return (
    <>
      <spotLight
        ref={light}
        position={[x, HALL.wallHeight - 0.08, z]}
        angle={0.46}
        penumbra={0.65}
        intensity={18}
        distance={6}
        decay={2}
        color="#fff0d8"
      />
      <object3D ref={target} position={[x, y, z]} />
    </>
  );
}
