"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { CAMERA_FIT, PLAYER } from "@/scene/hall";
import { moveWithinHall } from "@/scene/controls/walkBounds";
import { setWalkLocked } from "@/scene/controls/walkSession";

const MOVE_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

/**
 * First-person walking.
 * The mouse, through PointerLockControls, only turns the camera.
 * WASD moves on the floor plane of that look direction, so looking up does not add a vertical step.
 * Movement runs only while the pointer is locked, which keeps the page from scrolling under the arrow keys.
 */
export function PlayerController() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const aimed = useRef(false);
  const keys = useRef(new Set<string>());
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const up = useRef(new Vector3(0, 1, 0));

  const onLock = useCallback(() => setWalkLocked(true), []);
  const onUnlock = useCallback(() => {
    keys.current.clear();
    setWalkLocked(false);
  }, []);

  useLayoutEffect(() => {
    // Aim once. Later frames belong to the walker, so a resize must not pull the visitor back.
    if (!aimed.current) {
      camera.position.set(CAMERA_FIT.eye[0], CAMERA_FIT.eye[1], CAMERA_FIT.eye[2]);
      camera.lookAt(CAMERA_FIT.lookAt[0], CAMERA_FIT.lookAt[1], CAMERA_FIT.lookAt[2]);
      aimed.current = true;
    }
    if (camera instanceof PerspectiveCamera && size.width > 0 && size.height > 0) {
      camera.aspect = size.width / Math.max(size.height, 1);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.height, size.width]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!document.pointerLockElement || !MOVE_KEYS.has(event.code)) return;
      keys.current.add(event.code);
      event.preventDefault();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    // Eye height stays fixed. Pointer lock turns the view and does not lift the body.
    camera.position.y = PLAYER.eyeHeight;
    if (!document.pointerLockElement) return;

    let moveForward = 0;
    let moveRight = 0;
    if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) moveForward += 1;
    if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) moveForward -= 1;
    if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) moveRight += 1;
    if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) moveRight -= 1;
    if (moveForward === 0 && moveRight === 0) return;

    // A diagonal step would otherwise be faster than a straight one.
    const scale = 1 / Math.hypot(moveForward, moveRight);
    moveForward *= scale;
    moveRight *= scale;

    // Camera forward is local -Z. Flatten it so the walk stays on the floor.
    forward.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.current.y = 0;
    if (forward.current.lengthSq() < 1e-6) return;
    forward.current.normalize();
    // cross(forward, up) points to the visitor's right.
    right.current.crossVectors(forward.current, up.current).normalize();

    const step = PLAYER.speed * Math.min(delta, 0.05);
    const nextX = camera.position.x + (forward.current.x * moveForward + right.current.x * moveRight) * step;
    const nextZ = camera.position.z + (forward.current.z * moveForward + right.current.z * moveRight) * step;
    const resolved = moveWithinHall(camera.position.x, camera.position.z, nextX, nextZ);
    camera.position.x = resolved.x;
    camera.position.z = resolved.z;
  });

  return (
    <PointerLockControls
      // Only the walk button locks the pointer. A portrait click opens the biography.
      selector="#walk-start"
      onLock={onLock}
      onUnlock={onUnlock}
    />
  );
}
