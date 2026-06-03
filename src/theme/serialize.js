import { initialThemeState } from './model.js';

export const THEME_SERIALIZATION_VERSION = 1;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function copyKnownSection(section, referenceSection, sectionName) {
  if (!isPlainObject(section)) {
    throw new Error(`Invalid theme ${sectionName}.`);
  }

  const knownSection = {};

  for (const [key, referenceValue] of Object.entries(referenceSection)) {
    if (typeof section[key] !== typeof referenceValue) {
      throw new Error(`Invalid theme ${sectionName}.${key}.`);
    }

    knownSection[key] = section[key];
  }

  return knownSection;
}

function copyKnownThemeState(themeState) {
  if (!isPlainObject(themeState)) {
    throw new Error('Invalid theme data.');
  }

  return Object.fromEntries(
    Object.entries(initialThemeState).map(([sectionName, referenceSection]) => [
      sectionName,
      copyKnownSection(themeState[sectionName], referenceSection, sectionName),
    ])
  );
}

export function serializeTheme(themeState) {
  return JSON.stringify({
    version: THEME_SERIALIZATION_VERSION,
    ...copyKnownThemeState(themeState),
  });
}

export function deserializeTheme(json) {
  let data;

  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid theme JSON.');
  }

  if (!isPlainObject(data)) {
    throw new Error('Invalid theme data.');
  }

  if (data.version !== THEME_SERIALIZATION_VERSION) {
    throw new Error('Unsupported theme version.');
  }

  return copyKnownThemeState(data);
}
