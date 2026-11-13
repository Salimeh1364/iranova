"use client";

import { Canvas } from "@react-three/fiber";
import { palette } from "@/lib/palette";
import { initialCamera } from "@/scene/FrameCamera";
import { PlayerController } from "@/scene/controls/PlayerController";
import { GalleryHall } from "@/scene/GalleryHall";

/**
 * Canvas shell.
 * One 512px daylight shadow, plus the picture spots. Pixel ratio is capped.
 * The floor reflection is a small map, so the hall is not drawn at full size twice.
 */
export default function GalleryScene() {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: false }}
      camera={initialCamera}
    >
      {/* Soft daylight outside the open portal. */}
      <color attach="background" args={["#d7e3cf"]} />
      <fog attach="fog" args={["#e4eee6", 24, 56]} />
      <PlayerController />
      {/* Bright sky on upward faces, pale ground on the ceiling, so the olive stays lit. */}
      <hemisphereLight args={["#f4f7f2", "#e6e8e2", 0.7]} />
      {/* Held under the sun so the shadow on the floor still reads. */}
      <ambientLight intensity={0.38} color={palette.white} />
      {/* Sun through the portal. This is the only shadow map, at 512px. */}
      <directionalLight
        position={[3.5, 11, 16]}
        intensity={1.65}
        color="#fffaf4"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-near={2}
        shadow-camera-far={42}
        shadow-camera-left={-14}
        shadow-camera-right={10}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />
      <GalleryHall />
    </Canvas>
  );
}
