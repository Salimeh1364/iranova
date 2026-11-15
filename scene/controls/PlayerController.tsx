"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, PerspectiveCamera, Vector3 } from "three";
import { getDeviceProfile, getServerDeviceProfile, subscribeDeviceProfile } from "@/lib/deviceProfile";
import { CAMERA_FIT, PLAYER } from "@/scene/hall";
import { setHeading } from "@/scene/controls/headingSession";
import { addLook, readStick, takeLook } from "@/scene/controls/touchSteer";
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
 * On a desktop the mouse, through pointer lock, only turns the camera.
 * A finger drags the picture to look, and the on-screen pad walks.
 * WASD moves on the floor plane of the look direction, so looking up does not add a vertical step.
 */
export function PlayerController() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const profile = useSyncExternalStore(subscribeDeviceProfile, getDeviceProfile, getServerDeviceProfile);
  const aimed = useRef(false);
  const keys = useRef(new Set<string>());
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const lookDir = useRef(new Vector3());
  const up = useRef(new Vector3(0, 1, 0));
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const touch = profile.touch;

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
    const el = gl.domElement;
    let active: number | null = null;
    let lastX = 0;
    let lastY = 0;

    // A finger on the picture turns the head. The pad, not this drag, walks.
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || active !== null || document.pointerLockElement) return;
      active = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== active) return;
      addLook(event.clientX - lastX, event.clientY - lastY);
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId === active) active = null;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Keys walk while the pointer is locked, and also on a touch screen with a keyboard.
      if ((!document.pointerLockElement && !touch) || !MOVE_KEYS.has(event.code)) return;
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
  }, [touch]);

  useFrame((_, delta) => {
    // Eye height stays fixed. Looking around does not lift the body.
    camera.position.y = PLAYER.eyeHeight;

    if (document.pointerLockElement) {
      // Pointer lock already turned the camera. Drop any leftover finger drag.
      takeLook();
    } else {
      const look = takeLook();
      if (look.x !== 0 || look.y !== 0) {
        const turn = euler.current;
        turn.setFromQuaternion(camera.quaternion, "YXZ");
        // Yaw follows the finger. Pitch stays short of straight up or down.
        turn.y -= look.x * 0.0024;
        turn.x = Math.min(1.05, Math.max(-1.05, turn.x - look.y * 0.002));
        camera.quaternion.setFromEuler(turn);
      }
    }

    // 0 faces deeper into the hall. The compass rose turns the other way.
    camera.getWorldDirection(lookDir.current);
    setHeading(Math.atan2(lookDir.current.x, -lookDir.current.z));

    let moveForward = 0;
    let moveRight = 0;
    const locked = Boolean(document.pointerLockElement);
    if (locked || touch) {
      if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) moveForward += 1;
      if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) moveForward -= 1;
      if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) moveRight += 1;
      if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) moveRight -= 1;
    }
    if (!locked) {
      const pad = readStick();
      moveForward += pad.y;
      moveRight += pad.x;
    }
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
