/**
 * An original color field for one frame.
 * The seed only picks a palette and a layout. These are not copies of any painting.
 */
export function paintAbstract(seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 800;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Artwork panel requires a 2D canvas.");

  const palettes = [
    ["#f4efe6", "#e25b45", "#f2c14e", "#2f6f62"],
    ["#f6f3ee", "#4d7ea8", "#e8d7b0", "#8c4a3a"],
    ["#f3efe6", "#c4492c", "#e6b15a", "#1f4d4a"],
    ["#f7f4ee", "#7eb8a2", "#d7e36a", "#3d6b8c"],
  ] as const;
  const colors = palettes[seed % palettes.length];

  let state = seed * 17 + 9;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return (state & 0xfffffff) / 0xfffffff;
  };

  context.fillStyle = colors[0];
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 14; index += 1) {
    context.fillStyle = colors[1 + (index % 3)];
    context.globalAlpha = 0.55 + random() * 0.4;
    const width = 40 + random() * 220;
    const height = 30 + random() * 180;
    context.beginPath();
    context.ellipse(
      random() * canvas.width,
      random() * canvas.height,
      width,
      height,
      random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  context.globalAlpha = 1;
  return canvas;
}
