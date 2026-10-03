import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compileScript, parse } from '@vue/compiler-sfc';
import { createRenderer, nextTick } from 'vue';
import { i18n } from './i18n/index.js';
import { loadSession } from './storage.js';
import { initialThemeState } from './theme/model.js';
import { createEmptyFieldLocks } from './theme/fieldLocks.js';

// Mount the real App script with a null render: these regressions concern state and lifecycle, not child UI.
const { descriptor } = parse(readFileSync(new URL('./App.vue', import.meta.url), 'utf8'));
const { content } = compileScript(descriptor, { id: 'session-persistence-test' });
const script = content
  .replace(/import (\w+) from (['"])([^'"]+\.vue)\2;?/g, 'const $1 = {};')
  .replace(/from (['"])([^'"]+)\1/g, (_, quote, specifier) => {
    const url = specifier.startsWith('.') ? new URL(specifier, import.meta.url).href : import.meta.resolve(specifier);

    return `from ${JSON.stringify(url)}`;
  });
const { default: App } = await import(`data:text/javascript,${encodeURIComponent(script)}`);
const renderer = createRenderer({
  createComment: () => ({}),
  insert() {},
  remove() {},
  parentNode: () => null,
  nextSibling: () => null,
});
const originalGlobals = Object.fromEntries(
  ['window', 'document', 'localStorage'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
);
let mountedApps = [];

beforeEach(() => {
  const items = new Map();
  const window = Object.assign(new EventTarget(), {
    innerWidth: 1280,
    location: new URL('https://selecta.test/Selecta/'),
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
  });
  const document = Object.assign(new EventTarget(), {
    visibilityState: 'visible',
    documentElement: {},
    querySelector: () => null,
  });
  const localStorage = {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };

  for (const [key, value] of Object.entries({ window, document, localStorage })) {
    Object.defineProperty(globalThis, key, { configurable: true, value });
  }
});

afterEach(() => {
  for (const app of mountedApps) {
    app.unmount();
  }

  mountedApps = [];

  for (const [key, descriptor] of Object.entries(originalGlobals)) {
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete globalThis[key];
    }
  }
});

function mountApp() {
  const app = renderer.createApp({ ...App, render: () => null });
  app.use(i18n);
  const instance = app.mount({});
  let mounted = true;
  const result = {
    state: instance.$.setupState,
    unmount() {
      if (mounted) {
        mounted = false;
        app.unmount();
      }
    },
  };

  mountedApps.push(result);

  return result;
}

test('the first edit after Reset at defaults survives reload', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const app = mountApp();
  app.state.resetToDefaults();
  await nextTick();
  app.state.updateMetaField('displayName', 'After Reset');
  await nextTick();
  t.mock.timers.tick(500);

  assert.equal(loadSession().themeState.meta.displayName, 'After Reset');
  app.unmount();
  const restored = mountApp();
  assert.equal(restored.state.themeState.meta.displayName, 'After Reset');
});

test('pagehide saves the last edit before the debounce expires', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const app = mountApp();
  app.state.updatePaletteField('link', '#123456');
  await nextTick();
  t.mock.timers.tick(88);
  window.dispatchEvent(new Event('pagehide'));

  assert.equal(loadSession()?.themeState.palette.link, '#123456');
  app.unmount();
  const restored = mountApp();
  assert.equal(restored.state.themeState.palette.link, '#123456');
});

test('Reset cancels a pending edit and saves defaults before accepting the next edit', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const app = mountApp();
  app.state.updateMetaField('displayName', 'Before Reset');
  app.state.fieldLocks.palette.link = true;
  app.state.updateThemeMode({ target: { value: 'dark' } });
  app.state.updateShellAppearance({ target: { value: 'dark' } });
  await nextTick();
  t.mock.timers.tick(100);
  app.state.resetToDefaults();

  assert.deepEqual(loadSession().themeState, initialThemeState);
  assert.deepEqual(loadSession().fieldLocks, createEmptyFieldLocks());
  assert.equal(loadSession().uiState.themeMode, 'light');
  assert.equal(loadSession().uiState.shellAppearance, 'system');
  await nextTick();
  t.mock.timers.tick(500);
  assert.deepEqual(loadSession().themeState, initialThemeState);
  app.state.updateMetaField('displayName', 'After Changed Reset');
  await nextTick();
  t.mock.timers.tick(500);
  assert.equal(loadSession().themeState.meta.displayName, 'After Changed Reset');
});

test('pagehide saves current state even before the watcher has run', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const app = mountApp();
  app.state.updateMetaField('displayName', 'Immediate Leave');
  window.dispatchEvent(new Event('pagehide'));

  assert.equal(loadSession().themeState.meta.displayName, 'Immediate Leave');
});

test('hiding the page flushes pending edits and a visible page keeps the debounce', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const app = mountApp();
  app.state.updateMetaField('displayName', 'Hidden Page');
  await nextTick();
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(loadSession(), null);
  document.visibilityState = 'hidden';
  document.dispatchEvent(new Event('visibilitychange'));

  assert.equal(loadSession().themeState.meta.displayName, 'Hidden Page');
});

test('unmount flushes current state and removes timers and page listeners', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let writes = 0;
  const setItem = localStorage.setItem;
  localStorage.setItem = (key, value) => {
    writes += 1;
    setItem(key, value);
  };
  const app = mountApp();
  app.state.updateMetaField('displayName', 'Unmounted');
  await nextTick();
  app.unmount();
  assert.equal(loadSession().themeState.meta.displayName, 'Unmounted');
  assert.equal(writes, 1);
  window.dispatchEvent(new Event('pagehide'));
  document.visibilityState = 'hidden';
  document.dispatchEvent(new Event('visibilitychange'));
  t.mock.timers.tick(1000);

  assert.equal(writes, 1);
});

test('ordinary editing still debounces and saves theme, locks and UI together', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const app = mountApp();
  app.state.updateMetaField('displayName', 'Debounced');
  app.state.fieldLocks.palette.link = true;
  app.state.controlsPaneWidth = 480;
  app.state.updateThemeMode({ target: { value: 'dark' } });
  app.state.updateShellAppearance({ target: { value: 'dark' } });
  await nextTick();
  t.mock.timers.tick(499);
  assert.equal(loadSession(), null);
  app.state.updatePaletteField('link', '#123456');
  await nextTick();
  t.mock.timers.tick(499);
  assert.equal(loadSession(), null);
  t.mock.timers.tick(1);

  const session = loadSession();
  assert.equal(session.themeState.meta.displayName, 'Debounced');
  assert.equal(session.themeState.darkPalette.link, '#123456');
  assert.equal(session.fieldLocks.palette.link, true);
  assert.equal(session.uiState.sidebarWidth, 480);
  assert.equal(session.uiState.themeMode, 'dark');
  assert.equal(session.uiState.shellAppearance, 'dark');
});

test('Reset and leave lifecycle keep working when storage is unavailable', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage unavailable');
    },
  });
  const app = mountApp();
  app.state.resetToDefaults();
  app.state.updateMetaField('displayName', 'Without Storage');
  await nextTick();
  t.mock.timers.tick(500);
  window.dispatchEvent(new Event('pagehide'));
  document.visibilityState = 'hidden';
  document.dispatchEvent(new Event('visibilitychange'));
  app.unmount();

  assert.equal(app.state.themeState.meta.displayName, 'Without Storage');
});
