<script setup>
import { computed, reactive, ref } from 'vue';
import ThemeControls from './components/ThemeControls.vue';
import AegeaPreview from './preview/AegeaPreview.vue';
import { generateThemeCss } from './theme/css.js';
import { normalizeFolderName, suggestFolderName } from './theme/metadata.js';
import { initialThemeState } from './theme/model.js';
import { generateThemeInfo } from './theme/themeInfo.js';
import { validateMetadata } from './theme/validation.js';
import { generateThemeZip, getThemeZipFileName } from './theme/zip.js';

const themeState = reactive(structuredClone(initialThemeState));
const folderNameEdited = ref(false);
const themeStateJson = computed(() => JSON.stringify(themeState, null, 2));
const themeCss = computed(() => generateThemeCss(themeState));
const themeInfo = computed(() => generateThemeInfo(themeState));
const metadataErrors = computed(() => validateMetadata(themeState.meta));
const canDownloadTheme = computed(() => Object.keys(metadataErrors.value).length === 0);

function updateMetaField(key, value) {
  themeState.meta[key] = key === 'folderName' ? normalizeFolderName(value) : value;

  if (key === 'displayName' && !folderNameEdited.value) {
    themeState.meta.folderName = suggestFolderName(value);
  }

  if (key === 'folderName') {
    folderNameEdited.value = true;
  }
}

function updatePaletteField(key, value) {
  themeState.palette[key] = value;
}

function updateTypographyField(key, value) {
  themeState.typography[key] = value;
}

function updateLayoutField(key, value) {
  themeState.layout[key] = value;
}

function downloadThemeZip() {
  if (!canDownloadTheme.value) {
    return;
  }

  const blob = new Blob([generateThemeZip(themeState)], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = getThemeZipFileName(themeState);
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
        :meta="themeState.meta"
        :metadata-errors="metadataErrors"
        :palette="themeState.palette"
        :typography="themeState.typography"
        :layout="themeState.layout"
        @update:meta-field="updateMetaField"
        @update:palette-field="updatePaletteField"
        @update:typography-field="updateTypographyField"
        @update:layout-field="updateLayoutField"
      />
    </section>

    <section>
      <h2>Export</h2>
      <button class="download-button" type="button" :disabled="!canDownloadTheme" @click="downloadThemeZip">
        Download theme ZIP
      </button>
      <p v-if="!canDownloadTheme" class="download-error">Fix metadata errors to download the theme.</p>
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
