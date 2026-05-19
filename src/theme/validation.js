export function validateMetadata(meta) {
  const errors = {};

  if (!meta.displayName.trim()) {
    errors.displayName = 'Display name is required.';
  }

  if (!meta.folderName.trim()) {
    errors.folderName = 'Folder name is required.';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.folderName)) {
    errors.folderName = 'Use lowercase letters, numbers, and hyphens only.';
  }

  return errors;
}
