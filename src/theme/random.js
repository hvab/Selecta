import { getContrastRatio, getRelativeLuminance, normalizeHexColor } from './color.js';
import { isAccentPairDistinguishable, isPaletteContrastValid, MIN_CONTRAST_RATIO } from './contrast.js';
import { createEmptyFieldLocks } from './fieldLocks.js';
import { FONT_SOURCE_GOOGLE, FONT_SOURCE_SYSTEM, systemStackVariants } from './fonts.js';
import { googleFontsCatalog } from './googleFontsCatalog.js';

const MAX_COLOR_ATTEMPTS = 64;
const MAX_PALETTE_ATTEMPTS = 32;

const fontPool = [
  ...systemStackVariants.map((stack) => ({ source: FONT_SOURCE_SYSTEM, family: stack.value })),
  ...googleFontsCatalog.map((font) => ({ source: FONT_SOURCE_GOOGLE, family: font.family })),
];

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

function buildRandomPaletteAttempt(basePalette, paletteLocks = {}) {
  const locked = (key) => paletteLocks[key] === true;
  const background = locked('background') ? basePalette.background : getRandomColor();
  const foreground = locked('foreground') ? basePalette.foreground : pickContrastingColor(background);
  const headings = locked('headings') ? basePalette.headings : pickContrastingColor(background);
  const link = locked('link') ? basePalette.link : pickContrastingColor(background);
  const linkVisited = locked('linkVisited') ? basePalette.linkVisited : pickContrastingColor(background, [link]);
  const hover = locked('hover') ? basePalette.hover : pickHoverColor(background, link, linkVisited);
  const tag = locked('tag') ? basePalette.tag : pickContrastingColor(background);
  const engineText = locked('engineText') ? basePalette.engineText : pickContrastingColor(background);
  const active = locked('active') ? basePalette.active : pickContrastingColor(background);
  let markedTextBackground = locked('markedTextBackground') ? basePalette.markedTextBackground : getRandomColor();

  if (!locked('markedTextBackground') && getContrastRatio(foreground, markedTextBackground) < MIN_CONTRAST_RATIO) {
    markedTextBackground = pickContrastingColor(foreground);
  }

  const inputBackground = locked('inputBackground') ? basePalette.inputBackground : getRandomColor();
  const inputText = locked('inputText') ? basePalette.inputText : pickContrastingColor(inputBackground);

  return {
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
}

export function buildRandomPalette(basePalette, paletteLocks = {}) {
  let lastPalette = null;

  for (let attempt = 0; attempt < MAX_PALETTE_ATTEMPTS; attempt += 1) {
    lastPalette = buildRandomPaletteAttempt(basePalette, paletteLocks);

    if (isPaletteContrastValid(lastPalette)) {
      return lastPalette;
    }
  }

  return lastPalette;
}

export function getRandomThemeState(currentState, fieldLocks = createEmptyFieldLocks()) {
  const themeNumber = Math.floor(Math.random() * 9000) + 1000;
  const mainFont = fieldLocks.typography.mainFontFamily
    ? {
        source: currentState.typography.mainFontSource,
        family: currentState.typography.mainFontFamily,
      }
    : getRandomItem(fontPool);
  const noteFont = fieldLocks.typography.noteFontFamily
    ? {
        source: currentState.typography.noteFontSource,
        family: currentState.typography.noteFontFamily,
      }
    : getRandomItem(fontPool);

  return {
    meta: {
      displayName: fieldLocks.meta.displayName ? currentState.meta.displayName : `Random Theme ${themeNumber}`,
      folderName: fieldLocks.meta.folderName ? currentState.meta.folderName : `random-theme-${themeNumber}`,
    },
    palette: buildRandomPalette(currentState.palette, fieldLocks.palette),
    typography: {
      mainFontSource: mainFont.source,
      mainFontFamily: mainFont.family,
      noteFontSource: noteFont.source,
      noteFontFamily: noteFont.family,
      noteTextSize: fieldLocks.typography.noteTextSize
        ? currentState.typography.noteTextSize
        : `${getRandomNumber(14, 24, 1)}px`,
      noteTextLineHeight: fieldLocks.typography.noteTextLineHeight
        ? currentState.typography.noteTextLineHeight
        : Number(getRandomNumber(1.3, 1.9, 0.05).toFixed(2)),
      titleScale: fieldLocks.typography.titleScale
        ? currentState.typography.titleScale
        : Number(getRandomNumber(1.2, 2, 0.05).toFixed(2)),
    },
    layout: {
      maxWidth: fieldLocks.layout.maxWidth ? currentState.layout.maxWidth : `${getRandomNumber(36, 64, 1)}rem`,
      margins: fieldLocks.layout.margins ? currentState.layout.margins : `${getRandomNumber(1, 4, 0.25)}rem`,
    },
  };
}
