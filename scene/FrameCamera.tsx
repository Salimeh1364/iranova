import { Object3D } from "three";
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
