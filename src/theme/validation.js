export function validateMetadata(meta) {
  const errors = {};

  if (!meta.displayName.trim()) {
    errors.displayName = 'displayNameRequired';
  }

  if (!meta.folderName.trim()) {
    errors.folderName = 'folderNameRequired';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.folderName)) {
    errors.folderName = 'folderNameInvalid';
  }

  return errors;
}
