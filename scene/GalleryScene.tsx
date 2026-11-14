"use client";

import { Canvas } from "@react-three/fiber";
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
      {/* Pale warm sky, close to the daylight in the courtyard photograph. */}
      <color attach="background" args={["#e7efe6"]} />
      <fog attach="fog" args={["#e7efe4", 24, 56]} />
      <PlayerController />
      {/* Warm sky on the floor, neutral ground on the ceiling, so the olive stays #8a9a86. */}
      <hemisphereLight args={["#f6efe2", "#e6e8e2", 0.62]} />
      {/* Soft fill, warm white, held low so the sun through the portal still models the room. */}
      <ambientLight intensity={0.34} color="#fff6ea" />
      {/* Warm daylight aimed through the portal. This is the only shadow map, at 512px. */}
      <directionalLight
        position={[0.6, 8.2, 18]}
        intensity={1.45}
        color="#ffe6c4"
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
