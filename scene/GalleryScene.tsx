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
      // One filtered shadow map. Radius below spreads it; this Three.js build no longer has a separate soft map.
      shadows="percentage"
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: false }}
      camera={initialCamera}
    >
      {/* Pale warm sky, close to the daylight in the courtyard photograph. */}
      <color attach="background" args={["#e7efe6"]} />
      <fog attach="fog" args={["#e7efe4", 24, 56]} />
      <PlayerController />
      {/* Warm bounce on the floor, pale ground on the ceiling, so shadows stay airy. */}
      <hemisphereLight args={["#fff3d6", "#eceae4", 0.72]} />
      {/* Warm fill. High enough that a shadow never reads as black. */}
      <ambientLight intensity={0.4} color="#fff6ea" />
      {/* #fff3d6 sun through the portal. One 512px map.
          This Three.js build folded PCFSoftShadowMap into PCF. Radius diffuses the edge,
          and intensity 0.45 keeps the shadow translucent. */}
      <directionalLight
        position={[0.6, 8.2, 18]}
        intensity={2.35}
        color="#fff3d6"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-intensity={0.45}
        shadow-radius={12}
        shadow-camera-near={2}
        shadow-camera-far={42}
        shadow-camera-left={-14}
        shadow-camera-right={10}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0006}
      />
      <GalleryHall />
    </Canvas>
  );
}
