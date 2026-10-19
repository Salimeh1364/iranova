"use client";

import { Canvas } from "@react-three/fiber";
import { FrameCamera, initialCamera } from "@/scene/FrameCamera";
import { GalleryHall } from "@/scene/GalleryHall";
import { HALL } from "@/scene/hall";

/**
 * Canvas shell for the hall.
 * The reflector inside the pool updates from the render loop, so the loop
 * stays on. Pixel ratio is capped, and only the sun light below casts shadows.
 * Tone mapping stays on so the window light softens instead of clipping the floor to white.
 */
export default function GalleryScene() {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      camera={initialCamera}
    >
      <color attach="background" args={["#fff6ea"]} />
      <FrameCamera />
      <hemisphereLight args={["#fff8f2", "#e2e8f0", 1.05]} />
      <ambientLight intensity={0.62} color="#fff8f2" />
      {/* Daylight entering through the far arch and aimed down the length of the hall. */}
      <directionalLight
        position={[0, 6.2, -HALL.length / 2 + 1.4]}
        intensity={3.2}
        color="#fffaf4"
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
