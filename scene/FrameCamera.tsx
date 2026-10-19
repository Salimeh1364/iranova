"use client";

import { useLayoutEffect } from "react";
import { Object3D, PerspectiveCamera } from "three";
import { useThree } from "@react-three/fiber";
import { CAMERA_FIT } from "@/scene/hall";

const framedView = new Object3D();
framedView.position.set(CAMERA_FIT.eye[0], CAMERA_FIT.eye[1], CAMERA_FIT.eye[2]);
framedView.lookAt(CAMERA_FIT.lookAt[0], CAMERA_FIT.lookAt[1], CAMERA_FIT.lookAt[2]);

const framedRotation: [number, number, number] = [
  framedView.rotation.x,
  framedView.rotation.y,
  framedView.rotation.z,
];

/** Used for the first frame, before the viewport size is known. */
export const initialCamera = {
  fov: CAMERA_FIT.fov,
  near: 0.1,
  far: 64,
  position: [CAMERA_FIT.eye[0], CAMERA_FIT.eye[1], CAMERA_FIT.eye[2]] as [number, number, number],
  rotation: framedRotation,
};

type ManualCamera = PerspectiveCamera & { manual: boolean };

/**
 * Keeps the vault, the pool, and both exhibition walls inside the view.
 * The visitor does not move. This only replaces the lens.
 */
export function FrameCamera() {
  const size = useThree((state) => state.size);
  const set = useThree((state) => state.set);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const aspect = size.width > 0 && size.height > 0 ? size.width / size.height : 1;
    // A fixed wide lens. Fitting the fov to the walls made the hall feel like a corridor.
    const fov = CAMERA_FIT.fov;

    const camera: ManualCamera = Object.assign(new PerspectiveCamera(fov, aspect, 0.1, 64), {
      // Stops React Three Fiber from overwriting this fitted aspect on resize.
      manual: true,
    });
    camera.position.set(CAMERA_FIT.eye[0], CAMERA_FIT.eye[1], CAMERA_FIT.eye[2]);
    camera.lookAt(CAMERA_FIT.lookAt[0], CAMERA_FIT.lookAt[1], CAMERA_FIT.lookAt[2]);
    camera.updateProjectionMatrix();
    set({ camera });
    invalidate();
  }, [invalidate, set, size.height, size.width]);

  return null;
}
