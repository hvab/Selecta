import { META_LOCK_KEYS, PALETTE_LOCK_KEYS, TYPOGRAPHY_LOCK_KEYS, LAYOUT_LOCK_KEYS } from './theme/fieldLocks.js';
import { normalizeTypographyFontSources } from './theme/fonts.js';
import { initialThemeState } from './theme/model.js';

export const SESSION_STORAGE_KEY = 'selecta_session';
export const SESSION_STORAGE_VERSION = 1;

const FIELD_LOCK_KEYS_BY_SECTION = {
  meta: META_LOCK_KEYS,
  palette: PALETTE_LOCK_KEYS,
  typography: TYPOGRAPHY_LOCK_KEYS,
  layout: LAYOUT_LOCK_KEYS,
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getCompatibleSection(value, reference, sectionName) {
  if (!isPlainObject(value)) {
    return null;
  }

  const section = sectionName === 'typography' ? normalizeTypographyFontSources(value) : value;

  return Object.entries(reference).every(([key, referenceValue]) => typeof section[key] === typeof referenceValue)
    ? Object.fromEntries(Object.keys(reference).map((key) => [key, section[key]]))
    : null;
}

function getCompatibleThemeState(themeState) {
  if (!isPlainObject(themeState)) {
    return null;
  }

  const compatibleThemeState = {};

  for (const [section, reference] of Object.entries(initialThemeState)) {
    const compatibleSection = getCompatibleSection(themeState[section], reference, section);

    if (!compatibleSection) {
      return null;
    }

    compatibleThemeState[section] = compatibleSection;
  }

  return compatibleThemeState;
}

function isValidFieldLocks(fieldLocks) {
  if (!isPlainObject(fieldLocks)) {
    return false;
  }

  return Object.entries(FIELD_LOCK_KEYS_BY_SECTION).every(([section, keys]) => {
    if (!isPlainObject(fieldLocks[section])) {
      return false;
    }

    return keys.every((key) => typeof fieldLocks[section][key] === 'boolean');
  });
}

function isValidUiState(uiState) {
  return (
    isPlainObject(uiState) && Number.isFinite(uiState.sidebarWidth) && typeof uiState.folderNameEdited === 'boolean'
  );
}

function getCompatibleSession(session) {
  if (
    !isPlainObject(session) ||
    session.version !== SESSION_STORAGE_VERSION ||
    !isValidFieldLocks(session.fieldLocks) ||
    !isValidUiState(session.uiState)
  ) {
    return null;
  }

  const themeState = getCompatibleThemeState(session.themeState);

  return themeState
    ? {
        themeState,
        fieldLocks: session.fieldLocks,
        uiState: session.uiState,
      }
    : null;
}

export function saveSession({ themeState, fieldLocks, uiState }) {
  try {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        version: SESSION_STORAGE_VERSION,
        themeState,
        fieldLocks,
        uiState,
      })
    );
  } catch {
    // localStorage can be unavailable or full; the app should keep working without persistence.
  }
}

export function loadSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession);

    return getCompatibleSession(session);
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // localStorage can be unavailable; reset should still update in-memory state later.
  }
}
