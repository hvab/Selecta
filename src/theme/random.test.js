import test from 'node:test';
import assert from 'node:assert/strict';
import { isPaletteContrastValid } from './contrast.js';
import { createEmptyFieldLocks } from './fieldLocks.js';
import { FONT_SOURCE_GOOGLE, FONT_SOURCE_SYSTEM, systemStackVariants } from './fonts.js';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import { initialThemeState } from './model.js';
import { buildRandomPalette, getRandomThemeState } from './random.js';

const googleFontFamilies = new Set(googleFontsCatalog.map((font) => font.family));
const systemFontFamilies = new Set(systemStackVariants.map((stack) => stack.value));

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

test('getRandomThemeState typography pairs source with catalog or system family', () => {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const { typography } = getRandomThemeState(initialThemeState);

    if (typography.mainFontSource === FONT_SOURCE_GOOGLE) {
      assert.ok(googleFontFamilies.has(typography.mainFontFamily));
    } else {
      assert.equal(typography.mainFontSource, FONT_SOURCE_SYSTEM);
      assert.ok(systemFontFamilies.has(typography.mainFontFamily));
    }

    if (typography.noteFontSource === FONT_SOURCE_GOOGLE) {
      assert.ok(googleFontFamilies.has(typography.noteFontFamily));
    } else {
      assert.equal(typography.noteFontSource, FONT_SOURCE_SYSTEM);
      assert.ok(systemFontFamilies.has(typography.noteFontFamily));
    }
  }
});

test('getRandomThemeState can pick Google Fonts for typography', () => {
  let sawGoogleMain = false;
  let sawGoogleNote = false;

  for (let attempt = 0; attempt < 64; attempt += 1) {
    const { typography } = getRandomThemeState(initialThemeState);

    if (typography.mainFontSource === FONT_SOURCE_GOOGLE) {
      sawGoogleMain = true;
    }

    if (typography.noteFontSource === FONT_SOURCE_GOOGLE) {
      sawGoogleNote = true;
    }

    if (sawGoogleMain && sawGoogleNote) {
      break;
    }
  }

  assert.equal(sawGoogleMain, true);
  assert.equal(sawGoogleNote, true);
});

test('getRandomThemeState keeps locked font family and source', () => {
  const fieldLocks = createEmptyFieldLocks();

  fieldLocks.typography.mainFontFamily = true;
  fieldLocks.typography.noteFontFamily = true;

  const currentState = {
    ...initialThemeState,
    typography: {
      ...initialThemeState.typography,
      mainFontSource: FONT_SOURCE_GOOGLE,
      mainFontFamily: 'Inter',
      noteFontSource: FONT_SOURCE_SYSTEM,
      noteFontFamily: systemStackVariants[1].value,
    },
  };

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const randomState = getRandomThemeState(currentState, fieldLocks);

    assert.equal(randomState.typography.mainFontSource, FONT_SOURCE_GOOGLE);
    assert.equal(randomState.typography.mainFontFamily, 'Inter');
    assert.equal(randomState.typography.noteFontSource, FONT_SOURCE_SYSTEM);
    assert.equal(randomState.typography.noteFontFamily, systemStackVariants[1].value);
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
