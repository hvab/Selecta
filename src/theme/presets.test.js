import test from 'node:test';
import assert from 'node:assert/strict';
import { themePresets } from './presets.js';
import { initialThemeState } from './model.js';
import { FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM } from './fonts.js';

const expectedPresetIds = [
  'plain',
  'acute',
  'chancery',
  'douglas',
  'fiesta',
  'gal',
  'holm',
  'kolomna',
  'vox',
  'vulcano',
];
const expectedDarkPresetIds = ['plain', 'acute', 'fiesta', 'gal'];

test('includes the selected Aegea theme presets', () => {
  assert.deepEqual(
    themePresets.map((preset) => preset.id),
    expectedPresetIds
  );
});

test('each preset has the full Selecta palette contract', () => {
  const paletteKeys = Object.keys(initialThemeState.palette).sort();

  for (const preset of themePresets) {
    assert.deepEqual(Object.keys(preset.palette).sort(), paletteKeys, preset.id);
  }
});

test('dark-capable presets mirror Aegea dark-mode support', () => {
  assert.deepEqual(
    themePresets.filter((preset) => preset.supportsDarkMode).map((preset) => preset.id),
    expectedDarkPresetIds
  );
});

test('dark-capable presets have the full Selecta dark palette contract', () => {
  const paletteKeys = Object.keys(initialThemeState.darkPalette).sort();

  for (const preset of themePresets) {
    if (preset.supportsDarkMode) {
      assert.deepEqual(Object.keys(preset.darkPalette).sort(), paletteKeys, preset.id);
    } else {
      assert.equal(preset.darkPalette, null, preset.id);
    }
  }
});

test('each preset has the full Selecta typography contract', () => {
  const typographyKeys = Object.keys(initialThemeState.typography).sort();

  for (const preset of themePresets) {
    assert.deepEqual(Object.keys(preset.typography).sort(), typographyKeys, preset.id);
  }
});

test('preset palette values are normalized full hex colors', () => {
  const fullHexColor = /^#[0-9a-f]{6}$/;

  for (const preset of themePresets) {
    for (const [key, value] of Object.entries(preset.palette)) {
      assert.match(value, fullHexColor, `${preset.id}.${key}`);
    }
  }
});

test('plain preset matches the Selecta default theme state', () => {
  const plainPreset = themePresets.find((preset) => preset.id === 'plain');

  assert.deepEqual(plainPreset.palette, initialThemeState.palette);
  assert.deepEqual(plainPreset.darkPalette, initialThemeState.darkPalette);
  assert.equal(plainPreset.supportsDarkMode, true);
  assert.deepEqual(plainPreset.typography, initialThemeState.typography);
  assert.deepEqual(plainPreset.layout, initialThemeState.layout);
});

test('official presets keep Selecta layout and typography scale defaults', () => {
  for (const preset of themePresets) {
    assert.equal(preset.typography.noteTextSize, initialThemeState.typography.noteTextSize, preset.id);
    assert.equal(preset.typography.noteTextLineHeight, initialThemeState.typography.noteTextLineHeight, preset.id);
    assert.equal(preset.typography.titleScale, initialThemeState.typography.titleScale, preset.id);
    assert.deepEqual(preset.layout, initialThemeState.layout, preset.id);
  }
});

test('official presets mirror Aegea font overrides', () => {
  const presetsById = Object.fromEntries(themePresets.map((preset) => [preset.id, preset]));

  assert.equal(presetsById.plain.typography.mainFontSource, FONT_SOURCE_PLAIN);
  assert.equal(presetsById.chancery.typography.mainFontSource, FONT_SOURCE_SYSTEM);
  assert.equal(presetsById.chancery.typography.mainFontFamily, 'Georgia, serif');
  assert.equal(presetsById.chancery.typography.noteFontSource, FONT_SOURCE_SYSTEM);
  assert.equal(presetsById.chancery.typography.noteFontFamily, 'Georgia, serif');
  assert.equal(presetsById.holm.typography.mainFontSource, FONT_SOURCE_SYSTEM);
  assert.equal(presetsById.holm.typography.mainFontFamily, '"Helvetica Neue", Helvetica, Arial, sans-serif');
  assert.equal(presetsById.holm.typography.noteFontSource, FONT_SOURCE_SYSTEM);
  assert.equal(presetsById.holm.typography.noteFontFamily, 'Georgia, serif');
  assert.equal(presetsById.kolomna.typography.mainFontSource, FONT_SOURCE_PLAIN);
  assert.equal(presetsById.kolomna.typography.noteFontSource, FONT_SOURCE_SYSTEM);
  assert.equal(presetsById.kolomna.typography.noteFontFamily, 'Georgia, serif');
});

test('resolves inherited and var-based Aegea palette values to hex colors', () => {
  const presetsById = Object.fromEntries(themePresets.map((preset) => [preset.id, preset]));

  assert.equal(presetsById.vulcano.palette.tag, presetsById.vulcano.palette.link);
  assert.equal(presetsById.fiesta.palette.engineText, presetsById.fiesta.palette.foreground);
  assert.equal(presetsById.fiesta.palette.inputText, presetsById.fiesta.palette.foreground);
  assert.equal(presetsById.holm.palette.active, presetsById.holm.palette.link);
  assert.equal(presetsById.chancery.palette.foreground, '#111111');
  assert.equal(presetsById.acute.palette.active, '#ff4820');
});

test('resolves Aegea dark palette values for supported presets', () => {
  const presetsById = Object.fromEntries(themePresets.map((preset) => [preset.id, preset]));

  assert.equal(presetsById.acute.darkPalette.background, '#202020');
  assert.equal(presetsById.acute.darkPalette.link, '#0080ff');
  assert.equal(presetsById.fiesta.darkPalette.background, '#26212b');
  assert.equal(presetsById.fiesta.darkPalette.headings, '#ff40b9');
  assert.equal(presetsById.gal.darkPalette.background, '#27292a');
  assert.equal(presetsById.gal.darkPalette.link, '#40a0f4');
});
