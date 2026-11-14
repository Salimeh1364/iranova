"use client";

import { useEffect, useMemo, useState } from "react";
import { CanvasTexture, SRGBColorSpace, Texture } from "three";
import { palette } from "@/lib/palette";
import type { FamousFigure } from "@/content/famousFigures";
import { useI18n } from "@/i18n/I18nProvider";
import { getPlaceholderCanvas } from "@/scene/artwork/portraitPlaceholder";
import { selectFigure } from "@/scene/controls/figureSession";

export type PortraitFrameProps = {
  figure: FamousFigure;
};

// Border width, casing depth, and the proud inner bead. Same white as the entrance.
const BORDER = 0.11;
const CASING_D = 0.07;
const LIP = 0.045;
const LIP_D = 0.12;
// Back face sits just off the plaster. The anchor is already 4 cm inside the wall.
const BACK = 0.015;
const REVEAL = 0.008;
// Nameplate, in meters, hung just under the frame.
const PLATE_H = 0.2;
const PLATE_GAP = 0.08;

/**
 * A raised white frame, a portrait, and a nameplate.
 * Clicking the frame opens the biography in the active language.
 */
export function PortraitFrame({ figure }: PortraitFrameProps) {
  const { locale } = useI18n();
  const copy = figure.copy[locale];
  const { width, height } = figure.placement;
  const portrait = usePortraitMap(figure.image, figure.placement.seed);
  const plate = useNameplate(copy.name, copy.field, locale === "fa");

  const casingZ = BACK + CASING_D / 2;
  const lipZ = BACK + LIP_D / 2;
  const openingW = width - BORDER * 2;
  const openingH = height - BORDER * 2;
  const lipX = width / 2 - BORDER + LIP / 2 - REVEAL;
  const lipY = height / 2 - BORDER + LIP / 2 - REVEAL;
  const stileH = openingH - REVEAL * 2;

  return (
    <group
      position={figure.placement.position}
      rotation={[0, figure.placement.rotationY, 0]}
      onClick={(event) => {
        event.stopPropagation();
        selectFigure(figure.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* Outer casing, #f8fafc, roughness 0.72. Stiles run the full height. */}
      <Bar position={[-width / 2 + BORDER / 2, 0, casingZ]} size={[BORDER, height, CASING_D]} />
      <Bar position={[width / 2 - BORDER / 2, 0, casingZ]} size={[BORDER, height, CASING_D]} />
      <Bar position={[0, height / 2 - BORDER / 2, casingZ]} size={[openingW, BORDER, CASING_D]} />
      <Bar position={[0, -height / 2 + BORDER / 2, casingZ]} size={[openingW, BORDER, CASING_D]} />

      <Bar position={[-lipX, 0, lipZ]} size={[LIP, stileH, LIP_D]} />
      <Bar position={[lipX, 0, lipZ]} size={[LIP, stileH, LIP_D]} />
      <Bar position={[0, lipY, lipZ]} size={[openingW + LIP * 2, LIP, LIP_D]} />
      <Bar position={[0, -lipY, lipZ]} size={[openingW + LIP * 2, LIP, LIP_D]} />

      {/* Portrait, or the painted stand-in until a photograph is added. */}
      <mesh position={[0, 0, BACK + 0.02]}>
        <planeGeometry args={[openingW - 0.02, openingH - 0.02]} />
        <meshStandardMaterial map={portrait} roughness={0.9} metalness={0} />
      </mesh>

      {/* Name and field. The plaque uses the active language. */}
      <mesh position={[0, -height / 2 - PLATE_GAP - PLATE_H / 2, casingZ]}>
        <planeGeometry args={[width, PLATE_H]} />
        <meshStandardMaterial map={plate} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

/** Loads `/images/figures/*.jpg` and keeps the painted canvas if the file is missing. */
function usePortraitMap(src: string, seed: number) {
  const [map, setMap] = useState<Texture>(() => placeholderTexture(seed));

  useEffect(() => {
    let alive = true;
    const probe = new Image();
    // A missing file keeps the painted stand-in. There is no broken-image mesh.
    probe.onload = () => {
      if (!alive) return;
      const loaded = new Texture(probe);
      loaded.colorSpace = SRGBColorSpace;
      loaded.anisotropy = 4;
      loaded.needsUpdate = true;
      setMap(loaded);
    };
    probe.onerror = () => {};
    probe.src = src;
    return () => {
      alive = false;
    };
  }, [src, seed]);

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

/** A small white plaque. Redrawn when the language changes. */
function useNameplate(name: string, field: string, rtl: boolean) {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) setFontsReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 200;
    paintNameplate(canvas, name, field, rtl);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
    // fontsReady repaints once the webfont can be measured.
  }, [name, field, rtl, fontsReady]);

  useEffect(() => {
    return () => map.dispose();
  }, [map]);

  return map;
}

function paintNameplate(canvas: HTMLCanvasElement, name: string, field: string, rtl: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  ctx.fillStyle = palette.trim;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#174a78";
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = rtl ? "right" : "left";
  ctx.textBaseline = "middle";
  const pad = 56;
  const anchor = rtl ? canvas.width - pad : pad;

  ctx.font = fitFont(ctx, name, `600 72px ${family}`, canvas.width - pad * 2);
  ctx.fillText(name, anchor, 74);
  ctx.globalAlpha = 0.72;
  ctx.font = fitFont(ctx, field, `500 40px ${family}`, canvas.width - pad * 2);
  ctx.fillText(field, anchor, 140);
  ctx.globalAlpha = 1;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, font: string, maxWidth: number) {
  const match = font.match(/(\d+)px/);
  let size = match ? Number(match[1]) : 40;
  let next = font;
  ctx.font = next;
  while (ctx.measureText(text).width > maxWidth && size > 22) {
    size -= 2;
    next = font.replace(/\d+px/, `${size}px`);
    ctx.font = next;
  }
  return next;
}

function Bar({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      {/* #f8fafc, roughness 0.72, matching the entrance casing. */}
      <meshStandardMaterial color={palette.trim} roughness={0.72} metalness={0} />
    </mesh>
  );
}
