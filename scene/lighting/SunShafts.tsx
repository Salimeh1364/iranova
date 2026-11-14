"use client";

import { useMemo, useLayoutEffect, useRef } from "react";
import { AdditiveBlending, CanvasTexture, DoubleSide, Object3D, SpotLight, SRGBColorSpace } from "three";
import { PLAN } from "@/scene/hall";

/**
 * Daylight you can see, just inside the open portal.
 * A warm pool of light, plus a few additive sheets along the sun direction.
 * Neither casts a shadow. The directional light in the scene still owns the one shadow map.
 */

const SUN = "#fff3d6";

// Sheets lean from the doorway down into the foyer. +Z is outside.
const SHAFTS = [
  { x: -1.05, width: 1.1, length: 4.2, opacity: 0.16, yaw: -0.03 },
  { x: 0.1, width: 1.45, length: 4.8, opacity: 0.2, yaw: 0.02 },
  { x: 1.2, width: 0.95, length: 3.8, opacity: 0.14, yaw: 0.05 },
] as const;

export function SunShafts() {
  // Soft falloff across the sheet, so the beam has no hard silhouette.
  const glow = useMemo(() => shaftTexture(), []);

  return (
    <group>
      <PortalGlow />
      {/* Tilted so the sheets run from the head of the opening down toward the floor. */}
      {/* Held just inside the doorway, under the lintel, so the beam does not wash the ceiling. */}
      <group position={[0, 1.7, PLAN.spineNear - 1.15]} rotation={[0.95, 0, 0]}>
        {SHAFTS.map((shaft) => (
          <mesh key={shaft.x} position={[shaft.x, 0, 0]} rotation={[0, shaft.yaw, 0]} renderOrder={2}>
            <planeGeometry args={[shaft.width, shaft.length]} />
            {/* #fff3d6. The map fades to nothing at the edges. */}
            <meshBasicMaterial
              map={glow}
              color={SUN}
              transparent
              opacity={shaft.opacity}
              depthWrite={false}
              blending={AdditiveBlending}
              side={DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** A vertical fade: bright in the middle, clear at both sides and at the far end. */
function shaftTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return new CanvasTexture(canvas);

  const across = context.createLinearGradient(0, 0, 64, 0);
  across.addColorStop(0, "rgba(255,243,214,0)");
  across.addColorStop(0.5, "rgba(255,243,214,1)");
  across.addColorStop(1, "rgba(255,243,214,0)");
  context.fillStyle = across;
  context.fillRect(0, 0, 64, 256);

  // Keep the glow near the doorway and let it dissolve toward the floor.
  context.globalCompositeOperation = "destination-in";
  const along = context.createLinearGradient(0, 0, 0, 256);
  along.addColorStop(0, "rgba(0,0,0,0.2)");
  along.addColorStop(0.35, "rgba(0,0,0,1)");
  along.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = along;
  context.fillRect(0, 0, 64, 256);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** A wide warm spot through the portal. No shadow map. */
function PortalGlow() {
  const light = useRef<SpotLight>(null);
  const target = useRef<Object3D>(null);

  useLayoutEffect(() => {
    if (!light.current || !target.current) return;
    light.current.target = target.current;
  }, []);

  return (
    <group>
      {/* Just inside the opening, aimed down the foyer. */}
      <spotLight
        ref={light}
        position={[0.35, 4.15, PLAN.spineNear - 0.35]}
        angle={0.62}
        penumbra={1}
        intensity={28}
        distance={16}
        decay={2}
        color={SUN}
      />
      <object3D ref={target} position={[0, 0.15, PLAN.spineNear - 7]} />
    </group>
  );
}
