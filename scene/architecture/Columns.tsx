"use client";

import { useEffect, useMemo } from "react";
import {
  CanvasTexture,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
} from "three";
import { palette } from "@/lib/palette";
import { COLUMN, COLUMNS, HALL } from "@/scene/hall";

/**
 * White columns at the arch jambs and the room corners.
 * A round plinth, a lightly fluted shaft, and a capital, all one matte plaster.
 * A low wash rises from the plinth and stays on the shaft.
 */

const BASE = 0.1;
const CAPITAL = 0.12;
// Round enough for a soft highlight. A coarser prism facets under the wash.
const SIDES = 24;

export function Columns() {
  const materials = useColumnMaterials();

  return (
    <group>
      {COLUMNS.map((column) => (
        <Column
          key={`${column.x}-${column.z}`}
          x={column.x}
          z={column.z}
          plaster={materials.plaster}
          shaft={materials.shaft}
        />
      ))}
    </group>
  );
}

function Column({
  x,
  z,
  plaster,
  shaft,
}: {
  x: number;
  z: number;
  plaster: MeshStandardMaterial;
  shaft: MeshStandardMaterial;
}) {
  const shaftHeight = HALL.wallHeight - BASE - CAPITAL;

  return (
    <group position={[x, 0, z]}>
      {/* Plinth. Same white plaster as the shaft and the capital. */}
      <mesh position={[0, BASE / 2, 0]} material={plaster} castShadow receiveShadow>
        <cylinderGeometry args={[COLUMN.radius, COLUMN.radius + 0.02, BASE, SIDES]} />
      </mesh>
      {/* Shaft. Flutes live in the bump map. The uplight lives in the shader. */}
      <mesh position={[0, BASE + shaftHeight / 2, 0]} material={shaft} castShadow receiveShadow>
        <cylinderGeometry args={[COLUMN.shaft, COLUMN.shaft, shaftHeight, SIDES]} />
      </mesh>
      {/* Capital, where the shaft meets the ceiling. */}
      <mesh position={[0, HALL.wallHeight - CAPITAL / 2, 0]} material={plaster} castShadow receiveShadow>
        <cylinderGeometry args={[COLUMN.radius + 0.02, COLUMN.shaft + 0.04, CAPITAL, SIDES]} />
      </mesh>
    </group>
  );
}

/** One shared pair of materials, so every column uses the same program. */
function useColumnMaterials() {
  const materials = useMemo(() => {
    const flutes = fluteBumpMap();
    const plaster = new MeshStandardMaterial({
      // #f8fafc. Matte, so the base wash is the only warmth.
      color: palette.trim,
      roughness: 0.78,
      metalness: 0,
    });
    const shaft = plaster.clone();
    shaft.bumpMap = flutes;
    // A whisper of relief. Stronger values line the shaft and darken the grooves.
    shaft.bumpScale = 5;
    applyBaseUplight(shaft);
    return { plaster, shaft, flutes };
  }, []);

  useEffect(() => {
    return () => {
      materials.plaster.dispose();
      materials.shaft.dispose();
      materials.flutes.dispose();
    };
  }, [materials]);

  return materials;
}

/**
 * Vertical flutes as a height map.
 * The shaft stays a 24-side cylinder. The grooves are shading, not extra triangles.
 */
function fluteBumpMap() {
  const width = 128;
  const height = 4;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Column flute map needs a canvas");
  }
  const image = ctx.createImageData(width, height);
  const flutes = 8;
  for (let x = 0; x < width; x++) {
    const theta = (x / width) * Math.PI * 2 * flutes;
    // A low ridge, held near mid-gray so the groove never reads as a dark line.
    const ridge = 0.5 + 0.32 * Math.cos(theta);
    const v = Math.round(ridge * 255);
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      image.data[i] = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = NoColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * A warm wash rising from the plinth.
 * It dies on the lower shaft, on this mesh alone.
 * A real lamp here would enter every material in the room.
 */
function applyBaseUplight(material: MeshStandardMaterial) {
  material.customProgramCacheKey = () => "column-base-uplight";
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         varying vec3 vColumnWorld;
         varying vec3 vColumnNormal;
         varying vec2 vColumnAxis;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vColumnWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
         vColumnNormal = normalize(mat3(modelMatrix) * objectNormal);
         vColumnAxis = vec2(modelMatrix[3].x, modelMatrix[3].z);`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         varying vec3 vColumnWorld;
         varying vec3 vColumnNormal;
         varying vec2 vColumnAxis;
         // How much of the plinth lamp reaches this point on the shaft.
         float columnWash(vec3 lightPos) {
           vec3 toLight = lightPos - vColumnWorld;
           float dist = length(toLight);
           vec3 dir = toLight / max(dist, 0.001);
           float facing = clamp(dot(normalize(vColumnNormal), dir), 0.0, 1.0);
           // A little wrap, so the far side of the shaft still turns.
           float wrap = clamp(facing * 0.65 + 0.35, 0.0, 1.0);
           float reach = exp(-dist * dist * 0.72);
           return wrap * reach;
         }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `// Just outside the plinth, grazing up the lower flutes.
         vec3 baseLamp = vec3(vColumnAxis.x, 0.18, vColumnAxis.y) + vec3(0.26, 0.0, 0.12);
         float wash = columnWash(baseLamp);
         vec3 warm = vec3(1.0, 0.86, 0.64);
         float amount = clamp(wash * 0.7, 0.0, 0.18);
         outgoingLight = mix(outgoingLight, outgoingLight * warm, amount);
         #include <opaque_fragment>`,
      );
  };
}
