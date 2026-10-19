import { strToU8, zipSync } from 'fflate';
import { generateThemeCss } from './css.js';
import { generateThemeInfo } from './themeInfo.js';
import { isValidThemeState, validateMetadata } from './validation.js';

export function getThemeZipFileName(themeState) {
  return `${themeState.meta.folderName}.zip`;
}

export function getThemeZipEntries(themeState) {
  if (!isValidThemeState(themeState) || Object.keys(validateMetadata(themeState.meta)).length) {
    throw new Error('Invalid theme data for ZIP export.');
  }

  return {
    [`${themeState.meta.folderName}/theme-info.php`]: generateThemeInfo(themeState),
    [`${themeState.meta.folderName}/styles/main.css`]: generateThemeCss(themeState),
  };
}

export function generateThemeZip(themeState) {
  return zipSync(
    Object.fromEntries(
      Object.entries(getThemeZipEntries(themeState)).map(([path, content]) => [path, strToU8(content)])
    )
  );
}
