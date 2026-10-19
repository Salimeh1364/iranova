"use client";

import { HALL } from "@/scene/hall";

export type GalleryWallProps = {
  side: "left" | "right";
};

/** Inset of the white partition from the hall centerline. Wide enough to leave an open aisle around the pool. */
const PARTITION_X = 3.2;

/**
 * A freestanding exhibition wall inside the brick hall.
 * It stops short of the window wall so the arch remains visible down the room.
 */
export function GalleryWall({ side }: GalleryWallProps) {
  const x = side === "left" ? -PARTITION_X : PARTITION_X;

  return (
    <mesh position={[x, HALL.wallHeight / 2, 0.3]} receiveShadow>
      <boxGeometry args={[0.12, HALL.wallHeight, HALL.length - 4]} />
      <meshStandardMaterial color="#f7f4ef" roughness={0.92} />
    </mesh>
  );
}
