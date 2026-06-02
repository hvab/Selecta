import { getContrastRatio, getRelativeLuminance, normalizeHexColor } from './color.js';
import { isAccentPairDistinguishable, isPaletteContrastValid, MIN_CONTRAST_RATIO } from './contrast.js';
import { initialThemeState } from './model.js';
import { systemFonts } from './fonts.js';

const MAX_COLOR_ATTEMPTS = 64;

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min, max, step) {
  return min + Math.floor(Math.random() * ((max - min) / step + 1)) * step;
}

function getRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
}

function isExcludedColor(color, exclude) {
  return exclude.some((item) => normalizeHexColor(item) === normalizeHexColor(color));
}

function pickContrastingColor(background, exclude = []) {
  for (let attempt = 0; attempt < MAX_COLOR_ATTEMPTS; attempt += 1) {
    const color = getRandomColor();

    if (isExcludedColor(color, exclude)) {
      continue;
    }

    if (getContrastRatio(color, background) >= MIN_CONTRAST_RATIO) {
      return color;
    }
  }

  return getRelativeLuminance(background) > 0.179 ? '#111111' : '#f8f8f8';
}

function pickHoverColor(background, link, linkVisited) {
  for (let attempt = 0; attempt < MAX_COLOR_ATTEMPTS; attempt += 1) {
    const hover = pickContrastingColor(background, [link, linkVisited]);

    if (isAccentPairDistinguishable(hover, link) && isAccentPairDistinguishable(hover, linkVisited)) {
      return hover;
    }
  }

  return pickContrastingColor(background, [link, linkVisited]);
}

export function buildRandomPalette() {
  const background = getRandomColor();
  const foreground = pickContrastingColor(background);
  const headings = pickContrastingColor(background);
  const link = pickContrastingColor(background);
  const linkVisited = pickContrastingColor(background, [link]);
  const hover = pickHoverColor(background, link, linkVisited);
  const tag = pickContrastingColor(background);
  const engineText = pickContrastingColor(background);
  const active = pickContrastingColor(background);
  let markedTextBackground = getRandomColor();

  if (getContrastRatio(foreground, markedTextBackground) < MIN_CONTRAST_RATIO) {
    markedTextBackground = pickContrastingColor(foreground);
  }

  const inputBackground = getRandomColor();
  const inputText = pickContrastingColor(inputBackground);

  const palette = {
    background,
    foreground,
    headings,
    link,
    linkVisited,
    hover,
    tag,
    engineText,
    active,
    markedTextBackground,
    inputBackground,
    inputText,
  };

  if (!isPaletteContrastValid(palette)) {
    return { ...initialThemeState.palette };
  }

  return palette;
}

export function getRandomThemeState() {
  const themeNumber = Math.floor(Math.random() * 9000) + 1000;

  return {
    meta: {
      folderName: `random-theme-${themeNumber}`,
      displayName: `Random Theme ${themeNumber}`,
    },
    palette: buildRandomPalette(),
    typography: {
      mainFontFamily: getRandomItem(systemFonts).value,
      noteFontFamily: getRandomItem(systemFonts).value,
      noteTextSize: `${getRandomNumber(14, 24, 1)}px`,
      noteTextLineHeight: Number(getRandomNumber(1.3, 1.9, 0.05).toFixed(2)),
      titleScale: Number(getRandomNumber(1.2, 2, 0.05).toFixed(2)),
    },
    layout: {
      maxWidth: `${getRandomNumber(36, 64, 1)}rem`,
      margins: `${getRandomNumber(1, 4, 0.25)}rem`,
    },
  };
}
