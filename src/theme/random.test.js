import test from 'node:test';
import assert from 'node:assert/strict';
import { isPaletteContrastValid } from './contrast.js';
import { buildRandomPalette, getRandomThemeState } from './random.js';

test('buildRandomPalette passes contrast checks', () => {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    assert.equal(isPaletteContrastValid(buildRandomPalette()), true);
  }
});

test('getRandomThemeState palette passes contrast checks', () => {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    assert.equal(isPaletteContrastValid(getRandomThemeState().palette), true);
  }
});
