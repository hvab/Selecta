import test from 'node:test';
import assert from 'node:assert/strict';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import {
  FONT_SOURCE_GOOGLE,
  FONT_SOURCE_PLAIN,
  FONT_SOURCE_SYSTEM,
  fontPool,
  namedSystemFamilies,
  normalizeFontSource,
  normalizeTypographyFontSources,
  systemStackVariants,
} from './fonts.js';

test('namedSystemFamilies lists preset system font stacks', () => {
  assert.deepEqual(
    namedSystemFamilies.map((family) => family.value),
    ['Georgia, serif', '"Helvetica Neue", Helvetica, Arial, sans-serif']
  );
});

test('fontPool includes system stacks, named families, and Google catalog', () => {
  const poolFamilies = new Set(fontPool.map((entry) => entry.family));

  for (const stack of systemStackVariants) {
    assert.equal(poolFamilies.has(stack.value), true);
  }

  for (const family of namedSystemFamilies) {
    assert.equal(poolFamilies.has(family.value), true);
  }

  for (const font of googleFontsCatalog) {
    assert.equal(poolFamilies.has(font.family), true);
  }

  assert.equal(fontPool.length, systemStackVariants.length + namedSystemFamilies.length + googleFontsCatalog.length);
});

test('googleFontsCatalog entries include fields required by googleFonts helpers', () => {
  for (const font of googleFontsCatalog) {
    assert.equal(typeof font.family, 'string');
    assert.equal(typeof font.category, 'string');
    assert.equal(Array.isArray(font.subsets), true);
    assert.equal(Array.isArray(font.variants), true);
    assert.equal(font.subsets.length > 0, true);
    assert.equal(font.variants.length > 0, true);
  }
});

test('googleFontsCatalog contains only curated Cyrillic families', () => {
  const families = new Set(googleFontsCatalog.map((font) => font.family));

  for (const font of googleFontsCatalog) {
    assert.equal(font.subsets.includes('cyrillic'), true);
  }

  assert.equal(families.has('PT Sans'), true);
  assert.equal(families.has('Zilla Slab'), false);
});

test('normalizes unknown Google Font families to plain typography', () => {
  assert.equal(normalizeFontSource(FONT_SOURCE_GOOGLE, 'Missing Font'), FONT_SOURCE_PLAIN);

  assert.deepEqual(
    normalizeTypographyFontSources({
      mainFontSource: FONT_SOURCE_GOOGLE,
      mainFontFamily: 'Missing Font',
      noteFontSource: FONT_SOURCE_GOOGLE,
      noteFontFamily: 'PT Serif',
    }),
    {
      mainFontSource: FONT_SOURCE_PLAIN,
      mainFontFamily: 'Missing Font',
      noteFontSource: FONT_SOURCE_GOOGLE,
      noteFontFamily: 'PT Serif',
    }
  );
});

test('fontPool assigns sources to system and Google entries', () => {
  const systemEntries = fontPool.filter((entry) => entry.source === FONT_SOURCE_SYSTEM);
  const googleEntries = fontPool.filter((entry) => entry.source === FONT_SOURCE_GOOGLE);

  assert.equal(systemEntries.length, systemStackVariants.length + namedSystemFamilies.length);
  assert.equal(googleEntries.length, googleFontsCatalog.length);
  assert.equal(
    fontPool.every((entry) => entry.source === FONT_SOURCE_SYSTEM || entry.source === FONT_SOURCE_GOOGLE),
    true
  );
});
