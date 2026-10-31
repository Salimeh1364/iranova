import { BufferAttribute, type BufferGeometry } from "three";

/**
 * Writes UVs from vertex position so a curved soffit tiles the brick sheet.
 * ExtrudeGeometry's own UVs collapse on the inner arch, which paints the vault as one flat color.
 */
export function tileByPosition(
  geometry: BufferGeometry,
  uOf: (x: number, y: number, z: number) => number,
  vOf: (x: number, y: number, z: number) => number,
) {
  const position = geometry.getAttribute("position");
  const uv = new BufferAttribute(new Float32Array(position.count * 2), 2);

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    uv.setXY(index, uOf(x, y, z), vOf(x, y, z));
  }

  geometry.setAttribute("uv", uv);
  return geometry;
}
