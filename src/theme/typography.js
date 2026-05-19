export function scalePixelSize(size, scale) {
  return `${roundPixelValue(Number.parseFloat(size) * scale)}px`;
}

export function getNoteTitleLineHeight(size) {
  return `${roundPixelValue(Number.parseFloat(size) * (7 / 6))}px`;
}

function roundPixelValue(value) {
  return Number(value.toFixed(4));
}
