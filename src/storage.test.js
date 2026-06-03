import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { clearSession, loadSession, saveSession, SESSION_STORAGE_KEY } from './storage.js';
import { createEmptyFieldLocks } from './theme/fieldLocks.js';
import { initialThemeState } from './theme/model.js';

const originalLocalStorage = globalThis.localStorage;

function createMemoryStorage() {
  const items = new Map();

  return {
    getItem(key) {
      return items.has(key) ? items.get(key) : null;
    },
    removeItem(key) {
      items.delete(key);
    },
    setItem(key, value) {
      items.set(key, String(value));
    },
  };
}

function setLocalStorage(storage) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
}

afterEach(() => {
  setLocalStorage(originalLocalStorage);
});

test('saves and loads a valid session', () => {
  setLocalStorage(createMemoryStorage());
  const themeState = structuredClone(initialThemeState);
  const fieldLocks = createEmptyFieldLocks();

  themeState.meta.displayName = 'Saved Theme';
  fieldLocks.palette.link = true;
  saveSession({
    themeState,
    fieldLocks,
    uiState: {
      sidebarWidth: 512,
      folderNameEdited: true,
    },
  });

  assert.deepEqual(loadSession(), {
    themeState,
    fieldLocks,
    uiState: {
      sidebarWidth: 512,
      folderNameEdited: true,
    },
  });
});

test('clears a saved session', () => {
  setLocalStorage(createMemoryStorage());
  saveSession({
    themeState: structuredClone(initialThemeState),
    fieldLocks: createEmptyFieldLocks(),
    uiState: {
      sidebarWidth: 416,
      folderNameEdited: false,
    },
  });

  clearSession();

  assert.equal(loadSession(), null);
});

test('returns null for unsupported session version', () => {
  setLocalStorage(createMemoryStorage());
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      version: 999,
      themeState: structuredClone(initialThemeState),
      fieldLocks: createEmptyFieldLocks(),
      uiState: {
        sidebarWidth: 416,
        folderNameEdited: false,
      },
    })
  );

  assert.equal(loadSession(), null);
});

test('returns null for invalid session shape', () => {
  setLocalStorage(createMemoryStorage());
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      themeState: structuredClone(initialThemeState),
      fieldLocks: createEmptyFieldLocks(),
      uiState: {
        sidebarWidth: '416px',
        folderNameEdited: false,
      },
    })
  );

  assert.equal(loadSession(), null);
});

test('returns null for invalid session JSON', () => {
  setLocalStorage(createMemoryStorage());
  localStorage.setItem(SESSION_STORAGE_KEY, '{');

  assert.equal(loadSession(), null);
});

test('ignores unavailable localStorage', () => {
  setLocalStorage({
    getItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
  });

  assert.doesNotThrow(() =>
    saveSession({
      themeState: structuredClone(initialThemeState),
      fieldLocks: createEmptyFieldLocks(),
      uiState: {
        sidebarWidth: 416,
        folderNameEdited: false,
      },
    })
  );
  assert.equal(loadSession(), null);
  assert.doesNotThrow(() => clearSession());
});
