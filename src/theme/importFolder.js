import { applyThemeCss, parseThemeColor } from './importCss.js';
import { parseThemeInfo } from './importPhp.js';
import { suggestFolderName } from './metadata.js';
import { initialThemeState } from './model.js';
import { deserializeTheme } from './serialize.js';
import { isValidThemeState, validateMetadata } from './validation.js';

function getFolderFiles(files) {
  const selectedFiles = new Map();
  let folderName;

  for (const file of files) {
    const [root, ...parts] = file.webkitRelativePath.split('/');

    if (!root || !parts.length || (folderName && root !== folderName)) {
      throw new Error('Select one theme folder.');
    }

    folderName = root;
    const relativePath = parts.join('/');

    if (['selecta.json', 'theme-info.php', 'styles/main.css'].includes(relativePath)) {
      if (selectedFiles.has(relativePath)) {
        throw new Error('Duplicate theme file.');
      }

      selectedFiles.set(relativePath, file);
    }
  }

  return { folderName, selectedFiles };
}

async function readOptionalJson(file) {
  if (file) {
    try {
      return deserializeTheme(await file.text());
    } catch {
      // The editable theme files remain usable when the optional snapshot is invalid.
    }
  }

  return structuredClone(initialThemeState);
}

function applyThemeInfo(themeState, source) {
  const info = parseThemeInfo(source);

  if (!info) {
    return false;
  }

  let applied = false;
  const displayName =
    typeof info.display_name === 'string'
      ? info.display_name
      : info.display_name &&
        (info.display_name.en ??
          info.display_name.ru ??
          Object.values(info.display_name).find((value) => typeof value === 'string'));

  if (typeof displayName === 'string' && displayName.trim()) {
    themeState.meta.displayName = displayName;
    applied = true;
  }

  for (const [key, field] of [
    ['supports_dark_mode', 'supportsDarkMode'],
    ['use_likely_light', 'useLikelyLight'],
  ]) {
    if (typeof info[key] === 'boolean') {
      themeState.meta[field] = info[key];
      applied = true;
    }
  }

  // A plain child without this flag inherits false, including our own false export.
  if (!Object.hasOwn(info, 'use_likely_light')) {
    themeState.meta.useLikelyLight = false;
  }

  for (const [key, field] of [
    ['background', 'background'],
    ['headings', 'headings'],
    ['text', 'foreground'],
    ['link', 'link'],
  ]) {
    const color = parseThemeColor(info.colors?.[key]);

    if (color) {
      themeState.palette[field] = color;
      applied = true;
    }
  }

  return applied;
}

export async function deserializeThemeSources(selectedFiles, folderName) {
  const [themeState, php, css] = await Promise.all([
    readOptionalJson(selectedFiles.get('selecta.json')),
    selectedFiles.get('theme-info.php')?.text(),
    selectedFiles.get('styles/main.css')?.text(),
  ]);
  const phpApplied = typeof php === 'string' && applyThemeInfo(themeState, php);
  const cssApplied = typeof css === 'string' && applyThemeCss(themeState, css);

  if (!phpApplied && !cssApplied) {
    throw new Error('No supported theme settings found.');
  }

  if (folderName !== undefined) {
    themeState.meta.folderName = suggestFolderName(folderName) || initialThemeState.meta.folderName;
  }

  themeState.meta.basedOn = 'plain';

  if (!themeState.meta.displayName.trim() && folderName !== undefined) {
    themeState.meta.displayName = folderName;
  }

  if (!isValidThemeState(themeState) || Object.keys(validateMetadata(themeState.meta)).length) {
    throw new Error('Unsupported theme settings.');
  }

  return themeState;
}

export async function deserializeThemeFolder(files) {
  const { folderName, selectedFiles } = getFolderFiles(files);

  return deserializeThemeSources(selectedFiles, folderName);
}
