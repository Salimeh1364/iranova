"use client";

import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Vector3 } from "three";
import { setFrameHover } from "@/scene/controls/frameHintSession";

// A look-around drag longer than this, in pixels, is not a click.
const DRAG_PX = 8;
// A fingertip jitters more than a mouse, so a tap still opens the frame.
const TOUCH_PX = 18;

const hoverPoint = new Vector3();

/**
 * Pointer handlers for the photograph and the nameplate only.
 * A press that moves, including a pointer-lock look, does not open the panel.
 */
export function useArtworkClick(onSelect: () => void) {
  const origin = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(0);
  const dragged = useRef(false);
  const limit = useRef(DRAG_PX);

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    origin.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
    moved.current = 0;
    dragged.current = false;
    limit.current = event.nativeEvent.pointerType === "touch" ? TOUCH_PX : DRAG_PX;
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const start = origin.current;
    if (!start) return;
    const dx = event.nativeEvent.clientX - start.x;
    const dy = event.nativeEvent.clientY - start.y;
    // Pointer lock reports the look through movement, not a new cursor position.
    moved.current += Math.hypot(event.nativeEvent.movementX, event.nativeEvent.movementY);
    if (moved.current > limit.current || dx * dx + dy * dy > limit.current * limit.current) {
      dragged.current = true;
    }
  };

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (dragged.current) return;
    onSelect();
  };

  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
    // Lift the label toward the top of the frame.
    event.object.getWorldPosition(hoverPoint);
    setFrameHover({ x: hoverPoint.x, y: hoverPoint.y + 0.55, z: hoverPoint.z });
  };

  const onPointerOut = () => {
    document.body.style.cursor = "";
    setFrameHover(null);
    origin.current = null;
    moved.current = 0;
    dragged.current = false;
  };

  return { onPointerDown, onPointerMove, onClick, onPointerOver, onPointerOut };
}
