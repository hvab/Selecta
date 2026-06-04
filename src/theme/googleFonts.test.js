import test from 'node:test';
import assert from 'node:assert/strict';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import {
  filterGoogleFonts,
  findGoogleFont,
  getGoogleFontCss2FamilyParam,
  getGoogleFontsCss2Url,
  getRequiredGoogleFontStyleTuples,
} from './googleFonts.js';

test('filters Google Fonts to Cyrillic families by default', () => {
  const fonts = filterGoogleFonts(googleFontsCatalog);

  assert.equal(
    fonts.some((font) => font.family === 'PT Sans'),
    true
  );
  assert.equal(
    fonts.some((font) => font.family === 'Zilla Slab'),
    false
  );
});

test('can include latin-only fonts when Cyrillic filter is disabled', () => {
  const fonts = filterGoogleFonts(googleFontsCatalog, { cyrillicOnly: false, query: 'zilla' });

  assert.deepEqual(
    fonts.map((font) => font.family),
    ['Zilla Slab']
  );
});

test('filters Google Fonts by query and category', () => {
  const fonts = filterGoogleFonts(googleFontsCatalog, { query: 'noto', category: 'Serif' });

  assert.deepEqual(
    fonts.map((font) => font.family),
    ['Noto Serif']
  );
});

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

test('builds deduplicated CSS2 URLs', () => {
  const ptSans = findGoogleFont(googleFontsCatalog, 'PT Sans');
  const lora = findGoogleFont(googleFontsCatalog, 'Lora');

  assert.equal(
    getGoogleFontsCss2Url([ptSans, lora, ptSans]),
    'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&display=swap'
  );
});
