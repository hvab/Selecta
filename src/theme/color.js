export function parseHexColor(color) {
  const hex = color.length === 4 ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : color;

  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

export function normalizeHexColor(color) {
  const { r, g, b } = parseHexColor(color);

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function getLinearChannel(channel) {
  const normalized = channel / 255;

  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(color) {
  const { r, g, b } = typeof color === 'string' ? parseHexColor(color) : color;
  const red = getLinearChannel(r);
  const green = getLinearChannel(g);
  const blue = getLinearChannel(b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(colorA, colorB) {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

export function hexToRgba(color, alpha) {
  const { r, g, b } = parseHexColor(color);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
