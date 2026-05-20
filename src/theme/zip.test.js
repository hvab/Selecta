import test from 'node:test';
import assert from 'node:assert/strict';
import { strFromU8, unzipSync } from 'fflate';
import { generateThemeCss } from './css.js';
import { initialThemeState } from './model.js';
import { generateThemeInfo } from './themeInfo.js';
import { generateThemeZip, getThemeZipEntries, getThemeZipFileName } from './zip.js';

test('builds theme ZIP file name from folder name', () => {
  assert.equal(getThemeZipFileName(initialThemeState), 'my-theme.zip');
});

test('builds archive entries inside the theme folder', () => {
  assert.deepEqual(getThemeZipEntries(initialThemeState), {
    'my-theme/theme-info.php': generateThemeInfo(initialThemeState),
    'my-theme/styles/main.css': generateThemeCss(initialThemeState),
  });
});

test('generates a ZIP archive with theme-info.php and styles/main.css', () => {
  const archive = unzipSync(generateThemeZip(initialThemeState));
  const entries = getThemeZipEntries(initialThemeState);
  const themeInfoPath = `${initialThemeState.meta.folderName}/theme-info.php`;
  const themeCssPath = `${initialThemeState.meta.folderName}/styles/main.css`;

  assert.deepEqual(Object.keys(archive).sort(), Object.keys(entries).sort());
  assert.equal(strFromU8(archive[themeInfoPath]), entries[themeInfoPath]);
  assert.equal(strFromU8(archive[themeCssPath]), entries[themeCssPath]);
});
