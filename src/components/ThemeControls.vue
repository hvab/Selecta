<script setup>
import { computed, reactive } from 'vue';
import { PALETTE_COLOR_CONTROLS } from '../theme/fieldLocks.js';
import {
  FONT_SOURCE_GOOGLE,
  FONT_SOURCE_PLAIN,
  FONT_SOURCE_SYSTEM,
  SERIF_FONT_STACK,
  UI_FONT_STACK,
  systemFonts,
} from '../theme/fonts.js';
import { filterGoogleFonts, findGoogleFont, getGoogleFontFamilyCssValue } from '../theme/googleFonts.js';
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
    placeholder: UI_FONT_STACK,
    defaultSystemFontValue: UI_FONT_STACK,
  },
  {
    familyKey: 'noteFontFamily',
    sourceKey: 'noteFontSource',
    label: 'Note text font',
    placeholder: SERIF_FONT_STACK,
    defaultSystemFontValue: SERIF_FONT_STACK,
  },
];

const fontSourceOptions = [
  { value: FONT_SOURCE_PLAIN, label: 'Plain default' },
  { value: FONT_SOURCE_SYSTEM, label: 'System stack' },
  { value: FONT_SOURCE_GOOGLE, label: 'Google Font' },
];

const googleFontCategories = [...new Set(googleFontsCatalog.map(({ category }) => category))].sort();
const googleFontFilters = reactive(
  Object.fromEntries(
    fontControls.map(({ familyKey }) => [
      familyKey,
      {
        cyrillicOnly: true,
        query: '',
        category: '',
      },
    ])
  )
);
const googleFontOptionsByControl = computed(() =>
  Object.fromEntries(
    fontControls.map(({ familyKey }) => [
      familyKey,
      filterGoogleFonts(googleFontsCatalog, googleFontFilters[familyKey]),
    ])
  )
);

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

function getControlValue(control, value) {
  return control.unit ? Number.parseFloat(value) : value;
}

function getNumericValue(control, value) {
  return control.unit ? `${value}${control.unit}` : Number(value);
}

function updateMetadataField(control, event) {
  emit('update:meta-field', control.key, event.target.value);
}

function getGoogleFontOptions(control) {
  return googleFontOptionsByControl.value[control.familyKey];
}

function updateFontSource(control, event) {
  const source = event.target.value;

  emit('update:typography-field', control.sourceKey, source);

  if (source === FONT_SOURCE_PLAIN) {
    emit('update:typography-field', control.familyKey, '');
  } else if (
    source === FONT_SOURCE_SYSTEM &&
    (!props.typography[control.familyKey] || findGoogleFont(googleFontsCatalog, props.typography[control.familyKey]))
  ) {
    emit('update:typography-field', control.familyKey, control.defaultSystemFontValue);
  } else if (
    source === FONT_SOURCE_GOOGLE &&
    !findGoogleFont(googleFontsCatalog, props.typography[control.familyKey])
  ) {
    emit('update:typography-field', control.familyKey, getGoogleFontOptions(control)[0]?.family ?? '');
  }
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
          <label class="control-label" :for="`font-source-${control.familyKey}`">{{ control.label }}</label>
          <select
            :id="`font-source-${control.familyKey}`"
            class="select-control"
            :value="typography[control.sourceKey]"
            @change="updateFontSource(control, $event)"
          >
            <option v-for="source in fontSourceOptions" :key="source.value" :value="source.value">
              {{ source.label }}
            </option>
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
        <div v-if="typography[control.sourceKey] === FONT_SOURCE_SYSTEM" class="control-row font-family-row">
          <label class="control-label" :for="`font-family-${control.familyKey}`">Stack</label>
          <input
            :id="`font-family-${control.familyKey}`"
            class="text-control"
            type="text"
            list="system-font-suggestions"
            :placeholder="control.placeholder"
            :value="typography[control.familyKey]"
            @input="emit('update:typography-field', control.familyKey, $event.target.value)"
          />
        </div>
        <div v-else-if="typography[control.sourceKey] === FONT_SOURCE_GOOGLE" class="font-picker">
          <div class="font-picker-filters">
            <label class="font-filter-control">
              <span class="font-filter-label">Search</span>
              <input
                class="text-control"
                type="search"
                :value="googleFontFilters[control.familyKey].query"
                @input="googleFontFilters[control.familyKey].query = $event.target.value"
              />
            </label>
            <label class="font-filter-control">
              <span class="font-filter-label">Category</span>
              <select
                class="select-control"
                :value="googleFontFilters[control.familyKey].category"
                @change="googleFontFilters[control.familyKey].category = $event.target.value"
              >
                <option value="">All categories</option>
                <option v-for="category in googleFontCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </label>
            <label class="font-filter-checkbox">
              <input
                type="checkbox"
                :checked="googleFontFilters[control.familyKey].cyrillicOnly"
                @change="googleFontFilters[control.familyKey].cyrillicOnly = $event.target.checked"
              />
              <span>Cyrillic only</span>
            </label>
          </div>
          <div class="control-row font-family-row">
            <label class="control-label" :for="`google-font-family-${control.familyKey}`">Family</label>
            <select
              :id="`google-font-family-${control.familyKey}`"
              class="select-control font-family-select"
              :value="typography[control.familyKey]"
              @change="emit('update:typography-field', control.familyKey, $event.target.value)"
            >
              <option
                v-for="font in getGoogleFontOptions(control)"
                :key="font.family"
                :style="{ fontFamily: getGoogleFontFamilyCssValue(font) }"
                :value="font.family"
              >
                {{ font.family }} · Aa Яя · {{ font.category }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <datalist id="system-font-suggestions">
        <option v-for="font in systemFonts" :key="font.value" :value="font.value" :label="font.label"></option>
      </datalist>
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
