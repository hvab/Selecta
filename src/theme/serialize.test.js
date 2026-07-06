import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeThemeFromUrlParam,
  deserializeThemeFile,
  deserializeTheme,
  encodeThemeToUrlParam,
  getThemeJsonFileName,
  serializeTheme,
  THEME_SERIALIZATION_VERSION,
} from './serialize.js';
import { initialThemeState } from './model.js';

test('serializes and deserializes theme state', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.displayName = 'Serialized Theme';
  themeState.palette.link = '#123456';
  themeState.darkPalette.link = '#abcdef';
  themeState.typography.noteTextLineHeight = 1.7;
  themeState.layout.maxWidth = '52rem';

  assert.deepEqual(deserializeTheme(serializeTheme(themeState)), themeState);
});

test('round-trips dark mode enabled theme state through JSON and URL params', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.supportsDarkMode = true;
  themeState.darkPalette.background = '#101820';
  themeState.darkPalette.link = '#66ccff';

  assert.deepEqual(deserializeTheme(serializeTheme(themeState)), themeState);
  assert.deepEqual(decodeThemeFromUrlParam(encodeThemeToUrlParam(themeState)), themeState);
});

test('round-trips dark mode disabled theme state without dropping dark palette data', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.supportsDarkMode = false;
  themeState.darkPalette.background = '#101820';
  themeState.darkPalette.link = '#66ccff';

  assert.deepEqual(deserializeTheme(serializeTheme(themeState)), themeState);
});

test('serializes only known theme state fields', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.extra = 'ignored';
  themeState.locale = 'ru';
  themeState.previewMode = 'dark';
  themeState.shellAppearance = 'dark';
  themeState.uiState = {
    activePaletteMode: 'dark',
  };
  themeState.extraSection = {
    value: 'ignored',
  };

  const serialized = JSON.parse(serializeTheme(themeState));

  assert.equal(serialized.version, THEME_SERIALIZATION_VERSION);
  assert.equal(serialized.meta.extra, undefined);
  assert.equal(serialized.locale, undefined);
  assert.equal(serialized.previewMode, undefined);
  assert.equal(serialized.shellAppearance, undefined);
  assert.equal(serialized.uiState, undefined);
  assert.equal(serialized.extraSection, undefined);
});

test('builds theme JSON file name from folder name', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.folderName = 'shared-theme';

  assert.equal(getThemeJsonFileName(themeState), 'shared-theme.selecta.json');
});

test('deserializes theme JSON files', async () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.displayName = 'Imported Theme';

  assert.deepEqual(await deserializeThemeFile(new Blob([serializeTheme(themeState)])), themeState);
});

test('ignores unknown fields while deserializing', () => {
  const data = {
    version: THEME_SERIALIZATION_VERSION,
    ...structuredClone(initialThemeState),
    unknown: 'ignored',
  };

  data.meta.unknown = 'ignored';

  assert.deepEqual(deserializeTheme(JSON.stringify(data)), initialThemeState);
});

test('rejects unsupported theme version', () => {
  assert.throws(
    () =>
      deserializeTheme(
        JSON.stringify({
          version: 999,
          ...structuredClone(initialThemeState),
        })
      ),
    /Unsupported theme version/
  );
});

test('rejects invalid theme JSON', () => {
  assert.throws(() => deserializeTheme('{'), /Invalid theme JSON/);
});

test('rejects incomplete theme data', () => {
  assert.throws(
    () =>
      deserializeTheme(
        JSON.stringify({
          version: THEME_SERIALIZATION_VERSION,
          meta: structuredClone(initialThemeState.meta),
        })
      ),
    /Invalid theme palette/
  );
});

test('rejects invalid theme field types', () => {
  const data = {
    version: THEME_SERIALIZATION_VERSION,
    ...structuredClone(initialThemeState),
  };

  data.layout.maxWidth = 52;

  assert.throws(() => deserializeTheme(JSON.stringify(data)), /Invalid theme layout.maxWidth/);
});

test('encodes and decodes theme state for URL params', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.meta.displayName = 'Café Theme';
  themeState.palette.hover = '#abcdef';

  assert.deepEqual(decodeThemeFromUrlParam(encodeThemeToUrlParam(themeState)), themeState);
});

test('rejects invalid URL theme params', () => {
  assert.throws(() => decodeThemeFromUrlParam('not valid base64'), /Invalid theme link/);
});
