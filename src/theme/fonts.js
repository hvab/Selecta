export const UI_FONT_STACK = 'system-ui, sans-serif';
export const SERIF_FONT_STACK = 'ui-serif, Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif';
export const MONO_FONT_STACK = 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace';

export const systemStackVariants = [
  {
    value: UI_FONT_STACK,
    label: 'Sans-serif',
  },
  {
    value: SERIF_FONT_STACK,
    label: 'Serif',
  },
];

const fontFamilyValuePattern = /^[A-Za-z0-9 "'_,.-]+$/;

export const FONT_SOURCE_PLAIN = 'plain';
export const FONT_SOURCE_SYSTEM = 'system';
export const FONT_SOURCE_GOOGLE = 'google';

const fontSources = [FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM, FONT_SOURCE_GOOGLE];
const genericFontFamilies = [
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'emoji',
  'math',
  'fangsong',
];

function inferFontSourceFromFamily(value) {
  return typeof value === 'string' && value.trim() ? FONT_SOURCE_SYSTEM : FONT_SOURCE_PLAIN;
}

export function normalizeFontSource(value, fontFamilyValue) {
  return fontSources.includes(value) ? value : inferFontSourceFromFamily(fontFamilyValue);
}

export function normalizeTypographyFontSources(typography) {
  return {
    ...typography,
    mainFontSource: normalizeFontSource(typography.mainFontSource, typography.mainFontFamily),
    noteFontSource: normalizeFontSource(typography.noteFontSource, typography.noteFontFamily),
  };
}

export function normalizeFontFamily(value, fallbackValue) {
  if (typeof value !== 'string') {
    return fallbackValue;
  }

  const fontFamily = value.trim().replace(/ {2,}/g, ' ');

  return fontFamily && fontFamilyValuePattern.test(fontFamily) ? fontFamily : fallbackValue;
}

function hasGenericFontFamily(value) {
  return value
    .split(',')
    .map((fontFamily) =>
      fontFamily
        .trim()
        .replace(/^["']|["']$/g, '')
        .toLowerCase()
    )
    .some((fontFamily) => genericFontFamilies.includes(fontFamily));
}

function addFontFamilyFallback(value, fallbackValue) {
  return hasGenericFontFamily(value) ? value : `${value}, ${fallbackValue}`;
}

export function getFontFamilyCssValue(source, value, fallbackValue) {
  return source === FONT_SOURCE_PLAIN
    ? null
    : addFontFamilyFallback(normalizeFontFamily(value, fallbackValue), fallbackValue);
}
