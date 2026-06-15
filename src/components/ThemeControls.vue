<script setup>
import { PALETTE_COLOR_CONTROLS } from '../theme/fieldLocks.js';
import {
  FONT_SOURCE_GOOGLE,
  FONT_SOURCE_PLAIN,
  FONT_SOURCE_SYSTEM,
  namedSystemFamilies,
  systemStackVariants,
} from '../theme/fonts.js';
import { googleFontsCatalog } from '../theme/googleFontsCatalog.js';

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
    label: 'Display name',
  },
  {
    key: 'folderName',
    label: 'Folder name',
  },
];

const fontControls = [
  {
    familyKey: 'mainFontFamily',
    sourceKey: 'mainFontSource',
    label: 'Interface font',
  },
  {
    familyKey: 'noteFontFamily',
    sourceKey: 'noteFontSource',
    label: 'Note text font',
  },
];

const googleFontCategories = ['Sans Serif', 'Serif', 'Monospace', 'Display', 'Handwriting'];

const fontSelectGroups = [
  {
    label: 'System stacks',
    options: systemStackVariants.map((s) => ({ value: `${FONT_SOURCE_SYSTEM}|${s.value}`, label: s.label })),
  },
  {
    label: 'Preset fonts',
    options: namedSystemFamilies.map((f) => ({ value: `${FONT_SOURCE_SYSTEM}|${f.value}`, label: f.label })),
  },
  ...googleFontCategories.map((category) => ({
    label: category,
    options: googleFontsCatalog
      .filter((font) => font.category === category)
      .map((font) => ({ value: `${FONT_SOURCE_GOOGLE}|${font.family}`, label: font.family })),
  })),
];
const knownFontSelectValues = new Set([
  'plain|',
  ...fontSelectGroups.flatMap((group) => group.options.map((opt) => opt.value)),
]);

const typographyControls = [
  {
    key: 'noteTextSize',
    label: 'Note text size',
    min: 14,
    max: 24,
    step: 1,
    unit: 'px',
  },
  {
    key: 'titleScale',
    label: 'Title scale',
    min: 1.2,
    max: 2,
    step: 0.05,
  },
  {
    key: 'noteTextLineHeight',
    label: 'Line height',
    min: 1.3,
    max: 1.9,
    step: 0.05,
  },
];

const layoutControls = [
  {
    key: 'maxWidth',
    label: 'Content width',
    min: 36,
    max: 64,
    step: 1,
    unit: 'rem',
  },
  {
    key: 'margins',
    label: 'Side margins',
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
  return knownFontSelectValues.has(value);
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
      <h3>Metadata</h3>
      <div v-for="control in metadataControls" :key="control.key" class="metadata-control">
        <div class="control-row">
          <label class="control-label" :for="`metadata-${control.key}`">{{ control.label }}</label>
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
              :aria-label="`Lock ${control.label} for random`"
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
      <h3>Fonts</h3>
      <div v-for="control in fontControls" :key="control.familyKey" class="font-control">
        <div class="control-row">
          <label class="control-label" :for="`font-select-${control.familyKey}`">{{ control.label }}</label>
          <select
            :id="`font-select-${control.familyKey}`"
            class="select-control"
            :value="getFontSelectValue(control)"
            @change="updateFont(control, $event)"
          >
            <option value="plain|">Plain (Aegea default)</option>
            <optgroup v-if="!isKnownFontSelectValue(getFontSelectValue(control))" label="Custom">
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
              :aria-label="`Lock ${control.label} for random`"
              @change="emit('toggle-field-lock', 'typography', control.familyKey, $event.target.checked)"
            />
          </label>
        </div>
      </div>
    </div>

    <div class="control-group">
      <h3>Typography</h3>
      <div v-for="control in typographyControls" :key="control.key" class="typography-control">
        <div class="control-row">
          <label class="control-label" :for="`typography-${control.key}`">{{ control.label }}</label>
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
                :aria-label="`Lock ${control.label} for random`"
                @change="emit('toggle-field-lock', 'typography', control.key, $event.target.checked)"
              />
            </label>
          </span>
        </div>
      </div>
    </div>

    <div class="control-group">
      <h3>Layout</h3>
      <div v-for="control in layoutControls" :key="control.key" class="layout-control">
        <div class="control-row">
          <label class="control-label" :for="`layout-${control.key}`">{{ control.label }}</label>
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
                :aria-label="`Lock ${control.label} for random`"
                @change="emit('toggle-field-lock', 'layout', control.key, $event.target.checked)"
              />
            </label>
          </span>
        </div>
      </div>
    </div>

    <div class="control-group">
      <h3>Colors</h3>
      <div v-for="control in PALETTE_COLOR_CONTROLS" :key="control.key" class="palette-control">
        <div class="control-row">
          <label class="control-label" :for="`palette-${control.key}`">{{ control.label }}</label>
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
              :aria-label="`Lock ${control.label} for random`"
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
