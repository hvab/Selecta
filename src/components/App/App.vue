<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ThemeControls from '../ThemeControls/ThemeControls.vue';
import PresetSelector from '../PresetSelector/PresetSelector.vue';
import AegeaPreview from '../AegeaPreview/AegeaPreview.vue';
import Button from '../../ui/Button/Button.vue';
import ActionMenu from '../../ui/ActionMenu/ActionMenu.vue';
import ConfirmDialog from '../../ui/ConfirmDialog/ConfirmDialog.vue';
import FeedbackTooltip from '../../ui/FeedbackTooltip/FeedbackTooltip.vue';
import RadioGroup from '../../ui/RadioGroup/RadioGroup.vue';
import Popover from '../../ui/Popover/Popover.vue';
import { saveStoredLocale, setDocumentLocale } from '../../i18n/index.js';
import { clearSession, loadSession, saveSession } from '../../storage.js';
import { normalizeFolderName, suggestFolderName } from '../../theme/metadata.js';
import { initialThemeState } from '../../theme/model.js';
import { deserializeThemeDrop } from '../../theme/importDrop.js';
import { deserializeThemeFiles } from '../../theme/importFiles.js';
import { themePresets } from '../../theme/presets.js';
import {
  decodeThemeFromUrlParam,
  deserializeThemeFile,
  encodeThemeToUrlParam,
  getThemeJsonFileName,
  serializeTheme,
} from '../../theme/serialize.js';
import { clearAllFieldLocks, createEmptyFieldLocks } from '../../theme/fieldLocks.js';
import { getRandomThemeState } from '../../theme/random.js';
import { getContrastWarningsByField } from '../../theme/contrast.js';
import { isValidThemeState, validateMetadata } from '../../theme/validation.js';
import { generateThemeZip, getThemeZipFileName } from '../../theme/zip.js';
import { FONT_SOURCE_GOOGLE, FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM } from '../../theme/fonts.js';
import { getSelectedGoogleFontsCss2Url } from '../../theme/googleFonts.js';
import { googleFontsCatalog } from '../../theme/googleFontsCatalog.js';
import { constrainControlsPaneWidth, controlsPaneMinWidth } from '../../ui/panelLayout.js';
import { usePanelLayout } from '../../ui/usePanelLayout.js';

const { locale, t } = useI18n();
const themeState = reactive(structuredClone(initialThemeState));
const fieldLocks = reactive(createEmptyFieldLocks());
const folderNameEdited = ref(false);
const workspaceElement = ref(null);
const {
  controlsPaneWidth,
  effectiveControlsPaneWidth,
  effectiveControlsPaneMaxWidth,
  paneResizerElement,
  getConstrainedControlsPaneWidth,
} = usePanelLayout(workspaceElement);
const themeMode = ref('light');
const shellAppearance = ref(getPreferredShellAppearance());
const isResizingControlsPane = ref(false);
const isResetDialogOpen = ref(false);
const shareFeedbackKey = ref('');
const shareFeedbackOpen = ref(false);
const shareFeedbackView = ref('');
const shareMenuElement = ref(null);
const importErrorKey = ref('');
const themeFilesInput = ref(null);
const metadataErrors = computed(() => validateMetadata(themeState.meta));
const translatedMetadataErrors = computed(() => translateMessageMap(metadataErrors.value, 'validation'));
const activePaletteSection = computed(() => (themeMode.value === 'dark' ? 'darkPalette' : 'palette'));
const activePalette = computed(() => themeState[activePaletteSection.value]);
const activePaletteLocks = computed(() => fieldLocks[activePaletteSection.value]);
const contrastWarningsByField = computed(() => getContrastWarningsByField(activePalette.value));
const translatedContrastWarningsByField = computed(() => translateWarningMap(contrastWarningsByField.value));
const canDownloadTheme = computed(
  () => Object.keys(metadataErrors.value).length === 0 && isValidThemeState(themeState)
);
const selectedPresetId = computed(
  () =>
    themePresets.find(
      (preset) =>
        hasSameSectionValues(themeState.palette, preset.palette) &&
        (!themeState.meta.supportsDarkMode ||
          (preset.supportsDarkMode && hasSameSectionValues(themeState.darkPalette, preset.darkPalette))) &&
        hasSameSectionValues(themeState.typography, preset.typography) &&
        hasSameSectionValues(themeState.layout, preset.layout)
    )?.id ?? ''
);
const lightDarkModeOptions = computed(() => [
  {
    value: 'light',
    label: t('controls.lightThemeMode'),
    title: t('controls.lightThemeTitle'),
    icon: '☀',
  },
  {
    value: 'dark',
    label: t('controls.darkThemeMode'),
    title: t('controls.darkThemeTitle'),
    icon: '☾',
  },
]);
const shellAppearanceOptions = computed(() => [
  { value: 'light', label: t('controls.shellLight') },
  { value: 'dark', label: t('controls.shellDark') },
]);
const shareActions = computed(() => [
  {
    value: 'copy-link',
    label: t('actions.copyLink'),
    disabled: !canDownloadTheme.value,
  },
  {
    value: 'export-json',
    label: t('actions.exportJson'),
    disabled: !canDownloadTheme.value,
  },
]);
const localeOptions = computed(() => [
  {
    value: 'ru',
    label: t('language.ru'),
    ariaLabel: t('language.ru'),
  },
  {
    value: 'en',
    label: t('language.en'),
    ariaLabel: t('language.en'),
  },
]);
const appStyle = computed(() => ({
  '--controls-pane-width': `${effectiveControlsPaneWidth.value}px`,
}));
const shareButtonElement = computed(() => shareMenuElement.value?.querySelector('button') ?? null);
const effectiveShellAppearance = computed(() => shellAppearance.value);
const googleFontsPreviewUrl = computed(() => getSelectedGoogleFontsCss2Url(googleFontsCatalog, themeState.typography));

const sessionSaveDelay = 500;
let sessionSaveTimeout = null;
let lastSavedSessionSnapshot = null;
let shareFeedbackTimeout = null;
let themeImportRevision = 0;
const themeUrlParam = 'theme';
const fontSourceKeyByFamilyKey = {
  mainFontFamily: 'mainFontSource',
  noteFontFamily: 'noteFontSource',
};
const fontFamilyKeyBySourceKey = {
  mainFontSource: 'mainFontFamily',
  noteFontSource: 'noteFontFamily',
};

function translateMessageMap(messagesByField, namespace) {
  return Object.fromEntries(
    Object.entries(messagesByField).map(([field, messageKey]) => [field, t(`${namespace}.${messageKey}`)])
  );
}

function translateWarningMap(warningsByField) {
  return Object.fromEntries(
    Object.entries(warningsByField).map(([field, messages]) => [
      field,
      messages.map((messageKey) => t(`contrast.${messageKey}`)),
    ])
  );
}

function hasSameSectionValues(section, referenceSection) {
  return Object.entries(referenceSection).every(([key, value]) => section[key] === value);
}

function applyThemeState(nextThemeState) {
  invalidateThemeImport();

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
    themeMode: themeMode.value,
    shellAppearance: shellAppearance.value,
  };
}

function getCurrentSession() {
  return {
    themeState,
    fieldLocks,
    uiState: getUiState(),
  };
}

function saveCurrentSession() {
  clearTimeout(sessionSaveTimeout);
  sessionSaveTimeout = null;
  const session = getCurrentSession();
  const snapshot = JSON.stringify(session);

  if (snapshot !== lastSavedSessionSnapshot && saveSession(session)) {
    lastSavedSessionSnapshot = snapshot;
  }
}

function resetThemeState() {
  applyThemeState(structuredClone(initialThemeState));
  clearAllFieldLocks(fieldLocks);
  folderNameEdited.value = false;
  themeMode.value = 'light';
  shellAppearance.value = getPreferredShellAppearance();
}

function inferFolderNameEdited(meta) {
  return meta.folderName !== suggestFolderName(meta.displayName);
}

function clearShareFeedback() {
  clearTimeout(shareFeedbackTimeout);
  shareFeedbackKey.value = '';
  shareFeedbackOpen.value = false;
  shareFeedbackView.value = '';
}

function showShareFeedback(key, view = '') {
  clearShareFeedback();
  shareFeedbackKey.value = key;
  shareFeedbackOpen.value = true;
  shareFeedbackView.value = view;
  shareFeedbackTimeout = setTimeout(clearShareFeedback, 2500);
}

function clearStatusMessages() {
  clearShareFeedback();
  importErrorKey.value = '';
}

function invalidateThemeImport() {
  themeImportRevision += 1;
}

function updateLocale(nextLocale) {
  locale.value = nextLocale;
  saveStoredLocale(locale.value);
}

function setDocumentMetaContent(name, content) {
  globalThis.document?.querySelector(`meta[name="${name}"]`)?.setAttribute('content', content);
}

function updateDocumentMetadata() {
  if (globalThis.document) {
    globalThis.document.title = t('app.title');
  }

  setDocumentLocale(locale.value);
  setDocumentMetaContent('description', t('app.metaDescription'));
  setDocumentMetaContent('keywords', t('app.metaKeywords'));
}

function setDocumentColorScheme(appearance) {
  globalThis.document?.documentElement.setAttribute('data-color-scheme', appearance);
}

function applySharedThemeState(nextThemeState) {
  applyThemeState(nextThemeState);
  clearAllFieldLocks(fieldLocks);
  folderNameEdited.value = inferFolderNameEdited(nextThemeState.meta);
  themeMode.value = nextThemeState.meta.supportsDarkMode ? themeMode.value : 'light';
}

function updateMetaField(key, value) {
  invalidateThemeImport();
  clearStatusMessages();
  themeState.meta[key] = key === 'folderName' ? normalizeFolderName(value) : value;

  if (key === 'supportsDarkMode' && !value) {
    themeMode.value = 'light';
  }

  if (key === 'displayName' && !folderNameEdited.value) {
    themeState.meta.folderName = suggestFolderName(value);
  }

  if (key === 'folderName') {
    folderNameEdited.value = true;
  }
}

function updatePaletteField(key, value) {
  invalidateThemeImport();
  clearStatusMessages();
  activePalette.value[key] = value;
}

function updateThemeMode(nextThemeMode) {
  if (nextThemeMode === 'dark') {
    if (!themeState.meta.supportsDarkMode) {
      invalidateThemeImport();
    }

    themeState.meta.supportsDarkMode = true;
  }

  themeMode.value = nextThemeMode === 'dark' && themeState.meta.supportsDarkMode ? 'dark' : 'light';
}

function updateShellAppearance(nextShellAppearance) {
  if (nextShellAppearance === 'light' || nextShellAppearance === 'dark') {
    shellAppearance.value = nextShellAppearance;
  }
}

function handleShareAction(action) {
  if (action === 'copy-link') {
    copyThemeLink();
  }

  if (action === 'export-json') {
    downloadThemeJson();
  }
}

function updateTypographyField(key, value) {
  invalidateThemeImport();
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
  invalidateThemeImport();
  clearStatusMessages();
  themeState.layout[key] = value;
}

function applyPreset(presetId) {
  clearStatusMessages();
  const preset = themePresets.find(({ id }) => id === presetId);

  if (!preset) {
    return;
  }

  invalidateThemeImport();
  themeState.meta.supportsDarkMode = preset.supportsDarkMode;
  Object.assign(themeState.palette, preset.palette);
  Object.assign(themeState.darkPalette, preset.darkPalette ?? initialThemeState.darkPalette);
  Object.assign(themeState.typography, preset.typography);
  Object.assign(themeState.layout, preset.layout);
  themeMode.value = preset.supportsDarkMode ? themeMode.value : 'light';
  clearAllFieldLocks(fieldLocks);
}

function toggleFieldLock(section, key, locked) {
  invalidateThemeImport();
  clearStatusMessages();
  fieldLocks[section][key] = locked;
}

function toggleGroupLock(section, keys, locked) {
  invalidateThemeImport();
  clearStatusMessages();

  for (const key of keys) {
    fieldLocks[section][key] = locked;
  }
}

function resetToDefaults() {
  clearStatusMessages();
  clearThemeUrlParam();
  clearSession();
  resetThemeState();
  lastSavedSessionSnapshot = null;
  saveCurrentSession();
}

function randomizePalette(section, randomPalette) {
  for (const [key, locked] of Object.entries(fieldLocks[section])) {
    if (!locked) {
      themeState[section][key] = randomPalette[key];
    }
  }
}

function randomizeTheme() {
  invalidateThemeImport();
  clearStatusMessages();
  const randomThemeState = getRandomThemeState(themeState, fieldLocks);

  if (!fieldLocks.meta.displayName) {
    themeState.meta.displayName = randomThemeState.meta.displayName;
  }

  if (!fieldLocks.meta.folderName) {
    themeState.meta.folderName = randomThemeState.meta.folderName;
  }

  randomizePalette('palette', randomThemeState.palette);

  if (themeState.meta.supportsDarkMode) {
    randomizePalette('darkPalette', randomThemeState.darkPalette);
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
  const workspaceLeft = workspaceElement.value?.getBoundingClientRect().left ?? 0;

  controlsPaneWidth.value = getConstrainedControlsPaneWidth(event.clientX - workspaceLeft);
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
  controlsPaneWidth.value = getConstrainedControlsPaneWidth(effectiveControlsPaneWidth.value + step);
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
    showShareFeedback('status.themeLinkCopied');
  } catch {
    showShareFeedback('status.themeLinkCopyFailed', 'danger');
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
  themeFilesInput.value?.click();
}

async function importThemeJson(event) {
  return importThemeFiles(event, (files) => deserializeThemeFile(files[0]), 'status.themeJsonInvalid');
}

async function importSelectedThemeFiles(event) {
  if (event.target.files?.length === 1 && /\.json$/i.test(event.target.files[0].name)) {
    return importThemeJson(event);
  }

  return importThemeFiles(event, deserializeThemeFiles, 'status.themeFilesInvalid');
}

async function importThemeFiles(event, readTheme, errorKey) {
  const files = [...(event.target.files ?? [])];

  if (!files.length) {
    clearStatusMessages();
    return;
  }

  event.target.value = '';

  return applyThemeImport(() => readTheme(files), errorKey);
}

function importDroppedTheme(dataTransfer) {
  if (![...(dataTransfer?.types ?? [])].includes('Files')) {
    return;
  }

  return applyThemeImport(() => deserializeThemeDrop(dataTransfer), 'status.themeFilesInvalid');
}

async function applyThemeImport(readTheme, errorKey) {
  clearStatusMessages();
  const importRevision = ++themeImportRevision;

  try {
    const nextThemeState = await readTheme();

    if (importRevision !== themeImportRevision) {
      return;
    }

    applySharedThemeState(nextThemeState);
    clearThemeUrlParam();
  } catch {
    if (importRevision === themeImportRevision) {
      importErrorKey.value = errorKey;
    }
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

function getPreferredShellAppearance() {
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredThemeMode(uiState) {
  return uiState.themeMode ?? uiState.previewMode ?? uiState.activePaletteMode;
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    saveCurrentSession();
  }
}

onMounted(() => {
  const preferredShellAppearance = getPreferredShellAppearance();

  shellAppearance.value = preferredShellAppearance;
  window.addEventListener('pagehide', saveCurrentSession);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const themeParam = new URLSearchParams(window.location.search).get(themeUrlParam);

  if (themeParam) {
    try {
      applySharedThemeState(decodeThemeFromUrlParam(themeParam));
      clearThemeUrlParam();
      saveCurrentSession();
      return;
    } catch {
      clearThemeUrlParam();
      showShareFeedback('status.themeLinkInvalid', 'danger');
    }
  }

  const session = loadSession();

  if (session) {
    applyThemeState(session.themeState);
    applyFieldLocks(session.fieldLocks);
    controlsPaneWidth.value = constrainControlsPaneWidth(session.uiState.sidebarWidth);
    folderNameEdited.value = session.uiState.folderNameEdited;
    themeMode.value =
      getStoredThemeMode(session.uiState) === 'dark' && themeState.meta.supportsDarkMode ? 'dark' : 'light';
    shellAppearance.value = session.uiState.shellAppearance;
  }

  lastSavedSessionSnapshot = JSON.stringify(getCurrentSession());
});

onBeforeUnmount(() => {
  invalidateThemeImport();
  saveCurrentSession();
  window.removeEventListener('pagehide', saveCurrentSession);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  clearTimeout(shareFeedbackTimeout);
  globalThis.document?.documentElement.removeAttribute('data-color-scheme');
});

watch(
  [themeState, fieldLocks, controlsPaneWidth, folderNameEdited, themeMode, shellAppearance],
  () => {
    clearTimeout(sessionSaveTimeout);
    sessionSaveTimeout = setTimeout(saveCurrentSession, sessionSaveDelay);
  },
  { deep: true }
);

watch(locale, updateDocumentMetadata, { immediate: true });
watch(effectiveShellAppearance, setDocumentColorScheme, { immediate: true });
</script>

<template>
  <Teleport to="head">
    <link v-if="googleFontsPreviewUrl" rel="stylesheet" :href="googleFontsPreviewUrl" />
  </Teleport>

  <main class="app" :style="appStyle">
    <div ref="workspaceElement" class="app__workspace">
      <aside class="app__controls-pane">
        <header class="app__sidebar-header">
          <div class="app__brand">
            <h1 class="app__header-title hb-text hb-text_typography_header-2">{{ t('app.name') }}</h1>
            <p class="app__header-description hb-text hb-text_typography_body-3 hb-text_color_secondary">
              {{ t('app.descriptionPrefix') }}
              <a :href="t('app.aegeaHref')" class="hb-link hb-link_view_secondary hb-link_underline">
                {{ t('app.aegeaName') }}
              </a>
            </p>
          </div>
          <Popover :label="t('actions.interfaceSettings')">
            <template #trigger>
              <Button
                class="app__symbol-button"
                size="l"
                :aria-label="t('actions.interfaceSettings')"
                :title="t('actions.interfaceSettings')"
              >
                <span class="app__button-symbol" aria-hidden="true">⚙︎</span>
              </Button>
            </template>
            <div class="app__interface-settings">
              <div class="app__settings-field">
                <span class="hb-text hb-text_typography_body-1">{{ t('controls.shellAppearance') }}</span>
                <RadioGroup
                  name="shell-appearance"
                  :value="shellAppearance"
                  :aria-label="t('aria.shellAppearance')"
                  :options="shellAppearanceOptions"
                  @update:value="updateShellAppearance"
                />
              </div>
              <div class="app__settings-field">
                <span class="hb-text hb-text_typography_body-1">{{ t('aria.language') }}</span>
                <RadioGroup
                  name="locale"
                  :value="locale"
                  :aria-label="t('aria.language')"
                  :options="localeOptions"
                  @update:value="updateLocale"
                />
              </div>
            </div>
          </Popover>
        </header>
        <div class="app__controls-scroll">
          <div class="app__theme-actions">
            <ConfirmDialog
              :open="isResetDialogOpen"
              :question="t('confirm.resetTheme')"
              @update:open="isResetDialogOpen = $event"
              @confirm="resetToDefaults"
            >
              <template #trigger>
                <Button view="outlined" size="l">{{ t('actions.resetToDefaults') }}</Button>
              </template>
              <template #cancel>
                <Button view="outlined">{{ t('actions.cancel') }}</Button>
              </template>
              <template #action>
                <Button view="action">{{ t('actions.confirmReset') }}</Button>
              </template>
            </ConfirmDialog>
            <Button class="app__random-button" view="normal" size="l" @click="randomizeTheme">
              {{ t('actions.random') }}
            </Button>
          </div>
          <section class="app__controls-section">
            <PresetSelector
              :import-error="importErrorKey ? t(importErrorKey) : ''"
              :presets="themePresets"
              :selected-preset-id="selectedPresetId"
              @apply-preset="applyPreset"
              @import-files="openThemeJsonImport"
              @drop-theme="importDroppedTheme"
            />
            <input
              ref="themeFilesInput"
              class="app__import-json-input"
              type="file"
              accept=".zip,.json,.css,.php"
              multiple
              @change="importSelectedThemeFiles"
            />
            <ThemeControls
              :meta="themeState.meta"
              :metadata-errors="translatedMetadataErrors"
              :contrast-warnings-by-field="translatedContrastWarningsByField"
              :field-locks="fieldLocks"
              :palette-locks="activePaletteLocks"
              :palette-section="activePaletteSection"
              :palette="activePalette"
              :typography="themeState.typography"
              :layout="themeState.layout"
              @update:meta-field="updateMetaField"
              @update:palette-field="updatePaletteField"
              @update:typography-field="updateTypographyField"
              @update:layout-field="updateLayoutField"
              @toggle-group-lock="toggleGroupLock"
              @toggle-field-lock="toggleFieldLock"
            />
          </section>
        </div>
        <footer class="app__sidebar-footer">
          <div class="app__export-actions">
            <Button view="action" size="l" :disabled="!canDownloadTheme" @click="downloadThemeZip">
              {{ t('actions.downloadThemeZip') }}
            </Button>
            <div class="app__share">
              <div ref="shareMenuElement">
                <ActionMenu
                  side="top"
                  :actions="shareActions"
                  @menu-open="clearShareFeedback"
                  @select="handleShareAction"
                >
                  <template #trigger>
                    <Button
                      class="app__symbol-button"
                      view="outlined"
                      size="l"
                      :aria-label="t('actions.moreActions')"
                      :title="t('actions.moreActions')"
                    >
                      <span class="app__button-symbol" aria-hidden="true">⋮</span>
                    </Button>
                  </template>
                </ActionMenu>
              </div>
              <FeedbackTooltip
                side="top"
                :message="shareFeedbackKey ? t(shareFeedbackKey) : ''"
                :open="shareFeedbackOpen"
                :reference="shareButtonElement"
                :view="shareFeedbackView"
              />
              <p v-if="shareFeedbackKey" class="app__visually-hidden" :role="shareFeedbackView ? 'alert' : 'status'">
                {{ t(shareFeedbackKey) }}
              </p>
            </div>
          </div>
          <p v-if="!canDownloadTheme" class="download-error hb-text hb-text_typography_body-1">
            {{ t('status.fixMetadata') }}
          </p>
        </footer>
      </aside>

      <div
        ref="paneResizerElement"
        class="app__pane-resizer"
        role="separator"
        tabindex="0"
        :aria-label="t('aria.resizeControlsPanel')"
        aria-orientation="vertical"
        :aria-valuemin="controlsPaneMinWidth"
        :aria-valuemax="effectiveControlsPaneMaxWidth"
        :aria-valuenow="effectiveControlsPaneWidth"
        @pointerdown="startControlsPaneResize"
        @pointermove="handleControlsPaneResize"
        @pointerup="stopControlsPaneResize"
        @pointercancel="stopControlsPaneResize"
        @keydown="handleControlsPaneResizeKeydown"
      ></div>

      <section
        class="app__preview-pane"
        :style="{ backgroundColor: activePalette.background }"
        :aria-label="t('aria.preview')"
      >
        <div class="app__preview-toolbar">
          <div class="app__preview-mode">
            <RadioGroup
              name="theme-mode"
              :value="themeMode"
              :aria-label="t('aria.themeMode')"
              :options="lightDarkModeOptions"
              :show-option-labels="false"
              @update:value="updateThemeMode"
            />
          </div>
        </div>
        <div class="app__preview-scroll">
          <AegeaPreview :theme-state="themeState" :preview-mode="themeMode" />
        </div>
      </section>
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
</style>
<style scoped src="./App.css"></style>
