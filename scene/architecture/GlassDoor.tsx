"use client";

import { DoubleSide } from "three";
import { palette } from "@/lib/palette";

export type GlassDoorProps = {
  /** Clear width of the opening, in meters. */
  width: number;
  /** Clear height from the floor to the head, in meters. */
  height: number;
};

// Slim bronze section. Thin enough that the garden stays the view.
const FRAME = 0.02;
const FRAME_D = 0.035;
// Gap where the two leaves meet.
const GAP = 0.016;

/**
 * A pair of crystal-clear leaves in a minimal metal frame.
 * The glass is a light veil, not a transmission pass, so the courtyard is not redrawn.
 * There is no bottom rail. The floor runs through the opening.
 */
export function GlassDoor({ width, height }: GlassDoorProps) {
  const leafW = (width - GAP) / 2;

  return (
    <group>
      <Leaf sign={-1} leafW={leafW} height={height} />
      <Leaf sign={1} leafW={leafW} height={height} />
    </group>
  );
}

function Leaf({
  sign,
  leafW,
  height,
}: {
  sign: -1 | 1;
  leafW: number;
  height: number;
}) {
  const centerX = sign * (GAP / 2 + leafW / 2);
  const glassW = leafW - FRAME * 2;
  // Stiles stop where the head rail begins, so the corner faces do not overlap.
  const stileH = height - FRAME;
  // From just above the floor to the underside of the head rail.
  const glassH = stileH - 0.008;
  const glassY = 0.008 + glassH / 2;
  // Meeting edge is the side toward the gap. Left leaf: +X. Right leaf: -X.
  const meetingX = -sign * (leafW / 2 - FRAME / 2);
  const outerX = sign * (leafW / 2 - FRAME / 2);

  return (
    <group position={[centerX, 0, 0]}>
      <FrameBar position={[outerX, stileH / 2, 0]} size={[FRAME, stileH, FRAME_D]} />
      <FrameBar position={[meetingX, stileH / 2, 0]} size={[FRAME, stileH, FRAME_D]} />
      {/* Head rail only. The threshold stays open. */}
      <FrameBar position={[0, height - FRAME / 2, 0]} size={[leafW, FRAME, FRAME_D]} />

      {/* Clear veil. Opacity 0.06, so the photograph behind it stays fully readable. */}
      <mesh position={[0, glassY, 0]}>
        <planeGeometry args={[glassW, glassH]} />
        <meshBasicMaterial
          color="#f8fbf9"
          transparent
          opacity={0.06}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Slim pull on the foyer side, just inside the meeting stile. */}
      <mesh position={[-sign * (leafW / 2 - FRAME - 0.03), 1.05, -FRAME_D / 2 - 0.01]}>
        <boxGeometry args={[0.012, 0.32, 0.012]} />
        <meshStandardMaterial color={palette.metal} roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  );
}

function FrameBar({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      {/* #1e293b, roughness 0.55. A matte bronze line, not a polished rail. */}
      <meshStandardMaterial color={palette.bronze} roughness={0.55} metalness={0.35} />
    </mesh>
  );
}
