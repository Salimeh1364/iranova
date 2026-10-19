"use client";

import GalleryScene from "@/scene/GalleryScene";
import { GalleryStatus } from "@/components/gallery/GalleryStatus";

let webglSupported: boolean | undefined;

export default function GalleryView() {
  // This module is client-only, so the check can run while rendering.
  if (!supportsWebGL()) {
    return <GalleryStatus kind="unavailable" />;
  }

  return (
    <div className="gallery-canvas" aria-hidden="true">
      <GalleryScene />
    </div>
  );
}

function supportsWebGL() {
  if (webglSupported !== undefined) return webglSupported;

  try {
    const canvas = document.createElement("canvas");
    webglSupported = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglSupported = false;
  }

  return webglSupported;
}
