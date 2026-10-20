import { strFromU8, Unzip, UnzipInflate, unzipSync } from 'fflate';
import { deserializeThemeFolder } from './importFolder.js';

const supportedPaths = new Set(['selecta.json', 'theme-info.php', 'styles/main.css']);
const maxArchiveSize = 32 * 1024 * 1024;
const maxThemeFileSize = 1024 * 1024;
const maxArchiveEntries = 4096;
const zipInputChunkSize = 256;

function getThemePath(name) {
  const parts = name.split('/');

  if (
    name.includes('\\') ||
    /\p{Cc}/u.test(name) ||
    /^[a-z]:/i.test(name) ||
    parts.some((part) => !part || part === '.' || part === '..' || part === '__MACOSX' || part.startsWith('._'))
  ) {
    return null;
  }

  if (supportedPaths.has(name)) {
    return { folder: '', path: name };
  }

  if (supportedPaths.has(parts.slice(1).join('/'))) {
    return { folder: parts[0], path: parts.slice(1).join('/') };
  }

  return null;
}

function findThemeFiles(data) {
  const folders = new Map();
  let entries = 0;

  // The discovery pass reads directory metadata without inflating any file.
  unzipSync(data, {
    filter(entry) {
      if (++entries > maxArchiveEntries) {
        throw new Error('Too many ZIP entries.');
      }

      const themePath = getThemePath(entry.name);

      if (themePath) {
        if (!folders.has(themePath.folder)) {
          folders.set(themePath.folder, new Map());
        }

        const files = folders.get(themePath.folder);

        if (files.has(themePath.path)) {
          throw new Error('Duplicate theme file.');
        }

        files.set(themePath.path, entry);
      }

      return false;
    },
  });

  const themes = [...folders].filter(([, files]) => files.has('theme-info.php') || files.has('styles/main.css'));

  if (themes.length !== 1) {
    throw new Error('Select a ZIP containing one theme.');
  }

  return themes[0];
}

function extractThemeFiles(data, files) {
  const selected = new Map([...files.values()].map((entry) => [entry.name, entry]));
  const started = new Set();
  const extracted = new Map();
  let entries = 0;
  const stream = new Unzip((file) => {
    if (++entries > maxArchiveEntries) {
      throw new Error('Too many ZIP entries.');
    }

    const entry = selected.get(file.name);

    if (!entry) {
      return;
    }

    if (
      started.has(file.name) ||
      file.compression !== entry.compression ||
      (file.size !== undefined && file.size !== entry.size) ||
      (file.originalSize !== undefined && file.originalSize !== entry.originalSize)
    ) {
      throw new Error('Inconsistent theme file headers.');
    }

    started.add(file.name);
    const chunks = [];
    let size = 0;

    file.ondata = (error, chunk, final) => {
      if (error) {
        throw error;
      }

      size += chunk.length;

      if (size > maxThemeFileSize || size > entry.originalSize) {
        file.terminate();
        throw new Error('Theme file exceeds its size limit.');
      }

      chunks.push(chunk);

      if (final) {
        if (size !== entry.originalSize) {
          throw new Error('Invalid theme file data.');
        }

        const content = new Uint8Array(size);
        let offset = 0;

        for (const part of chunks) {
          content.set(part, offset);
          offset += part.length;
        }

        extracted.set(file.name, content);
      }
    };

    file.start();
  });

  stream.register(UnzipInflate);

  // Small compressed chunks bound temporary output before each size check.
  for (let offset = 0; offset < data.length; offset += zipInputChunkSize) {
    stream.push(data.subarray(offset, offset + zipInputChunkSize), offset + zipInputChunkSize >= data.length);
  }

  return extracted;
}

export async function deserializeThemeZip(file) {
  if (file.size > maxArchiveSize) {
    throw new Error('ZIP archive is too large.');
  }

  const data = new Uint8Array(await file.arrayBuffer());

  if (data.length < 22 || data.length > maxArchiveSize) {
    throw new Error('Invalid ZIP archive size.');
  }

  const [folder, files] = findThemeFiles(data);

  for (const entry of files.values()) {
    if (
      !Number.isSafeInteger(entry.originalSize) ||
      entry.originalSize < 0 ||
      entry.originalSize > maxThemeFileSize ||
      !Number.isSafeInteger(entry.size) ||
      entry.size < 0 ||
      entry.size > data.length ||
      (entry.compression !== 0 && entry.compression !== 8)
    ) {
      throw new Error('Unsupported or oversized theme file.');
    }
  }

  const extracted = extractThemeFiles(data, files);
  const folderName = folder || file.name.replace(/\.zip$/i, '') || 'imported-theme';

  return deserializeThemeFolder(
    [...files].map(([path, entry]) => {
      const content = extracted.get(entry.name);

      if (!content || content.length !== entry.originalSize) {
        throw new Error('Invalid theme file data.');
      }

      return {
        webkitRelativePath: `${folderName}/${path}`,
        text: async () => strFromU8(content),
      };
    })
  );
}
