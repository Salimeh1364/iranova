"use client";

import { Canvas } from "@react-three/fiber";
import { palette } from "@/lib/palette";
import { FrameCamera, initialCamera } from "@/scene/FrameCamera";
import { GalleryHall } from "@/scene/GalleryHall";
import { HALL } from "@/scene/hall";

/**
 * Canvas shell for the hall.
 * The reflector inside the pool updates from the render loop, so the loop
 * stays on. Pixel ratio is capped, and only the sun light below casts shadows.
 * Tone mapping stays on so the window light softens instead of clipping the floor to white.
 * Fog is only the far end of the hall, so the nearest frames stay clear.
 */
export default function GalleryScene() {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      camera={initialCamera}
    >
      <color attach="background" args={["#f6f0e4"]} />
      <fog attach="fog" args={["#f6f0e4", 18, 46]} />
      <FrameCamera />
      <hemisphereLight args={[palette.sunlight, "#e7edf2", 0.7]} />
      <ambientLight intensity={0.36} color={palette.sunlight} />
      {/* Daylight entering through the far arch and aimed down the length of the hall. */}
      <directionalLight
        position={[1.4, 8.4, -HALL.length / 2 + 2]}
        intensity={2.15}
        color={palette.sunlight}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={48}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.00035}
      />
      <GalleryHall />
    </Canvas>
  );
}
