<script setup>
import { computed, reactive } from 'vue';
import ThemeControls from './components/ThemeControls.vue';
import AegeaPreview from './preview/AegeaPreview.vue';
import { generateThemeCss } from './theme/css.js';
import { initialThemeState } from './theme/model.js';
import { generateThemeInfo } from './theme/themeInfo.js';

const themeState = reactive(structuredClone(initialThemeState));
const themeStateJson = computed(() => JSON.stringify(themeState, null, 2));
const themeCss = computed(() => generateThemeCss(themeState));
const themeInfo = computed(() => generateThemeInfo(themeState));

function updatePaletteField(key, value) {
  themeState.palette[key] = value;
}

function updateTypographyField(key, value) {
  themeState.typography[key] = value;
}
</script>

<template>
  <main class="app">
    <h1>Selecta</h1>
    <p>Theme generator for Aegea.</p>

    <section>
      <h2>Preview</h2>
      <AegeaPreview :theme-state="themeState" />
    </section>

    <section>
      <h2>Controls</h2>
      <ThemeControls
        :palette="themeState.palette"
        :typography="themeState.typography"
        @update:palette-field="updatePaletteField"
        @update:typography-field="updateTypographyField"
      />
    </section>

    <section>
      <h2>Theme state</h2>
      <pre>{{ themeStateJson }}</pre>
    </section>

    <section>
      <h2>styles/main.css</h2>
      <pre>{{ themeCss }}</pre>
    </section>

    <section>
      <h2>theme-info.php</h2>
      <pre>{{ themeInfo }}</pre>
    </section>
  </main>
</template>
