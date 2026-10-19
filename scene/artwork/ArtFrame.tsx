"use client";

import { palette } from "@/lib/palette";
import type { ArtworkPlacement } from "@/lib/types";

export type ArtFrameProps = {
  placement: ArtworkPlacement;
};

const FRAME = {
  width: 1.12,
  height: 1.42,
  depth: 0.05,
} as const;

/**
 * An empty hanging frame. rotationY is applied by the parent placement so the
 * same component can face either exhibition wall. There is no pointer handler yet.
 */
export function ArtFrame({ placement }: ArtFrameProps) {
  const faceZ = FRAME.depth / 2;

  return (
    <group position={placement.position} rotation={[0, placement.rotationY, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[FRAME.width, FRAME.height, FRAME.depth]} />
        <meshStandardMaterial color={palette.wood} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0, faceZ + 0.004]}>
        <planeGeometry args={[FRAME.width * 0.86, FRAME.height * 0.88]} />
        <meshStandardMaterial color={palette.gold} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, faceZ + 0.008]}>
        <planeGeometry args={[FRAME.width * 0.78, FRAME.height * 0.8]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.88} />
      </mesh>
    </group>
  );
}
