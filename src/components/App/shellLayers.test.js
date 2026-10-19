import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compileStyle } from 'vue/compiler-sfc';

const layerCss = readFileSync(new URL('./AppLayers.css', import.meta.url), 'utf8');
const mainJs = readFileSync(new URL('../../main.js', import.meta.url), 'utf8');
const formerScopedLayers = `
:global(:root) {
  --app-layer-floating: 10;
  --app-layer-modal: 20;
}
:global([data-reka-popper-content-wrapper]) {
  z-index: var(--app-layer-floating) !important;
}
`;

function compiledCss(source, scoped) {
  const result = compileStyle({ source, filename: 'layers.css', id: 'data-v-shell', scoped });
  assert.deepEqual(result.errors, []);
  return result.code.replace(/\s+/g, ' ').trim();
}

test('unscoped shell layers preserve the compiled Vue global selectors and priorities', () => {
  assert.equal(compiledCss(layerCss, false), compiledCss(formerScopedLayers, true));
  assert.doesNotMatch(compiledCss(layerCss, false), /data-v-shell|:global/);
});

test('global shell layers load after library styles and before the app', () => {
  const libraryImport = mainJs.indexOf("import './ui/hvab.css';");
  const layerImport = mainJs.indexOf("import './components/App/AppLayers.css';");
  const appImport = mainJs.indexOf("import App from './components/App/App.vue';");
  assert.ok(libraryImport >= 0 && layerImport > libraryImport && appImport > layerImport);
});
