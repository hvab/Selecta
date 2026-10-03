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

export function isValidThemeField(sectionName, key, value, referenceValue) {
  if (typeof value !== typeof referenceValue) {
    return false;
  }

  if (typeof value === 'number' && !Number.isFinite(value)) {
    return false;
  }

  return sectionName !== 'meta' || key !== 'basedOn' || value === 'plain';
}
