"use client";

import { useMemo } from "react";
import { ExtrudeGeometry, Path, Shape } from "three";
import { HALL, VAULT_CROWN } from "@/scene/hall";
import { createArchFillShape, traceArchForward } from "@/scene/geometry/archProfile";
import { getBrickTexture } from "@/scene/materials/surfaces";

const WINDOW = {
  half: 2.35,
  rise: 3.15,
} as const;

/** Rounder than the ceiling vault, so the far opening reads as a window rather than a point. */
const WINDOW_CURVE = { shoulder: 0.58, lift: 0.72 };

/**
 * Far wall of the hall. The brick face is a full-height panel with one arch
 * cut out of it. Glass fills that opening so the daylight has a visible source.
 */
export function WindowArch() {
  const wall = useMemo(() => {
    const halfWidth = HALL.width / 2;
    const shape = new Shape();
    shape.moveTo(-halfWidth, 0);
    shape.lineTo(halfWidth, 0);
    shape.lineTo(halfWidth, VAULT_CROWN);
    shape.lineTo(-halfWidth, VAULT_CROWN);
    shape.closePath();

    // The wall outline is counter-clockwise. The opening must wind the other way or the hole is ignored.
    const opening = new Path();
    traceArchForward(opening, WINDOW.half, WINDOW.rise, true, WINDOW_CURVE);
    opening.closePath();
    shape.holes.push(opening);

    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: false,
      curveSegments: 28,
    });
    geometry.translate(0, 0, -0.14);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const glass = useMemo(() => {
    const geometry = new ExtrudeGeometry(
      createArchFillShape(WINDOW.half - 0.08, WINDOW.rise - 0.08, WINDOW_CURVE),
      {
      depth: 0.04,
      bevelEnabled: false,
      curveSegments: 24,
    });
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const brick = useMemo(() => getBrickTexture(), []);

  return (
    <group position={[0, 0, -HALL.length / 2]}>
      <mesh geometry={wall} receiveShadow castShadow>
        <meshStandardMaterial map={brick} color="#ffffff" roughness={0.84} />
      </mesh>
      <mesh geometry={glass} position={[0, 0, 0.06]}>
        {/* A luminous pane. Full transmission would redraw the hall again, on top of the pool reflector. */}
        <meshStandardMaterial
          color="#fffdf8"
          emissive="#fff6e8"
          emissiveIntensity={1.6}
          roughness={0.08}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
      {/* Two mullions, kept inside the arch so they read as glazing bars. */}
      <mesh position={[0, WINDOW.rise * 0.58, 0.1]} castShadow>
        <boxGeometry args={[0.045, WINDOW.rise * 0.4, 0.04]} />
        <meshStandardMaterial color="#d4a64a" roughness={0.45} />
      </mesh>
      <mesh position={[0, WINDOW.rise * 0.58, 0.1]} castShadow>
        <boxGeometry args={[WINDOW.half * 0.85, 0.045, 0.04]} />
        <meshStandardMaterial color="#d4a64a" roughness={0.45} />
      </mesh>
    </group>
  );
}
