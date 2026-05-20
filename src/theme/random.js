import { systemFonts } from './fonts.js';

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

export function getRandomThemeState() {
  const themeNumber = Math.floor(Math.random() * 9000) + 1000;

  return {
    meta: {
      folderName: `random-theme-${themeNumber}`,
      displayName: `Random Theme ${themeNumber}`,
    },
    palette: {
      background: getRandomColor(),
      foreground: getRandomColor(),
      headings: getRandomColor(),
      link: getRandomColor(),
      linkVisited: getRandomColor(),
      hover: getRandomColor(),
      tag: getRandomColor(),
      engineText: getRandomColor(),
      active: getRandomColor(),
      markedTextBackground: getRandomColor(),
      inputBackground: getRandomColor(),
      inputText: getRandomColor(),
    },
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
