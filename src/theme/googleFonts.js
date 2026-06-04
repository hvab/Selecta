import { FONT_SOURCE_GOOGLE } from './fonts.js';

export const GOOGLE_FONTS_CSS2_BASE_URL = 'https://fonts.googleapis.com/css2';
export const GOOGLE_FONTS_CYRILLIC_SUBSET = 'cyrillic';

const requiredStyleVariants = [
  { variant: '400', italic: false, weight: 400 },
  { variant: '700', italic: false, weight: 700 },
  { variant: '400i', italic: true, weight: 400 },
];

function normalizeSearchText(value) {
  return value.trim().toLowerCase();
}

function encodeCss2FamilyName(family) {
  return encodeURIComponent(family).replace(/%20/g, '+');
}

function getUniqueFonts(fonts) {
  const seenFamilies = new Set();

  return fonts.filter((font) => {
    if (seenFamilies.has(font.family)) {
      return false;
    }

    seenFamilies.add(font.family);
    return true;
  });
}

export function hasGoogleFontSubset(font, subset) {
  return font.subsets.includes(subset);
}

export function findGoogleFont(catalog, family) {
  return catalog.find((font) => font.family === family) ?? null;
}

export function filterGoogleFonts(catalog, { cyrillicOnly = true, query = '', category = '' } = {}) {
  const normalizedQuery = normalizeSearchText(query);

  return catalog.filter(
    (font) =>
      (!cyrillicOnly || hasGoogleFontSubset(font, GOOGLE_FONTS_CYRILLIC_SUBSET)) &&
      (!normalizedQuery || font.family.toLowerCase().includes(normalizedQuery)) &&
      (!category || font.category === category)
  );
}

export function getRequiredGoogleFontStyleTuples(font) {
  return requiredStyleVariants
    .filter(({ variant }) => font.variants.includes(variant))
    .map(({ italic, weight }) => ({ italic, weight }));
}

export function getGoogleFontCss2FamilyParam(font) {
  const tuples = getRequiredGoogleFontStyleTuples(font);

  if (tuples.length === 1 && tuples[0].weight === 400 && !tuples[0].italic) {
    return encodeCss2FamilyName(font.family);
  }

  if (tuples.some(({ italic }) => italic)) {
    return `${encodeCss2FamilyName(font.family)}:ital,wght@${tuples
      .map(({ italic, weight }) => `${italic ? 1 : 0},${weight}`)
      .join(';')}`;
  }

  return `${encodeCss2FamilyName(font.family)}:wght@${tuples.map(({ weight }) => weight).join(';')}`;
}

export function getGoogleFontsCss2Url(fonts) {
  const familyParams = getUniqueFonts(fonts).map((font) => `family=${getGoogleFontCss2FamilyParam(font)}`);

  return `${GOOGLE_FONTS_CSS2_BASE_URL}?${familyParams.join('&')}&display=swap`;
}

export function getSelectedGoogleFonts(catalog, typography) {
  return getUniqueFonts(
    [
      typography.mainFontSource === FONT_SOURCE_GOOGLE ? typography.mainFontFamily : '',
      typography.noteFontSource === FONT_SOURCE_GOOGLE ? typography.noteFontFamily : '',
    ]
      .map((family) => findGoogleFont(catalog, family))
      .filter(Boolean)
  );
}

export function getSelectedGoogleFontsCss2Url(catalog, typography) {
  const fonts = getSelectedGoogleFonts(catalog, typography);

  return fonts.length ? getGoogleFontsCss2Url(fonts) : '';
}
