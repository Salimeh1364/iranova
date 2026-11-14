"use client";

import { useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";
import { PLAN } from "@/scene/hall";

/**
 * Photographic courtyard outside the open portal.
 * One plane, larger than the doorway, so the opening frames the picture.
 */

// 16:9, in meters. Wider and taller than the 4.4 × 4.6 m opening.
const BACKDROP_W = 21.3;
const BACKDROP_H = 12;
// A few meters past the wall, so the portal reads as a view and not a sticker.
const BACKDROP_Z = 4.6;
// Centered so the lawn in the photo meets the ground and the canopy clears the lintel.
const BACKDROP_Y = 2.6;

export function GardenView() {
  const texture = useTexture("/garden/courtyard.jpg");
  // The file is a photograph. sRGB keeps the greens and the warm sky from going dull.
  if (texture.colorSpace !== SRGBColorSpace) {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }

  return (
    <group position={[0, 0, PLAN.spineNear]}>
      {/* Faces the foyer (-Z). Unlit, so the photo keeps its own daylight. */}
      <mesh position={[0, BACKDROP_Y, BACKDROP_Z]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[BACKDROP_W, BACKDROP_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
      </mesh>
    </group>
  );
}
