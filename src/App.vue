<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ThemeControls from './components/ThemeControls.vue';
import PresetSelector from './components/PresetSelector.vue';
import AegeaPreview from './preview/AegeaPreview.vue';
import { clearSession, loadSession, saveSession } from './storage.js';
import { normalizeFolderName, suggestFolderName } from './theme/metadata.js';
import { initialThemeState } from './theme/model.js';
import { themePresets } from './theme/presets.js';
import {
  decodeThemeFromUrlParam,
  deserializeThemeFile,
  encodeThemeToUrlParam,
  getThemeJsonFileName,
  serializeTheme,
} from './theme/serialize.js';
import { clearAllFieldLocks, createEmptyFieldLocks, hasAnyFieldLocked } from './theme/fieldLocks.js';
import { getRandomThemeState } from './theme/random.js';
import { getContrastWarningsByField } from './theme/contrast.js';
import { validateMetadata } from './theme/validation.js';
import { generateThemeZip, getThemeZipFileName } from './theme/zip.js';
import { FONT_SOURCE_GOOGLE, FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM } from './theme/fonts.js';
import { getSelectedGoogleFontsCss2Url } from './theme/googleFonts.js';
import { googleFontsCatalog } from './theme/googleFontsCatalog.js';

const themeState = reactive(structuredClone(initialThemeState));
const fieldLocks = reactive(createEmptyFieldLocks());
const folderNameEdited = ref(false);
const appElement = ref(null);
const defaultControlsPaneWidth = 416;
const controlsPaneWidth = ref(defaultControlsPaneWidth);
const isResizingControlsPane = ref(false);
const shareMessage = ref('');
const shareError = ref('');
const importMessage = ref('');
const importError = ref('');
const themeJsonFileInput = ref(null);
const metadataErrors = computed(() => validateMetadata(themeState.meta));
const contrastWarningsByField = computed(() => getContrastWarningsByField(themeState.palette));
const hasFieldLocks = computed(() => hasAnyFieldLocked(fieldLocks));
const canDownloadTheme = computed(() => Object.keys(metadataErrors.value).length === 0);
const selectedPresetId = computed(
  () =>
    themePresets.find(
      (preset) =>
        hasSameSectionValues(themeState.palette, preset.palette) &&
        hasSameSectionValues(themeState.typography, preset.typography) &&
        hasSameSectionValues(themeState.layout, preset.layout)
    )?.id ?? ''
);
const appStyle = computed(() => ({
  '--controls-pane-width': `${controlsPaneWidth.value}px`,
}));
const googleFontsPreviewUrl = computed(() => getSelectedGoogleFontsCss2Url(googleFontsCatalog, themeState.typography));

const controlsPaneMinWidth = 320;
const controlsPaneMaxWidth = 672;
const previewPaneMinWidth = 360;
const sessionSaveDelay = 500;
let sessionSaveTimeout = null;
let shouldSkipNextSessionSave = false;
const themeUrlParam = 'theme';
const fontSourceKeyByFamilyKey = {
  mainFontFamily: 'mainFontSource',
  noteFontFamily: 'noteFontSource',
};
const fontFamilyKeyBySourceKey = {
  mainFontSource: 'mainFontFamily',
  noteFontSource: 'noteFontFamily',
};
const effectiveControlsPaneMaxWidth = computed(() => {
  const appWidth = appElement.value?.getBoundingClientRect().width ?? window.innerWidth;

  return Math.max(controlsPaneMinWidth, Math.min(controlsPaneMaxWidth, appWidth - previewPaneMinWidth));
});

function getConstrainedControlsPaneWidth(value) {
  return Math.min(Math.max(value, controlsPaneMinWidth), effectiveControlsPaneMaxWidth.value);
}

function hasSameSectionValues(section, referenceSection) {
  return Object.entries(referenceSection).every(([key, value]) => section[key] === value);
}

function applyThemeState(nextThemeState) {
  for (const section of Object.keys(initialThemeState)) {
    Object.assign(themeState[section], nextThemeState[section]);
  }
}

function applyFieldLocks(nextFieldLocks) {
  for (const section of Object.keys(fieldLocks)) {
    Object.assign(fieldLocks[section], nextFieldLocks[section]);
  }
}

function getUiState() {
  return {
    sidebarWidth: controlsPaneWidth.value,
    folderNameEdited: folderNameEdited.value,
  };
}

function resetThemeState() {
  applyThemeState(structuredClone(initialThemeState));
  clearAllFieldLocks(fieldLocks);
  folderNameEdited.value = false;
}

function inferFolderNameEdited(meta) {
  return meta.folderName !== suggestFolderName(meta.displayName);
}

function clearStatusMessages() {
  shareMessage.value = '';
  shareError.value = '';
  importMessage.value = '';
  importError.value = '';
}

function applySharedThemeState(nextThemeState) {
  applyThemeState(nextThemeState);
  clearAllFieldLocks(fieldLocks);
  folderNameEdited.value = inferFolderNameEdited(nextThemeState.meta);
}

function updateMetaField(key, value) {
  clearStatusMessages();
  themeState.meta[key] = key === 'folderName' ? normalizeFolderName(value) : value;

  if (key === 'displayName' && !folderNameEdited.value) {
    themeState.meta.folderName = suggestFolderName(value);
  }

  if (key === 'folderName') {
    folderNameEdited.value = true;
  }
}

function updatePaletteField(key, value) {
  clearStatusMessages();
  themeState.palette[key] = value;
}

function updateTypographyField(key, value) {
  clearStatusMessages();
  themeState.typography[key] = value;

  if (fontFamilyKeyBySourceKey[key] && value === FONT_SOURCE_PLAIN) {
    themeState.typography[fontFamilyKeyBySourceKey[key]] = '';
  }

  if (fontSourceKeyByFamilyKey[key] && themeState.typography[fontSourceKeyByFamilyKey[key]] !== FONT_SOURCE_GOOGLE) {
    themeState.typography[fontSourceKeyByFamilyKey[key]] = value.trim() ? FONT_SOURCE_SYSTEM : FONT_SOURCE_PLAIN;
  }
}

function updateLayoutField(key, value) {
  clearStatusMessages();
  themeState.layout[key] = value;
}

function applyPreset(presetId) {
  clearStatusMessages();
  const preset = themePresets.find(({ id }) => id === presetId);

  if (!preset) {
    return;
  }

  Object.assign(themeState.palette, preset.palette);
  Object.assign(themeState.typography, preset.typography);
  Object.assign(themeState.layout, preset.layout);
  clearAllFieldLocks(fieldLocks);
}

function toggleFieldLock(section, key, locked) {
  clearStatusMessages();
  fieldLocks[section][key] = locked;
}

function unlockAllFields() {
  clearStatusMessages();
  clearAllFieldLocks(fieldLocks);
}

function resetToDefaults() {
  clearTimeout(sessionSaveTimeout);
  shouldSkipNextSessionSave = true;
  clearStatusMessages();
  clearThemeUrlParam();
  clearSession();
  resetThemeState();
  saveSession({
    themeState,
    fieldLocks,
    uiState: getUiState(),
  });
}

function randomizeTheme() {
  clearStatusMessages();
  const randomThemeState = getRandomThemeState(themeState, fieldLocks);

  if (!fieldLocks.meta.displayName) {
    themeState.meta.displayName = randomThemeState.meta.displayName;
  }

  if (!fieldLocks.meta.folderName) {
    themeState.meta.folderName = randomThemeState.meta.folderName;
  }

  for (const [key, locked] of Object.entries(fieldLocks.palette)) {
    if (!locked) {
      themeState.palette[key] = randomThemeState.palette[key];
    }
  }

  for (const [key, locked] of Object.entries(fieldLocks.typography)) {
    if (!locked) {
      themeState.typography[key] = randomThemeState.typography[key];

      if (fontSourceKeyByFamilyKey[key]) {
        themeState.typography[fontSourceKeyByFamilyKey[key]] =
          randomThemeState.typography[fontSourceKeyByFamilyKey[key]];
      }
    }
  }

  for (const [key, locked] of Object.entries(fieldLocks.layout)) {
    if (!locked) {
      themeState.layout[key] = randomThemeState.layout[key];
    }
  }

  if (!fieldLocks.meta.displayName && !fieldLocks.meta.folderName) {
    folderNameEdited.value = false;
  }
}

function resizeControlsPane(event) {
  const appLeft = appElement.value?.getBoundingClientRect().left ?? 0;

  controlsPaneWidth.value = getConstrainedControlsPaneWidth(event.clientX - appLeft);
}

function startControlsPaneResize(event) {
  event.preventDefault();
  isResizingControlsPane.value = true;
  event.currentTarget.setPointerCapture(event.pointerId);
  resizeControlsPane(event);
}

function stopControlsPaneResize(event) {
  isResizingControlsPane.value = false;

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

function handleControlsPaneResize(event) {
  if (isResizingControlsPane.value) {
    resizeControlsPane(event);
  }
}

function resizeControlsPaneByStep(step) {
  controlsPaneWidth.value = getConstrainedControlsPaneWidth(controlsPaneWidth.value + step);
}

function handleControlsPaneResizeKeydown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    resizeControlsPaneByStep(-16);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    resizeControlsPaneByStep(16);
  }
}

function getThemeShareUrl() {
  const url = new URL(window.location.href);

  url.searchParams.set(themeUrlParam, encodeThemeToUrlParam(themeState));

  return url.toString();
}

function clearThemeUrlParam() {
  if (!window.history?.replaceState) {
    return;
  }

  const url = new URL(window.location.href);

  if (!url.searchParams.has(themeUrlParam)) {
    return;
  }

  url.searchParams.delete(themeUrlParam);
  window.history.replaceState(null, '', url.toString());
}

async function copyThemeLink() {
  clearStatusMessages();

  try {
    await navigator.clipboard.writeText(getThemeShareUrl());
    shareMessage.value = 'Theme link copied.';
  } catch {
    shareError.value = 'Could not copy the theme link.';
  }
}

function downloadThemeJson() {
  clearStatusMessages();

  if (!canDownloadTheme.value) {
    return;
  }

  const blob = new Blob([serializeTheme(themeState)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = getThemeJsonFileName(themeState);
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openThemeJsonImport() {
  clearStatusMessages();
  themeJsonFileInput.value?.click();
}

async function importThemeJson(event) {
  clearStatusMessages();
  const [file] = event.target.files ?? [];

  if (!file) {
    return;
  }

  try {
    applySharedThemeState(await deserializeThemeFile(file));
    clearThemeUrlParam();
    importMessage.value = 'Theme JSON imported.';
  } catch {
    importError.value = 'Theme JSON is invalid.';
  } finally {
    event.target.value = '';
  }
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

onMounted(() => {
  const themeParam = new URLSearchParams(window.location.search).get(themeUrlParam);

  if (themeParam) {
    try {
      applySharedThemeState(decodeThemeFromUrlParam(themeParam));
      clearThemeUrlParam();
      return;
    } catch {
      clearThemeUrlParam();
      shareError.value = 'Theme link is invalid; loaded saved session instead.';
    }
  }

  const session = loadSession();

  if (session) {
    applyThemeState(session.themeState);
    applyFieldLocks(session.fieldLocks);
    controlsPaneWidth.value = getConstrainedControlsPaneWidth(session.uiState.sidebarWidth);
    folderNameEdited.value = session.uiState.folderNameEdited;
  }
});

watch(
  [themeState, fieldLocks, controlsPaneWidth, folderNameEdited],
  () => {
    clearTimeout(sessionSaveTimeout);

    if (shouldSkipNextSessionSave) {
      shouldSkipNextSessionSave = false;
      return;
    }

    sessionSaveTimeout = setTimeout(() => {
      saveSession({
        themeState,
        fieldLocks,
        uiState: getUiState(),
      });
    }, sessionSaveDelay);
  },
  { deep: true }
);
</script>

<template>
  <Teleport to="head">
    <link v-if="googleFontsPreviewUrl" rel="stylesheet" :href="googleFontsPreviewUrl" />
  </Teleport>

  <main ref="appElement" class="app" :style="appStyle">
    <aside class="app-controls-pane">
      <div class="app-controls-scroll">
        <header class="app-header">
          <h1>Selecta</h1>
          <p>
            Theme generator for
            <a href="https://blogengine.me">Aegea</a>.
          </p>
        </header>

        <section class="controls-section">
          <PresetSelector :presets="themePresets" :selected-preset-id="selectedPresetId" @apply-preset="applyPreset" />
          <ThemeControls
            :meta="themeState.meta"
            :metadata-errors="metadataErrors"
            :contrast-warnings-by-field="contrastWarningsByField"
            :field-locks="fieldLocks"
            :palette="themeState.palette"
            :typography="themeState.typography"
            :layout="themeState.layout"
            @update:meta-field="updateMetaField"
            @update:palette-field="updatePaletteField"
            @update:typography-field="updateTypographyField"
            @update:layout-field="updateLayoutField"
            @toggle-field-lock="toggleFieldLock"
          />
        </section>
      </div>

      <section class="export-section" aria-label="Export">
        <button class="random-button" type="button" @click="randomizeTheme">Random</button>
        <button class="unlock-button" type="button" :disabled="!hasFieldLocks" @click="unlockAllFields">
          Unlock all
        </button>
        <button class="reset-button" type="button" @click="resetToDefaults">Reset to defaults</button>
        <button class="copy-link-button" type="button" :disabled="!canDownloadTheme" @click="copyThemeLink">
          Copy link
        </button>
        <button class="export-json-button" type="button" :disabled="!canDownloadTheme" @click="downloadThemeJson">
          Export JSON
        </button>
        <button class="import-json-button" type="button" @click="openThemeJsonImport">Import JSON</button>
        <input
          ref="themeJsonFileInput"
          class="import-json-input"
          type="file"
          accept=".json,application/json"
          @change="importThemeJson"
        />
        <button class="download-button" type="button" :disabled="!canDownloadTheme" @click="downloadThemeZip">
          Download theme ZIP
        </button>
        <p v-if="shareMessage" class="share-message">{{ shareMessage }}</p>
        <p v-if="shareError" class="share-error">{{ shareError }}</p>
        <p v-if="importMessage" class="import-message">{{ importMessage }}</p>
        <p v-if="importError" class="import-error">{{ importError }}</p>
        <p v-if="!canDownloadTheme" class="download-error">Fix metadata errors to download the theme.</p>
      </section>
    </aside>

    <div
      class="app-pane-resizer"
      role="separator"
      tabindex="0"
      aria-label="Resize controls panel"
      aria-orientation="vertical"
      :aria-valuemin="controlsPaneMinWidth"
      :aria-valuemax="effectiveControlsPaneMaxWidth"
      :aria-valuenow="Math.round(controlsPaneWidth)"
      @pointerdown="startControlsPaneResize"
      @pointermove="handleControlsPaneResize"
      @pointerup="stopControlsPaneResize"
      @pointercancel="stopControlsPaneResize"
      @keydown="handleControlsPaneResizeKeydown"
    ></div>

    <section class="app-preview-pane" aria-label="Preview">
      <AegeaPreview :theme-state="themeState" />
    </section>
  </main>
</template>
