import test from 'node:test';
import assert from 'node:assert/strict';
import { themePresets } from './presets.js';
import { initialThemeState } from './model.js';

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

test('plain preset matches the Selecta default theme state', () => {
  const plainPreset = themePresets.find((preset) => preset.id === 'plain');

  assert.deepEqual(plainPreset.palette, initialThemeState.palette);
  assert.deepEqual(plainPreset.typography, initialThemeState.typography);
  assert.deepEqual(plainPreset.layout, initialThemeState.layout);
});

test('official presets keep Selecta typography and layout defaults', () => {
  for (const preset of themePresets) {
    assert.deepEqual(preset.typography, initialThemeState.typography, preset.id);
    assert.deepEqual(preset.layout, initialThemeState.layout, preset.id);
  }
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
