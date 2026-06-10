import test from 'node:test';
import assert from 'node:assert/strict';
import { FONT_SOURCE_GOOGLE, FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM } from './fonts.js';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import {
  findGoogleFont,
  getGoogleFontCss2FamilyParam,
  getGoogleFontFamilyCssValue,
  getGoogleFontsCss2Url,
  getRequiredGoogleFontStyleTuples,
  getSelectedGoogleFonts,
  getSelectedGoogleFontsCss2Url,
} from './googleFonts.js';

test('finds Google Fonts by family name', () => {
  assert.equal(findGoogleFont(googleFontsCatalog, 'Roboto').family, 'Roboto');
  assert.equal(findGoogleFont(googleFontsCatalog, 'Missing'), null);
});

test('selects only required Aegea font styles', () => {
  assert.deepEqual(getRequiredGoogleFontStyleTuples(findGoogleFont(googleFontsCatalog, 'PT Sans')), [
    { italic: false, weight: 400 },
    { italic: false, weight: 700 },
    { italic: true, weight: 400 },
  ]);
  assert.deepEqual(getRequiredGoogleFontStyleTuples(findGoogleFont(googleFontsCatalog, 'Oswald')), [
    { italic: false, weight: 400 },
    { italic: false, weight: 700 },
  ]);
});

test('builds CSS2 family params', () => {
  assert.equal(
    getGoogleFontCss2FamilyParam(findGoogleFont(googleFontsCatalog, 'PT Sans')),
    'PT+Sans:ital,wght@0,400;0,700;1,400'
  );
  assert.equal(getGoogleFontCss2FamilyParam(findGoogleFont(googleFontsCatalog, 'Oswald')), 'Oswald:wght@400;700');
});

test('builds Google Font CSS values with category fallbacks', () => {
  assert.equal(
    getGoogleFontFamilyCssValue(findGoogleFont(googleFontsCatalog, 'PT Sans')),
    '"PT Sans", system-ui, sans-serif'
  );
  assert.equal(
    getGoogleFontFamilyCssValue(findGoogleFont(googleFontsCatalog, 'PT Serif')),
    '"PT Serif", ui-serif, Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif'
  );
});

test('builds deduplicated CSS2 URLs', () => {
  const ptSans = findGoogleFont(googleFontsCatalog, 'PT Sans');
  const lora = findGoogleFont(googleFontsCatalog, 'Lora');

  assert.equal(
    getGoogleFontsCss2Url([ptSans, lora, ptSans]),
    'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&display=swap'
  );
});

test('selects only active Google Fonts from typography', () => {
  const typography = {
    mainFontSource: FONT_SOURCE_GOOGLE,
    mainFontFamily: 'PT Sans',
    noteFontSource: FONT_SOURCE_SYSTEM,
    noteFontFamily: 'Georgia, serif',
  };

  assert.deepEqual(
    getSelectedGoogleFonts(googleFontsCatalog, typography).map((font) => font.family),
    ['PT Sans']
  );
});

test('builds selected Google Fonts CSS2 URLs with deduplication', () => {
  const typography = {
    mainFontSource: FONT_SOURCE_GOOGLE,
    mainFontFamily: 'PT Sans',
    noteFontSource: FONT_SOURCE_GOOGLE,
    noteFontFamily: 'PT Sans',
  };

  assert.equal(
    getSelectedGoogleFontsCss2Url(googleFontsCatalog, typography),
    'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap'
  );
});

test('skips Google Fonts CSS2 URL when typography has no Google source', () => {
  const typography = {
    mainFontSource: FONT_SOURCE_PLAIN,
    mainFontFamily: '',
    noteFontSource: FONT_SOURCE_SYSTEM,
    noteFontFamily: 'Georgia, serif',
  };

  assert.equal(getSelectedGoogleFontsCss2Url(googleFontsCatalog, typography), '');
});
