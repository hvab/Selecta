<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ThemeControls from './components/ThemeControls.vue';
import AegeaPreview from './preview/AegeaPreview.vue';
import { clearSession, loadSession, saveSession } from './storage.js';
import { normalizeFolderName, suggestFolderName } from './theme/metadata.js';
import { initialThemeState } from './theme/model.js';
import { clearAllFieldLocks, createEmptyFieldLocks, hasAnyFieldLocked } from './theme/fieldLocks.js';
import { getRandomThemeState } from './theme/random.js';
import { getContrastWarningsByField } from './theme/contrast.js';
import { validateMetadata } from './theme/validation.js';
import { generateThemeZip, getThemeZipFileName } from './theme/zip.js';

const themeState = reactive(structuredClone(initialThemeState));
const fieldLocks = reactive(createEmptyFieldLocks());
const folderNameEdited = ref(false);
const appElement = ref(null);
const defaultControlsPaneWidth = 416;
const controlsPaneWidth = ref(defaultControlsPaneWidth);
const isResizingControlsPane = ref(false);
const metadataErrors = computed(() => validateMetadata(themeState.meta));
const contrastWarningsByField = computed(() => getContrastWarningsByField(themeState.palette));
const hasFieldLocks = computed(() => hasAnyFieldLocked(fieldLocks));
const canDownloadTheme = computed(() => Object.keys(metadataErrors.value).length === 0);
const appStyle = computed(() => ({
  '--controls-pane-width': `${controlsPaneWidth.value}px`,
}));

const controlsPaneMinWidth = 320;
const controlsPaneMaxWidth = 672;
const previewPaneMinWidth = 360;
const sessionSaveDelay = 500;
let sessionSaveTimeout = null;
let shouldSkipNextSessionSave = false;
const effectiveControlsPaneMaxWidth = computed(() => {
  const appWidth = appElement.value?.getBoundingClientRect().width ?? window.innerWidth;

  return Math.max(controlsPaneMinWidth, Math.min(controlsPaneMaxWidth, appWidth - previewPaneMinWidth));
});

function getConstrainedControlsPaneWidth(value) {
  return Math.min(Math.max(value, controlsPaneMinWidth), effectiveControlsPaneMaxWidth.value);
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
  controlsPaneWidth.value = getConstrainedControlsPaneWidth(defaultControlsPaneWidth);
  folderNameEdited.value = false;
}

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

function toggleFieldLock(section, key, locked) {
  fieldLocks[section][key] = locked;
}

function unlockAllFields() {
  clearAllFieldLocks(fieldLocks);
}

function resetToDefaults() {
  clearTimeout(sessionSaveTimeout);
  shouldSkipNextSessionSave = true;
  clearSession();
  resetThemeState();
}

function randomizeTheme() {
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
  <main ref="appElement" class="app" :style="appStyle">
    <aside class="app-controls-pane">
      <div class="app-controls-scroll">
        <header class="app-header">
          <h1>Selecta</h1>
          <p>Theme generator for Aegea.</p>
        </header>

        <section class="controls-section">
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
        <button class="download-button" type="button" :disabled="!canDownloadTheme" @click="downloadThemeZip">
          Download theme ZIP
        </button>
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
