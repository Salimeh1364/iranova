import { useEffect, useMemo, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { palette } from "@/lib/palette";

/** A small white plaque. Redrawn when the language changes. */
export function useNameplate(title: string, subtitle: string, rtl: boolean) {
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
    paintNameplate(canvas, title, subtitle, rtl);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
    // fontsReady repaints once the webfont can be measured.
  }, [title, subtitle, rtl, fontsReady]);

  useEffect(() => {
    return () => map.dispose();
  }, [map]);

  return map;
}

function paintNameplate(canvas: HTMLCanvasElement, title: string, subtitle: string, rtl: boolean) {
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

  ctx.font = fitFont(ctx, title, `600 72px ${family}`, canvas.width - pad * 2);
  ctx.fillText(title, anchor, 74);
  ctx.globalAlpha = 0.72;
  ctx.font = fitFont(ctx, subtitle, `500 40px ${family}`, canvas.width - pad * 2);
  ctx.fillText(subtitle, anchor, 140);
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
