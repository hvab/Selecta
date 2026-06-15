import test from 'node:test';
import assert from 'node:assert/strict';
import { getContrastRatio, normalizeHexColor } from './color.js';
import { getContrastWarnings, getContrastWarningsByField, isPaletteContrastValid } from './contrast.js';
import { initialThemeState } from './model.js';

test('default palette has no contrast warnings', () => {
  assert.deepEqual(getContrastWarnings(initialThemeState.palette), []);
});

test('warns when text matches background', () => {
  const warnings = getContrastWarnings({
    ...initialThemeState.palette,
    background: '#ffffff',
    foreground: '#ffffff',
  });

  assert.ok(warnings.some((warning) => warning.id === 'textOnBackground'));
  assert.ok(
    getContrastWarningsByField({
      ...initialThemeState.palette,
      background: '#ffffff',
      foreground: '#ffffff',
    }).foreground?.includes('textOnBackground')
  );
});

test('isPaletteContrastValid mirrors warning presence', () => {
  const invalidPalette = {
    ...initialThemeState.palette,
    foreground: '#ffffff',
    background: '#ffffff',
  };

  assert.equal(isPaletteContrastValid(initialThemeState.palette), true);
  assert.equal(isPaletteContrastValid(invalidPalette), false);
});

test('warns when link and visited link use the same color', () => {
  const warnings = getContrastWarnings({
    ...initialThemeState.palette,
    link: '#0066cc',
    linkVisited: '#0066cc',
  });

  assert.ok(warnings.some((warning) => warning.id === 'linkSameAsVisited'));
});

test('normalizes short hex before comparing colors', () => {
  const warnings = getContrastWarnings({
    ...initialThemeState.palette,
    link: '#06c',
    linkVisited: '#0066cc',
  });

  assert.ok(warnings.some((warning) => warning.id === 'linkSameAsVisited'));
  assert.equal(normalizeHexColor('#06c'), '#0066cc');
});

test('getContrastRatio flags colors below 3:1 on white', () => {
  assert.ok(getContrastRatio('#c0c0c0', '#ffffff') < 3);
  assert.ok(getContrastRatio('#767676', '#ffffff') >= 3);
});

test('does not warn when link and hover differ strongly in hue', () => {
  const warnings = getContrastWarnings({
    ...initialThemeState.palette,
    link: '#0066cc',
    hover: '#cc3300',
  });

  assert.equal(
    warnings.find((warning) => warning.id === 'hoverVsLink'),
    undefined
  );
});

test('warns when link and hover are similar hues with low contrast', () => {
  const warnings = getContrastWarnings({
    ...initialThemeState.palette,
    link: '#0066cc',
    hover: '#0055bb',
  });

  assert.ok(warnings.some((warning) => warning.id === 'hoverVsLink'));
});

test('does not duplicate warnings when hover equals link', () => {
  const warnings = getContrastWarnings({
    ...initialThemeState.palette,
    link: '#0066cc',
    hover: '#0066cc',
  });

  assert.ok(warnings.some((warning) => warning.id === 'linkSameAsHover'));
  assert.equal(
    warnings.find((warning) => warning.id === 'hoverVsLink'),
    undefined
  );
});
