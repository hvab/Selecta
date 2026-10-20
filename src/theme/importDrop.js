import { deserializeThemeFiles } from './importFiles.js';
import { deserializeThemeFolder } from './importFolder.js';

function getEntryFile(entry) {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}

async function getFolderFile(directory, path) {
  try {
    const entry = await new Promise((resolve, reject) => directory.getFile(path, { create: false }, resolve, reject));
    const file = await getEntryFile(entry);

    return {
      webkitRelativePath: `${directory.name}/${path}`,
      text: () => file.text(),
    };
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return null;
    }

    throw error;
  }
}

export async function deserializeThemeDrop(dataTransfer) {
  const captured = Array.from(dataTransfer.items ?? [])
    .filter((item) => item.kind === 'file')
    .map((item) => ({ entry: item.webkitGetAsEntry?.(), file: item.getAsFile?.() }));
  const fallbackFiles = Array.from(dataTransfer.files ?? []);
  const directories = captured.filter(({ entry }) => entry?.isDirectory);

  if (directories.length) {
    if (directories.length !== 1 || captured.length !== 1 || fallbackFiles.length > 1) {
      throw new Error('Drop one theme folder or theme files.');
    }

    const files = await Promise.all(
      ['selecta.json', 'theme-info.php', 'styles/main.css'].map((path) => getFolderFile(directories[0].entry, path))
    );

    return deserializeThemeFolder(files.filter(Boolean));
  }

  if (!captured.length) {
    return deserializeThemeFiles(fallbackFiles);
  }

  if (fallbackFiles.length && fallbackFiles.length !== captured.length) {
    throw new Error('Unable to capture all dropped files.');
  }

  const files = await Promise.all(
    captured.map(({ entry, file }, index) => {
      if (file) {
        return file;
      }

      if (entry?.isFile) {
        return getEntryFile(entry);
      }

      if (fallbackFiles[index]) {
        return fallbackFiles[index];
      }

      throw new Error('Unable to read dropped theme file.');
    })
  );

  return deserializeThemeFiles(files);
}
