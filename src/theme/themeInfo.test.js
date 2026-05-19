import test from 'node:test';
import assert from 'node:assert/strict';
import { initialThemeState } from './model.js';
import { generateThemeInfo } from './themeInfo.js';

test('generates theme info from theme state', () => {
  const themeInfo = generateThemeInfo(initialThemeState);

  assert.match(themeInfo, /'display_name' => 'My Theme'/);
  assert.match(themeInfo, /'based_on' => 'plain'/);
  assert.match(themeInfo, /'supports_dark_mode' => false/);
  assert.match(themeInfo, /'background' => '#ffffff'/);
  assert.match(themeInfo, /'headings' => '#111111'/);
  assert.match(themeInfo, /'text' => '#111111'/);
  assert.match(themeInfo, /'link' => '#0066cc'/);
});

test('escapes PHP single quoted strings in theme info', () => {
  const themeInfo = generateThemeInfo({
    ...initialThemeState,
    meta: {
      ...initialThemeState.meta,
      displayName: "O'Neil's \\ Theme",
      basedOn: "plain'child",
    },
  });

  assert.match(themeInfo, /'display_name' => 'O\\'Neil\\'s \\\\ Theme'/);
  assert.match(themeInfo, /'based_on' => 'plain\\'child'/);
});
