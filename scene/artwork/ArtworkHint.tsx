"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { figurePlacements } from "@/content/famousFigures";
import { landmarkPlacements } from "@/content/iranLandmarks";
import { getFrameHover, publishFrameHint } from "@/scene/controls/frameHintSession";
import { getSelectedExhibit } from "@/scene/controls/figureSession";

// Close enough to read the nameplate, in meters.
const NEAR = 3.5;

const forward = new Vector3();
const point = new Vector3();
const toFrame = new Vector3();

type Anchor = {
  x: number;
  y: number;
  z: number;
};

/**
 * Picks one frame for the floating hint.
 * A hover wins. Otherwise the nearest frame in front of the visitor, within a few meters.
 */
export function ArtworkHint() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const anchors = useMemo<Anchor[]>(() => {
    const all = [...figurePlacements, ...landmarkPlacements];
    return all.map((frame) => ({
      x: frame.position[0],
      // Just above the molding, so the label sits over the frame.
      y: frame.position[1] + frame.height / 2 + 0.1,
      z: frame.position[2],
    }));
  }, []);

  useFrame(() => {
    if (getSelectedExhibit()) {
      publishFrameHint({ x: 0, y: 0, on: false });
      return;
    }

    const hovered = getFrameHover();
    let target: Anchor | null = hovered;
    if (!target) {
      camera.getWorldDirection(forward);
      let best = NEAR;
      for (const frame of anchors) {
        toFrame.set(frame.x - camera.position.x, frame.y - camera.position.y, frame.z - camera.position.z);
        const dist = toFrame.length();
        if (dist > best) continue;
        toFrame.multiplyScalar(1 / dist);
        // Behind the visitor, or well outside the view.
        if (toFrame.dot(forward) < 0.35) continue;
        best = dist;
        target = frame;
      }
    }

    if (!target) {
      publishFrameHint({ x: 0, y: 0, on: false });
      return;
    }

    point.set(target.x, target.y, target.z).project(camera);
    // Past the far plane, or beside the viewport.
    if (point.z > 1 || point.x < -1.05 || point.x > 1.05 || point.y < -1.05 || point.y > 1.05) {
      publishFrameHint({ x: 0, y: 0, on: false });
      return;
    }

    publishFrameHint({
      x: (point.x * 0.5 + 0.5) * size.width,
      y: (-point.y * 0.5 + 0.5) * size.height,
      on: true,
    });
  });

  return null;
}
