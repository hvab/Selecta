import { THEME_VALUE_CONSTRAINTS } from './constraints.js';
import { normalizeFontFamily } from './fonts.js';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import { initialThemeState } from './model.js';

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

  if (sectionName === 'palette' || sectionName === 'darkPalette') {
    return value.length === 7 && /^#[\da-f]{6}$/i.test(value);
  }

  if (sectionName === 'typography' && (key === 'mainFontFamily' || key === 'noteFontFamily')) {
    return (
      value === '' || googleFontsCatalog.some((font) => font.family === value) || normalizeFontFamily(value, '') !== ''
    );
  }

  const constraint = THEME_VALUE_CONSTRAINTS[sectionName]?.[key];

  if (constraint) {
    if (constraint.unit) {
      const length = /^(0|[1-9]\d*)(\.\d+)?(px|rem)$/.exec(value);

      return (
        length !== null &&
        length[0] === value &&
        length[3] === constraint.unit &&
        Number.parseFloat(value) >= constraint.min &&
        Number.parseFloat(value) <= constraint.max
      );
    }

    return value >= constraint.min && value <= constraint.max;
  }

  return sectionName !== 'meta' || key !== 'basedOn' || value === 'plain';
}

export function isValidThemeState(themeState) {
  return (
    themeState !== null &&
    typeof themeState === 'object' &&
    !Array.isArray(themeState) &&
    Object.entries(initialThemeState).every(([sectionName, referenceSection]) => {
      const section = themeState[sectionName];

      return (
        section !== null &&
        typeof section === 'object' &&
        !Array.isArray(section) &&
        Object.entries(referenceSection).every(([key, referenceValue]) =>
          isValidThemeField(sectionName, key, section[key], referenceValue)
        )
      );
    })
  );
}
