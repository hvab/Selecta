<script setup>
import { systemFonts } from '../theme/fonts.js';
import { normalizeFolderName } from '../theme/metadata.js';

defineProps({
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

const colorControls = [
  {
    key: 'background',
    label: 'Background',
  },
  {
    key: 'foreground',
    label: 'Text',
  },
  {
    key: 'headings',
    label: 'Headings',
  },
  {
    key: 'link',
    label: 'Links',
  },
  {
    key: 'linkVisited',
    label: 'Visited links',
  },
  {
    key: 'hover',
    label: 'Hover',
  },
  {
    key: 'tag',
    label: 'Tags',
  },
  {
    key: 'engineText',
    label: 'Secondary text',
  },
  {
    key: 'active',
    label: 'Active navigation',
  },
  {
    key: 'markedTextBackground',
    label: 'Marked text',
  },
  {
    key: 'inputBackground',
    label: 'Input background',
  },
  {
    key: 'inputText',
    label: 'Input text',
  },
];

const fontControls = [
  {
    key: 'mainFontFamily',
    label: 'Interface font',
    placeholder: 'Aptos, Arial, sans-serif',
  },
  {
    key: 'noteFontFamily',
    label: 'Note text font',
    placeholder: 'Georgia, "Times New Roman", serif',
  },
];

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
  const value = control.key === 'folderName' ? normalizeFolderName(event.target.value) : event.target.value;

  event.target.value = value;
  emit('update:meta-field', control.key, value);
}
</script>

<template>
  <div class="theme-controls">
    <div class="control-group">
      <h3>Metadata</h3>
      <div v-for="control in metadataControls" :key="control.key" class="metadata-control">
        <label class="control-row" :for="`metadata-${control.key}`">
          <span class="control-label">{{ control.label }}</span>
          <input
            :id="`metadata-${control.key}`"
            class="text-control"
            type="text"
            :value="meta[control.key]"
            :aria-describedby="metadataErrors[control.key] ? `metadata-${control.key}-error` : undefined"
            :aria-invalid="metadataErrors[control.key] ? 'true' : undefined"
            @input="updateMetadataField(control, $event)"
          />
        </label>
        <p v-if="metadataErrors[control.key]" :id="`metadata-${control.key}-error`" class="control-error">
          {{ metadataErrors[control.key] }}
        </p>
      </div>
    </div>

    <div class="control-group">
      <h3>Fonts</h3>
      <label v-for="control in fontControls" :key="control.key" class="control-row">
        <span class="control-label">{{ control.label }}</span>
        <input
          class="text-control"
          type="text"
          list="system-font-suggestions"
          :placeholder="control.placeholder"
          :value="typography[control.key]"
          @input="emit('update:typography-field', control.key, $event.target.value)"
        />
      </label>
      <datalist id="system-font-suggestions">
        <option v-for="font in systemFonts" :key="font.value" :value="font.value" :label="font.label"></option>
      </datalist>
    </div>

    <div class="control-group">
      <h3>Typography</h3>
      <label v-for="control in typographyControls" :key="control.key" class="control-row">
        <span class="control-label">{{ control.label }}</span>
        <input
          class="range-control"
          type="range"
          :min="control.min"
          :max="control.max"
          :step="control.step"
          :value="getControlValue(control, typography[control.key])"
          @input="emit('update:typography-field', control.key, getNumericValue(control, $event.target.value))"
        />
        <output class="control-value">{{ typography[control.key] }}</output>
      </label>
    </div>

    <div class="control-group">
      <h3>Layout</h3>
      <label v-for="control in layoutControls" :key="control.key" class="control-row">
        <span class="control-label">{{ control.label }}</span>
        <input
          class="range-control"
          type="range"
          :min="control.min"
          :max="control.max"
          :step="control.step"
          :value="getControlValue(control, layout[control.key])"
          @input="emit('update:layout-field', control.key, getNumericValue(control, $event.target.value))"
        />
        <output class="control-value">{{ layout[control.key] }}</output>
      </label>
    </div>

    <div class="control-group">
      <h3>Colors</h3>
      <div v-for="control in colorControls" :key="control.key" class="palette-control">
        <label class="control-row" :for="`palette-${control.key}`">
          <span class="control-label">{{ control.label }}</span>
          <input
            :id="`palette-${control.key}`"
            class="color-control"
            type="color"
            :value="palette[control.key]"
            :aria-describedby="contrastWarningsByField[control.key] ? `palette-${control.key}-warning` : undefined"
            @input="emit('update:palette-field', control.key, $event.target.value)"
          />
        </label>
        <p
          v-for="(message, index) in contrastWarningsByField[control.key] || []"
          :id="index === 0 ? `palette-${control.key}-warning` : undefined"
          :key="`${control.key}-${message}`"
          class="control-warning"
        >
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>
