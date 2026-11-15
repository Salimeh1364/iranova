"use client";

import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { loadNastaliq, paintVerse, VERSE_HANGS, type VerseHang } from "@/scene/artwork/verseSheet";

/**
 * Mowlana's rubai on the two walls of the passage.
 * The right wall holds the first couplet, the left wall the second.
 * Ink only: no cartouche, no product code, no caption.
 */
export function WallVerse() {
  return (
    <group>
      {VERSE_HANGS.map((hang) => (
        <VersePlane key={hang.position[0]} hang={hang} />
      ))}
    </group>
  );
}

function VersePlane({ hang }: { hang: VerseHang }) {
  const map = useVerseMap(hang.lines);
  if (!map) return null;

  return (
    <mesh
      position={hang.position}
      rotation={[0, hang.rotationY, 0]}
      // The inscription is not a picture. Clicks pass through it.
      raycast={() => {}}
    >
      <planeGeometry args={[hang.width, hang.height]} />
      <meshStandardMaterial
        map={map}
        transparent
        alphaTest={0.04}
        roughness={0.92}
        metalness={0}
      />
    </mesh>
  );
}

/** One texture, painted once the Nastaʿliq face is ready. */
function useVerseMap(lines: readonly string[]) {
  const [map, setMap] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    let alive = true;
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 1500;

    const paint = async () => {
      const family = await loadNastaliq();
      if (!alive) return;
      paintVerse(canvas, lines, family);
      const texture = new CanvasTexture(canvas);
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      setMap(texture);
    };

    void paint();
    return () => {
      alive = false;
    };
  }, [lines]);

  useEffect(() => {
    return () => map?.dispose();
  }, [map]);

  return map;
}
