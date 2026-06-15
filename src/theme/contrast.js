import { getContrastRatio, normalizeHexColor, parseHexColor } from './color.js';

export const MIN_CONTRAST_RATIO = 3;

const MIN_DISTINGUISHABLE_HUE_DIFFERENCE = 45;

function hasLowContrast(foreground, background) {
  return getContrastRatio(foreground, background) < MIN_CONTRAST_RATIO;
}

function hasSameColor(colorA, colorB) {
  return normalizeHexColor(colorA) === normalizeHexColor(colorB);
}

function getHueDegrees(color) {
  const { r, g, b } = parseHexColor(color);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  if (delta === 0) {
    return 0;
  }

  let hue = 0;

  if (max === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return (hue * 60 + 360) % 360;
}

function getHueDifference(colorA, colorB) {
  const difference = Math.abs(getHueDegrees(colorA) - getHueDegrees(colorB));

  return Math.min(difference, 360 - difference);
}

function areAccentColorsConfusable(colorA, colorB) {
  return getHueDifference(colorA, colorB) < MIN_DISTINGUISHABLE_HUE_DIFFERENCE;
}

function addWarning(warnings, id, fields) {
  warnings.push({ id, fields });
}

export function isAccentPairDistinguishable(colorA, colorB) {
  if (hasSameColor(colorA, colorB)) {
    return false;
  }

  return !(hasLowContrast(colorA, colorB) && areAccentColorsConfusable(colorA, colorB));
}

export function getContrastWarnings(palette) {
  const warnings = [];

  if (hasLowContrast(palette.foreground, palette.background)) {
    addWarning(warnings, 'textOnBackground', ['foreground']);
  }

  if (hasLowContrast(palette.headings, palette.background)) {
    addWarning(warnings, 'headingsOnBackground', ['headings']);
  }

  if (hasLowContrast(palette.link, palette.background)) {
    addWarning(warnings, 'linksOnBackground', ['link']);
  }

  if (hasLowContrast(palette.linkVisited, palette.background)) {
    addWarning(warnings, 'visitedLinksOnBackground', ['linkVisited']);
  }

  if (hasLowContrast(palette.hover, palette.background)) {
    addWarning(warnings, 'hoverOnBackground', ['hover']);
  }

  if (hasLowContrast(palette.tag, palette.background)) {
    addWarning(warnings, 'tagsOnBackground', ['tag']);
  }

  if (hasLowContrast(palette.engineText, palette.background)) {
    addWarning(warnings, 'secondaryTextOnBackground', ['engineText']);
  }

  if (hasLowContrast(palette.active, palette.background)) {
    addWarning(warnings, 'activeNavOnBackground', ['active']);
  }

  if (hasLowContrast(palette.inputText, palette.inputBackground)) {
    addWarning(warnings, 'inputTextOnInputBackground', ['inputText', 'inputBackground']);
  }

  if (hasLowContrast(palette.foreground, palette.markedTextBackground)) {
    addWarning(warnings, 'textOnMarkedBackground', ['markedTextBackground', 'foreground']);
  }

  if (
    !hasSameColor(palette.hover, palette.link) &&
    hasLowContrast(palette.hover, palette.link) &&
    areAccentColorsConfusable(palette.hover, palette.link)
  ) {
    addWarning(warnings, 'hoverVsLink', ['hover', 'link']);
  }

  if (hasSameColor(palette.link, palette.linkVisited)) {
    addWarning(warnings, 'linkSameAsVisited', ['link', 'linkVisited']);
  }

  if (hasSameColor(palette.link, palette.hover)) {
    addWarning(warnings, 'linkSameAsHover', ['link', 'hover']);
  }

  if (hasSameColor(palette.linkVisited, palette.hover)) {
    addWarning(warnings, 'visitedSameAsHover', ['linkVisited', 'hover']);
  }

  return warnings;
}

export function isPaletteContrastValid(palette) {
  return getContrastWarnings(palette).length === 0;
}

export function getContrastWarningsByField(palette) {
  const warningsByField = {};

  for (const warning of getContrastWarnings(palette)) {
    for (const field of warning.fields) {
      if (!warningsByField[field]) {
        warningsByField[field] = [];
      }

      if (!warningsByField[field].includes(warning.id)) {
        warningsByField[field].push(warning.id);
      }
    }
  }

  return warningsByField;
}
