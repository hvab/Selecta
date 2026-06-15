<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PALETTE_COLOR_CONTROLS } from '../theme/fieldLocks.js';
import {
  FONT_SOURCE_GOOGLE,
  FONT_SOURCE_PLAIN,
  FONT_SOURCE_SYSTEM,
  namedSystemFamilies,
  systemStackVariants,
} from '../theme/fonts.js';
import { googleFontsCatalog } from '../theme/googleFontsCatalog.js';

const { t } = useI18n();
const props = defineProps({
  meta: {
    type: Object,
    required: true,
  },
  metadataErrors: {
    type: Object,
    required: true,
  },
  contrastWarningsByField: {
    type: Object,
    required: true,
  },
  fieldLocks: {
    type: Object,
    required: true,
  },
  palette: {
    type: Object,
    required: true,
  },
  typography: {
    type: Object,
    required: true,
  },
  layout: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'update:meta-field',
  'update:palette-field',
  'update:typography-field',
  'update:layout-field',
  'toggle-field-lock',
]);

const metadataControls = [
  {
    key: 'displayName',
    labelKey: 'controls.displayName',
  },
  {
    key: 'folderName',
    labelKey: 'controls.folderName',
  },
];

const fontControls = [
  {
    familyKey: 'mainFontFamily',
    sourceKey: 'mainFontSource',
    labelKey: 'controls.interfaceFont',
  },
  {
    familyKey: 'noteFontFamily',
    sourceKey: 'noteFontSource',
    labelKey: 'controls.noteTextFont',
  },
];

const googleFontCategories = [
  { category: 'Sans Serif', labelKey: 'fontCategories.sansSerif' },
  { category: 'Serif', labelKey: 'fontCategories.serif' },
  { category: 'Monospace', labelKey: 'fontCategories.monospace' },
  { category: 'Display', labelKey: 'fontCategories.display' },
  { category: 'Handwriting', labelKey: 'fontCategories.handwriting' },
];

const fontSelectGroups = computed(() => [
  {
    label: t('controls.systemStacks'),
    options: systemStackVariants.map((s) => ({ value: `${FONT_SOURCE_SYSTEM}|${s.value}`, label: s.label })),
  },
  {
    label: t('controls.presetFonts'),
    options: namedSystemFamilies.map((f) => ({ value: `${FONT_SOURCE_SYSTEM}|${f.value}`, label: f.label })),
  },
  ...googleFontCategories.map(({ category, labelKey }) => ({
    label: t(labelKey),
    options: googleFontsCatalog
      .filter((font) => font.category === category)
      .map((font) => ({ value: `${FONT_SOURCE_GOOGLE}|${font.family}`, label: font.family })),
  })),
]);
const knownFontSelectValues = computed(
  () => new Set(['plain|', ...fontSelectGroups.value.flatMap((group) => group.options.map((opt) => opt.value))])
);

const typographyControls = [
  {
    key: 'noteTextSize',
    labelKey: 'controls.noteTextSize',
    min: 14,
    max: 24,
    step: 1,
    unit: 'px',
  },
  {
    key: 'titleScale',
    labelKey: 'controls.titleScale',
    min: 1.2,
    max: 2,
    step: 0.05,
  },
  {
    key: 'noteTextLineHeight',
    labelKey: 'controls.lineHeight',
    min: 1.3,
    max: 1.9,
    step: 0.05,
  },
];

const layoutControls = [
  {
    key: 'maxWidth',
    labelKey: 'controls.contentWidth',
    min: 36,
    max: 64,
    step: 1,
    unit: 'rem',
  },
  {
    key: 'margins',
    labelKey: 'controls.sideMargins',
    min: 1,
    max: 4,
    step: 0.25,
    unit: 'rem',
  },
];

function getFontSelectValue(control) {
  const source = props.typography[control.sourceKey];
  return `${source}|${source === FONT_SOURCE_PLAIN ? '' : props.typography[control.familyKey]}`;
}

function isKnownFontSelectValue(value) {
  return knownFontSelectValues.value.has(value);
}

function updateFont(control, event) {
  const idx = event.target.value.indexOf('|');
  const source = idx === -1 ? event.target.value : event.target.value.slice(0, idx);
  const family = idx === -1 ? '' : event.target.value.slice(idx + 1);
  emit('update:typography-field', control.sourceKey, source);
  emit('update:typography-field', control.familyKey, family);
}

function getControlValue(control, value) {
  return control.unit ? Number.parseFloat(value) : value;
}

function getNumericValue(control, value) {
  return control.unit ? `${value}${control.unit}` : Number(value);
}

function updateMetadataField(control, event) {
  emit('update:meta-field', control.key, event.target.value);
}
</script>

<template>
  <div class="theme-controls">
    <div class="control-group">
      <h3>{{ t('controls.metadata') }}</h3>
      <div v-for="control in metadataControls" :key="control.key" class="metadata-control">
        <div class="control-row">
          <label class="control-label" :for="`metadata-${control.key}`">{{ t(control.labelKey) }}</label>
          <input
            :id="`metadata-${control.key}`"
            class="text-control"
            type="text"
            :value="meta[control.key]"
            :aria-describedby="metadataErrors[control.key] ? `metadata-${control.key}-error` : undefined"
            :aria-invalid="metadataErrors[control.key] ? 'true' : undefined"
            @input="updateMetadataField(control, $event)"
          />
          <label class="field-lock">
            <input
              class="field-lock-input"
              type="checkbox"
              :checked="fieldLocks.meta[control.key]"
              :aria-label="t('aria.lockForRandom', { label: t(control.labelKey) })"
              @change="emit('toggle-field-lock', 'meta', control.key, $event.target.checked)"
            />
          </label>
        </div>
        <p v-if="metadataErrors[control.key]" :id="`metadata-${control.key}-error`" class="control-error">
          {{ metadataErrors[control.key] }}
        </p>
      </div>
    </div>

    <div class="control-group">
      <h3>{{ t('controls.fonts') }}</h3>
      <div v-for="control in fontControls" :key="control.familyKey" class="font-control">
        <div class="control-row">
          <label class="control-label" :for="`font-select-${control.familyKey}`">{{ t(control.labelKey) }}</label>
          <select
            :id="`font-select-${control.familyKey}`"
            class="select-control"
            :value="getFontSelectValue(control)"
            @change="updateFont(control, $event)"
          >
            <option value="plain|">{{ t('controls.plainFont') }}</option>
            <optgroup
              v-if="!isKnownFontSelectValue(getFontSelectValue(control))"
              :label="t('controls.customFontGroup')"
            >
              <option :value="getFontSelectValue(control)">
                {{ typography[control.familyKey] }}
              </option>
            </optgroup>
            <optgroup v-for="group in fontSelectGroups" :key="group.label" :label="group.label">
              <option v-for="opt in group.options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </optgroup>
          </select>
          <label class="field-lock">
            <input
              class="field-lock-input"
              type="checkbox"
              :checked="fieldLocks.typography[control.familyKey]"
              :aria-label="t('aria.lockForRandom', { label: t(control.labelKey) })"
              @change="emit('toggle-field-lock', 'typography', control.familyKey, $event.target.checked)"
            />
          </label>
        </div>
      </div>
    </div>

    <div class="control-group">
      <h3>{{ t('controls.typography') }}</h3>
      <div v-for="control in typographyControls" :key="control.key" class="typography-control">
        <div class="control-row">
          <label class="control-label" :for="`typography-${control.key}`">{{ t(control.labelKey) }}</label>
          <input
            :id="`typography-${control.key}`"
            class="range-control"
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :value="getControlValue(control, typography[control.key])"
            @input="emit('update:typography-field', control.key, getNumericValue(control, $event.target.value))"
          />
          <span class="control-row-actions">
            <output class="control-value" :for="`typography-${control.key}`">{{ typography[control.key] }}</output>
            <label class="field-lock">
              <input
                class="field-lock-input"
                type="checkbox"
                :checked="fieldLocks.typography[control.key]"
                :aria-label="t('aria.lockForRandom', { label: t(control.labelKey) })"
                @change="emit('toggle-field-lock', 'typography', control.key, $event.target.checked)"
              />
            </label>
          </span>
        </div>
      </div>
    </div>

    <div class="control-group">
      <h3>{{ t('controls.layout') }}</h3>
      <div v-for="control in layoutControls" :key="control.key" class="layout-control">
        <div class="control-row">
          <label class="control-label" :for="`layout-${control.key}`">{{ t(control.labelKey) }}</label>
          <input
            :id="`layout-${control.key}`"
            class="range-control"
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :value="getControlValue(control, layout[control.key])"
            @input="emit('update:layout-field', control.key, getNumericValue(control, $event.target.value))"
          />
          <span class="control-row-actions">
            <output class="control-value" :for="`layout-${control.key}`">{{ layout[control.key] }}</output>
            <label class="field-lock">
              <input
                class="field-lock-input"
                type="checkbox"
                :checked="fieldLocks.layout[control.key]"
                :aria-label="t('aria.lockForRandom', { label: t(control.labelKey) })"
                @change="emit('toggle-field-lock', 'layout', control.key, $event.target.checked)"
              />
            </label>
          </span>
        </div>
      </div>
    </div>

    <div class="control-group">
      <h3>{{ t('controls.colors') }}</h3>
      <div v-for="control in PALETTE_COLOR_CONTROLS" :key="control.key" class="palette-control">
        <div class="control-row">
          <label class="control-label" :for="`palette-${control.key}`">{{ t(`controls.${control.key}`) }}</label>
          <input
            :id="`palette-${control.key}`"
            class="color-control"
            type="color"
            :value="palette[control.key]"
            :aria-describedby="
              contrastWarningsByField[control.key]?.length ? `palette-${control.key}-warnings` : undefined
            "
            @input="emit('update:palette-field', control.key, $event.target.value)"
          />
          <label class="field-lock">
            <input
              class="field-lock-input"
              type="checkbox"
              :checked="fieldLocks.palette[control.key]"
              :aria-label="t('aria.lockForRandom', { label: t(`controls.${control.key}`) })"
              @change="emit('toggle-field-lock', 'palette', control.key, $event.target.checked)"
            />
          </label>
        </div>
        <div
          v-if="contrastWarningsByField[control.key]?.length"
          :id="`palette-${control.key}-warnings`"
          class="control-warnings"
        >
          <p
            v-for="message in contrastWarningsByField[control.key]"
            :key="`${control.key}-${message}`"
            class="control-warning"
          >
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
