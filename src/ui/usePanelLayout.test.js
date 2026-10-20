import assert from 'node:assert/strict';
import test from 'node:test';
import { createRenderer, h, nextTick, ref } from 'vue';
import { usePanelLayout } from './usePanelLayout.js';

const renderer = createRenderer({
  createElement: () => ({}),
  insert() {},
  remove() {},
  patchProp() {},
});

function setGlobal(t, key, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);

  Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  t.after(() => {
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete globalThis[key];
    }
  });
}

function mountPanelLayout(width = 1280, divider = 8) {
  const geometry = { width, divider };
  const workspaceElement = ref({ getBoundingClientRect: () => ({ width: geometry.width }) });
  const dividerElement = { getBoundingClientRect: () => ({ width: geometry.divider }) };
  let layout;
  const app = renderer.createApp({
    setup() {
      layout = usePanelLayout(workspaceElement);
      layout.paneResizerElement.value = dividerElement;
      return () => h('main');
    },
  });

  app.mount({});
  return { app, layout, geometry, workspaceElement, dividerElement };
}

test('reacts to container/divider resize and preserves the saved preference', async (t) => {
  let observer;
  setGlobal(
    t,
    'ResizeObserver',
    class {
      constructor(callback) {
        this.callback = callback;
        this.observed = [];
        this.disconnected = false;
        observer = this;
      }
      observe(element, options) {
        this.observed.push({ element, options });
      }
      disconnect() {
        this.disconnected = true;
      }
    }
  );
  setGlobal(t, 'window', { removeEventListener() {} });
  const { app, layout, geometry, workspaceElement, dividerElement } = mountPanelLayout();

  assert.equal(layout.effectiveControlsPaneMaxWidth.value, 672);
  assert.deepEqual(observer.observed, [
    { element: workspaceElement.value, options: { box: 'border-box' } },
    { element: dividerElement, options: { box: 'border-box' } },
  ]);
  layout.controlsPaneWidth.value = 672;
  geometry.width = 768;
  observer.callback();
  await nextTick();
  assert.equal(layout.effectiveControlsPaneMaxWidth.value, 400);
  assert.equal(layout.effectiveControlsPaneWidth.value, 400);
  assert.equal(layout.controlsPaneWidth.value, 672);

  geometry.divider = 16;
  observer.callback();
  assert.equal(layout.effectiveControlsPaneWidth.value, 392);
  assert.equal(layout.getConstrainedControlsPaneWidth(1000), 392);

  geometry.width = 1280;
  geometry.divider = 8;
  observer.callback();
  assert.equal(layout.effectiveControlsPaneWidth.value, 672);

  geometry.width = 375;
  geometry.divider = 0;
  observer.callback();
  assert.equal(layout.effectiveControlsPaneWidth.value, 320);
  geometry.width = 768;
  geometry.divider = 8;
  observer.callback();
  assert.equal(layout.effectiveControlsPaneWidth.value, 400);

  // Keyboard stepping starts at the rendered width, even with a larger preference.
  layout.controlsPaneWidth.value = layout.getConstrainedControlsPaneWidth(layout.effectiveControlsPaneWidth.value - 16);
  assert.equal(layout.effectiveControlsPaneWidth.value, 384);
  geometry.width = 1280;
  observer.callback();
  assert.equal(layout.effectiveControlsPaneWidth.value, 384);
  app.unmount();
  assert.equal(observer.disconnected, true);
});

test('measures before session restore and clamps default and restored widths', (t) => {
  setGlobal(
    t,
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
  setGlobal(t, 'window', { removeEventListener() {} });
  const { app, layout } = mountPanelLayout(768);

  assert.equal(layout.effectiveControlsPaneMaxWidth.value, 400);
  assert.equal(layout.effectiveControlsPaneWidth.value, 400);
  layout.controlsPaneWidth.value = 672;
  assert.equal(layout.effectiveControlsPaneWidth.value, 400);
  assert.equal(layout.controlsPaneWidth.value, 672);
  app.unmount();
});

test('uses and removes the window resize fallback without ResizeObserver', (t) => {
  let listener;
  let removed;
  setGlobal(t, 'ResizeObserver', undefined);
  setGlobal(t, 'window', {
    addEventListener(event, callback) {
      assert.equal(event, 'resize');
      listener = callback;
    },
    removeEventListener(event, callback) {
      assert.equal(event, 'resize');
      removed = callback;
    },
  });
  const { app, layout, geometry } = mountPanelLayout();

  layout.controlsPaneWidth.value = 672;
  geometry.width = 768;
  listener();
  assert.equal(layout.effectiveControlsPaneWidth.value, 400);
  app.unmount();
  assert.equal(removed, listener);
});
