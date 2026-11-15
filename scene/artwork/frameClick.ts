"use client";

import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";

// A look-around drag longer than this, in pixels, is not a click.
const DRAG_PX = 8;

/**
 * Pointer handlers for the photograph and the nameplate only.
 * A press that moves, including a pointer-lock look, does not open the panel.
 */
export function useArtworkClick(onSelect: () => void) {
  const origin = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(0);
  const dragged = useRef(false);

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    origin.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
    moved.current = 0;
    dragged.current = false;
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const start = origin.current;
    if (!start) return;
    const dx = event.nativeEvent.clientX - start.x;
    const dy = event.nativeEvent.clientY - start.y;
    // Pointer lock reports the look through movement, not a new cursor position.
    moved.current += Math.hypot(event.nativeEvent.movementX, event.nativeEvent.movementY);
    if (moved.current > DRAG_PX || dx * dx + dy * dy > DRAG_PX * DRAG_PX) {
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
  };

  const onPointerOut = () => {
    document.body.style.cursor = "";
    origin.current = null;
    moved.current = 0;
    dragged.current = false;
  };

  return { onPointerDown, onPointerMove, onClick, onPointerOver, onPointerOut };
}
