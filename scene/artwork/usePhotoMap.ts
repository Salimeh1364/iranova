"use client";

import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace, Texture } from "three";
import { getPlaceholderCanvas } from "@/scene/artwork/portraitPlaceholder";
import { applyCover } from "@/scene/artwork/coverPhoto";

/**
 * Loads a local photograph and crops it to the frame opening.
 * A missing file keeps the painted stand-in, so a 404 never breaks the mesh.
 */
export function usePhotoMap(src: string, seed: number, viewAspect: number, biasY: number) {
  const [map, setMap] = useState<Texture>(() => placeholderTexture(seed));

  useEffect(() => {
    let alive = true;
    const probe = new Image();
    // A missing file keeps the painted stand-in. There is no broken-image mesh.
    probe.onload = () => {
      if (!alive) return;
      const loaded = new Texture(probe);
      loaded.colorSpace = SRGBColorSpace;
      loaded.anisotropy = 8;
      applyCover(loaded, viewAspect, biasY);
      loaded.needsUpdate = true;
      setMap(loaded);
    };
    probe.onerror = () => {};
    probe.src = src;
    return () => {
      alive = false;
    };
  }, [src, seed, viewAspect, biasY]);

  useEffect(() => {
    return () => map.dispose();
  }, [map]);

  return map;
}

function placeholderTexture(seed: number) {
  const texture = new CanvasTexture(getPlaceholderCanvas(seed));
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
