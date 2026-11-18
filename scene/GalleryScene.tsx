"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { getDeviceProfile, getServerDeviceProfile, subscribeDeviceProfile } from "@/lib/deviceProfile";
import { initialCamera } from "@/scene/FrameCamera";
import { PlayerController } from "@/scene/controls/PlayerController";
import { ArtworkHint } from "@/scene/artwork/ArtworkHint";
import { GalleryHall } from "@/scene/GalleryHall";

/**
 * Canvas shell.
 * Desktop keeps one 512px daylight shadow. A phone drops that map and the floor mirror.
 * Pixel ratio stays at 1 on a phone so the panel does not render three times over.
 */
export default function GalleryScene() {
  const profile = useSyncExternalStore(subscribeDeviceProfile, getDeviceProfile, getServerDeviceProfile);
  const dpr = useMemo(() => [1, profile.dprMax] as [number, number], [profile.dprMax]);

  return (
    <Canvas
      // One filtered shadow map on a large screen. Phones stay unshadowed.
      shadows={profile.shadows ? "percentage" : false}
      dpr={dpr}
      gl={{
        antialias: profile.antialias,
        alpha: false,
        powerPreference: profile.tier === "phone" ? "low-power" : "high-performance",
      }}
      camera={initialCamera}
    >
      {/* Pale warm sky, close to the daylight in the courtyard photograph. */}
      <color attach="background" args={["#e7efe6"]} />
      <fog attach="fog" args={["#e7efe4", 24, 56]} />
      <PlayerController />
      <ArtworkHint />
      {/* Warm bounce on the floor, pale ground on the ceiling, so shadows stay airy. */}
      <hemisphereLight args={["#fff3d6", "#eceae4", 0.72]} />
      {/* Warm fill. High enough that a shadow never reads as black. */}
      <ambientLight intensity={0.4} color="#fff6ea" />
      {/* #fff3d6 sun through the portal. The map size follows the screen.
          This Three.js build folded PCFSoftShadowMap into PCF. Radius diffuses the edge,
          and intensity 0.45 keeps the shadow translucent. */}
      <directionalLight
        position={[0.6, 8.2, 18]}
        intensity={2.35}
        color="#fff3d6"
        castShadow={profile.shadows}
        shadow-mapSize={[profile.shadowMap, profile.shadowMap]}
        shadow-intensity={0.45}
        shadow-radius={profile.tier === "desktop" ? 12 : 6}
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
