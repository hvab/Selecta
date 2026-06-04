export const systemFonts = [
  {
    value: 'Arial, Helvetica, sans-serif',
    label: 'Arial',
  },
  {
    value: 'Georgia, "Times New Roman", serif',
    label: 'Georgia',
  },
  {
    value: 'Verdana, Geneva, sans-serif',
    label: 'Verdana',
  },
  {
    value: '"Trebuchet MS", Helvetica, sans-serif',
    label: 'Trebuchet MS',
  },
  {
    value: '"Times New Roman", Times, serif',
    label: 'Times New Roman',
  },
  {
    value: '"Courier New", Courier, monospace',
    label: 'Courier New',
  },
];

const fontFamilyValuePattern = /^[A-Za-z0-9 "'_,.-]+$/;

export const FONT_SOURCE_PLAIN = 'plain';
export const FONT_SOURCE_SYSTEM = 'system';
export const FONT_SOURCE_GOOGLE = 'google';

const fontSources = [FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM, FONT_SOURCE_GOOGLE];

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

export function getFontFamilyCssValue(source, value, fallbackValue) {
  return source === FONT_SOURCE_PLAIN ? null : normalizeFontFamily(value, fallbackValue);
}
