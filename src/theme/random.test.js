import test from 'node:test';
import assert from 'node:assert/strict';
import { isPaletteContrastValid } from './contrast.js';
import { createEmptyFieldLocks } from './fieldLocks.js';
import { initialThemeState } from './model.js';
import { buildRandomPalette, getRandomThemeState } from './random.js';

test('buildRandomPalette passes contrast checks', () => {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    assert.equal(isPaletteContrastValid(buildRandomPalette(initialThemeState.palette)), true);
  }
});

test('getRandomThemeState palette passes contrast checks', () => {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    assert.equal(isPaletteContrastValid(getRandomThemeState(initialThemeState).palette), true);
  }
});

test('buildRandomPalette keeps locked colors', () => {
  const fieldLocks = createEmptyFieldLocks();

  fieldLocks.palette.background = true;
  fieldLocks.palette.link = true;

  const basePalette = {
    ...initialThemeState.palette,
    background: '#112233',
    link: '#aabbcc',
  };

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const palette = buildRandomPalette(basePalette, fieldLocks.palette);

    assert.equal(palette.background, '#112233');
    assert.equal(palette.link, '#aabbcc');
  }
});

test('getRandomThemeState keeps locked metadata and typography', () => {
  const fieldLocks = createEmptyFieldLocks();

  fieldLocks.meta.displayName = true;
  fieldLocks.typography.noteTextSize = true;

  const currentState = {
    ...initialThemeState,
    meta: {
      ...initialThemeState.meta,
      displayName: 'Locked Name',
      folderName: 'locked-theme',
    },
    typography: {
      ...initialThemeState.typography,
      noteTextSize: '20px',
    },
  };

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const randomState = getRandomThemeState(currentState, fieldLocks);

    assert.equal(randomState.meta.displayName, 'Locked Name');
    assert.equal(randomState.typography.noteTextSize, '20px');
    assert.notEqual(randomState.meta.folderName, 'locked-theme');
  }
});
