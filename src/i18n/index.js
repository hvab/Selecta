import { createI18n } from 'vue-i18n';
import { en } from './locales/en.js';
import { ru } from './locales/ru.js';

export const DEFAULT_LOCALE = 'en';
export const LOCALE_STORAGE_KEY = 'selecta_locale';
export const supportedLocales = ['en', 'ru'];

const messages = {
  en,
  ru,
};

function isSupportedLocale(locale) {
  return supportedLocales.includes(locale);
}

export function normalizeLocale(locale) {
  if (typeof locale !== 'string') {
    return DEFAULT_LOCALE;
  }

  const normalizedLocale = locale.toLowerCase();

  if (isSupportedLocale(normalizedLocale)) {
    return normalizedLocale;
  }

  return normalizedLocale === 'ru' || normalizedLocale.startsWith('ru-') ? 'ru' : DEFAULT_LOCALE;
}

export function loadStoredLocale() {
  try {
    const storedLocale = globalThis.localStorage?.getItem(LOCALE_STORAGE_KEY);

    return isSupportedLocale(storedLocale) ? storedLocale : null;
  } catch {
    return null;
  }
}

export function saveStoredLocale(locale) {
  try {
    globalThis.localStorage?.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage can be unavailable; language switching should still work in memory.
  }
}

export function getInitialLocale() {
  return loadStoredLocale() ?? normalizeLocale(globalThis.navigator?.language);
}

export function setDocumentLocale(locale) {
  if (globalThis.document?.documentElement) {
    globalThis.document.documentElement.lang = locale;
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
});

setDocumentLocale(i18n.global.locale.value);
