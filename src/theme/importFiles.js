import { deserializeThemeSources } from './importFolder.js';
import { deserializeThemeZip } from './importZip.js';
import { deserializeThemeFile } from './serialize.js';

const sourcePaths = {
  json: 'selecta.json',
  css: 'styles/main.css',
  php: 'theme-info.php',
};

export async function deserializeThemeFiles(files) {
  const formats = new Map();

  for (const file of files) {
    const format = /\.(zip|json|css|php)$/i.exec(file.name)?.[1].toLowerCase();

    if (!format) {
      throw new Error('Unsupported theme file type.');
    }

    if (formats.has(format)) {
      throw new Error('Select one theme file of each type.');
    }

    formats.set(format, file);
  }

  if (!formats.size || (formats.has('zip') && formats.size !== 1)) {
    throw new Error('Select one ZIP or theme source files.');
  }

  if (formats.has('zip')) {
    return deserializeThemeZip(formats.get('zip'));
  }

  if (formats.size === 1 && formats.has('json')) {
    return deserializeThemeFile(formats.get('json'));
  }

  return deserializeThemeSources(new Map([...formats].map(([format, file]) => [sourcePaths[format], file])));
}
