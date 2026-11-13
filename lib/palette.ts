/**
 * Shared colors for the gallery and the HTML overlay.
 * The rooms are matte light olive, with off-white columns and a concrete floor.
 * Cream and enamel tokens stay with the overlay in app/globals.css.
 */
export const palette = {
  cream: "#F3E6CF",
  creamDeep: "#E7D5B8",
  ceiling: "#E4CDB0",
  enamelBlue: "#174A78",
  turquoise: "#279C99",
  lacquer: "#B83A36",
  gold: "#D4A64A",
  wood: "#57352B",
  ink: "#174A78",
  lightWarm: "#FFF3DE",
  // Pure white for the spotlights, #ffffff.
  white: "#ffffff",
  // Light olive sage for the main walls, #8a9a86. Roughness 0.85 in the plaster material.
  plaster: "#8a9a86",
  // Crisp off-white for the columns and the ceiling, #f8fafc.
  trim: "#f8fafc",
  // Smooth light concrete, #dcdad5. The deeper value is the floor speckle.
  stone: "#dcdad5",
  stoneDeep: "#c5c3bd",
  // Daylight through the glazed entrance, #fffaf4.
  daylight: "#fffaf4",
  // Bright white light for the ceiling spots and the picture lights.
  lamp: "#ffffff",
  // Pale metal for small fittings.
  metal: "#c5ced6",
  // Matte dark bronze aluminum for the entrance frame, #1e293b.
  bronze: "#1e293b",
  // Warm stained wood for the arched entrance, close to a medium walnut.
  door: "#8f5b38",
  // Lighter streak in the door grain.
  doorPanel: "#c4895c",
  // Thin dark frame around each painting.
  frame: "#2c2926",
} as const;
