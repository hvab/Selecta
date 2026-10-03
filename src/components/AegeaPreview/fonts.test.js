import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { strFromU8, unzipSync } from 'fflate';
import { generateThemeCss, getThemeCssVariables } from '../../theme/css.js';
import { SERIF_FONT_STACK, UI_FONT_STACK } from '../../theme/fonts.js';
import { initialThemeState } from '../../theme/model.js';
import { generateThemeZip } from '../../theme/zip.js';

// Aegea 11.5/v4199, e1d058356e5426bb1878785c6f4ab4e68b6c4995, plain variables.scss
const plainMainFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "SF UI Text", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif';

const previewCss = readFileSync(new URL('./AegeaPreview.css', import.meta.url), 'utf8');
const previewDefaults = previewCss.match(/\.aegea-preview\s*\{([^}]+)\}/)[1];

function getPreviewDefault(property) {
  return previewDefaults
    .match(new RegExp(`${property}:\\s*([^;]+);`))[1]
    .replace(/\s+/g, ' ')
    .trim();
}

test('preview plain defaults match the Aegea 11.5 font contract', () => {
  assert.equal(getPreviewDefault('--mainFontFamily').replace(/["']/g, ''), plainMainFontFamily.replace(/["']/g, ''));
  assert.equal(getPreviewDefault('--noteMainFontFamily'), 'inherit');
  assert.equal(getPreviewDefault('--smallFontFamily'), 'inherit');
});

test('plain light and dark ZIPs inherit fonts without overrides or external imports', () => {
  for (const supportsDarkMode of [false, true]) {
    const themeState = structuredClone(initialThemeState);
    themeState.meta.supportsDarkMode = supportsDarkMode;
    const archive = unzipSync(generateThemeZip(themeState));
    const css = strFromU8(archive[`${themeState.meta.folderName}/styles/main.css`]);

    assert.doesNotMatch(css, /--(?:main|noteMain|small)FontFamily|@import/);
    for (const palette of [themeState.palette, themeState.darkPalette]) {
      const variables = getThemeCssVariables(themeState, palette);
      assert.equal(variables['--mainFontFamily'], undefined);
      assert.equal(variables['--noteMainFontFamily'], undefined);
    }
  }
});

test('explicit system and Google fonts override plain defaults independently of palette', () => {
  const themeState = structuredClone(initialThemeState);
  themeState.meta.supportsDarkMode = true;
  themeState.typography.mainFontSource = 'system';
  themeState.typography.mainFontFamily = 'Aptos';
  themeState.typography.noteFontSource = 'system';
  themeState.typography.noteFontFamily = 'Georgia';

  for (const palette of [themeState.palette, themeState.darkPalette]) {
    const variables = getThemeCssVariables(themeState, palette);
    assert.equal(variables['--mainFontFamily'], `Aptos, ${UI_FONT_STACK}`);
    assert.equal(variables['--noteMainFontFamily'], `Georgia, ${SERIF_FONT_STACK}`);
  }
  assert.doesNotMatch(generateThemeCss(themeState), /@import/);

  themeState.typography.mainFontSource = 'google';
  themeState.typography.mainFontFamily = 'PT Sans';
  themeState.typography.noteFontSource = 'google';
  themeState.typography.noteFontFamily = 'PT Sans';

  for (const palette of [themeState.palette, themeState.darkPalette]) {
    const variables = getThemeCssVariables(themeState, palette);
    assert.equal(variables['--mainFontFamily'], '"PT Sans", system-ui, sans-serif');
    assert.equal(variables['--noteMainFontFamily'], '"PT Sans", system-ui, sans-serif');
  }
  assert.equal(generateThemeCss(themeState).match(/family=PT\+Sans/g).length, 1);
});
