/**
 * Craft palette for the gallery.
 * Mina-kari enamel: deep blue, turquoise, lacquer red, and gold on cream.
 * Khatam-kari marquetry: dark wood with small gold stars.
 * creamDeep and ceiling are tonal steps of the cream, used only for plaster and stone.
 * The same hex values are repeated in app/globals.css.
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
  /** Matte gallery plaster. Kept off the craft enamel so the walls stay quiet. */
  plaster: "#f8fafc",
  /** Warm daylight used by the sun, the fill, and the picture lights. */
  sunlight: "#fffbeb",
} as const;
