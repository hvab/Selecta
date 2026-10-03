import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { clearSession, loadSession, saveSession, SESSION_STORAGE_KEY, SESSION_STORAGE_VERSION } from './storage.js';
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

for (const shellAppearance of ['light', 'dark']) {
  test(`saves and loads a valid ${shellAppearance} session`, () => {
    setLocalStorage(createMemoryStorage());
    const themeState = structuredClone(initialThemeState);
    const fieldLocks = createEmptyFieldLocks();

    themeState.meta.displayName = 'Saved Theme';
    fieldLocks.palette.link = true;
    const session = {
      themeState,
      fieldLocks,
      uiState: {
        sidebarWidth: 512,
        folderNameEdited: true,
        themeMode: 'dark',
        shellAppearance,
      },
    };
    saveSession(session);

    assert.deepEqual(loadSession(), session);
  });
}

for (const shellAppearance of ['system', undefined]) {
  test(`ignores a legacy session with ${shellAppearance ?? 'missing'} shell appearance`, () => {
    setLocalStorage(createMemoryStorage());
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        version: SESSION_STORAGE_VERSION,
        themeState: structuredClone(initialThemeState),
        fieldLocks: createEmptyFieldLocks(),
        uiState: {
          sidebarWidth: 416,
          folderNameEdited: false,
          shellAppearance,
        },
      })
    );

    assert.equal(loadSession(), null);
  });
}

test('clears a saved session', () => {
  setLocalStorage(createMemoryStorage());
  saveSession({
    themeState: structuredClone(initialThemeState),
    fieldLocks: createEmptyFieldLocks(),
    uiState: {
      sidebarWidth: 416,
      folderNameEdited: false,
      shellAppearance: 'light',
    },
  });

  assert.notEqual(loadSession(), null);
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
        shellAppearance: 'light',
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
      version: SESSION_STORAGE_VERSION,
      themeState: structuredClone(initialThemeState),
      fieldLocks: createEmptyFieldLocks(),
      uiState: {
        sidebarWidth: '416px',
        folderNameEdited: false,
        shellAppearance: 'light',
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
