import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getInitialLocale, loadStoredLocale, LOCALE_STORAGE_KEY, normalizeLocale, saveStoredLocale } from './index.js';
import { en } from './locales/en.js';
import { ru } from './locales/ru.js';

const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

function createMemoryStorage() {
  const items = new Map();

  return {
    getItem(key) {
      return items.has(key) ? items.get(key) : null;
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

function restoreLocalStorage() {
  if (originalLocalStorageDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalLocalStorageDescriptor);
  } else {
    delete globalThis.localStorage;
  }
}

function getMessageKeys(messages, prefix = '') {
  return Object.entries(messages).flatMap(([key, value]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;

    return value && typeof value === 'object' && !Array.isArray(value) ? getMessageKeys(value, nextPrefix) : nextPrefix;
  });
}

afterEach(() => {
  restoreLocalStorage();
});

test('normalizes supported and browser locales', () => {
  assert.equal(normalizeLocale('en'), 'en');
  assert.equal(normalizeLocale('ru'), 'ru');
  assert.equal(normalizeLocale('ru-RU'), 'ru');
  assert.equal(normalizeLocale('en-US'), 'en');
  assert.equal(normalizeLocale('rue'), 'en');
  assert.equal(normalizeLocale(null), 'en');
});

test('loads and saves only supported stored locales', () => {
  setLocalStorage(createMemoryStorage());

  assert.equal(loadStoredLocale(), null);

  saveStoredLocale('ru');
  assert.equal(loadStoredLocale(), 'ru');

  localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');
  assert.equal(loadStoredLocale(), null);
});

test('initial locale prefers stored locale over navigator fallback', () => {
  setLocalStorage(createMemoryStorage());
  localStorage.setItem(LOCALE_STORAGE_KEY, 'ru');

  assert.equal(getInitialLocale(), 'ru');
});

test('english and russian messages have matching keys', () => {
  assert.deepEqual(getMessageKeys(ru).sort(), getMessageKeys(en).sort());
});
