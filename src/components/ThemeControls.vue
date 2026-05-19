<script setup>
defineProps({
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

const emit = defineEmits(['update:palette-field', 'update:typography-field', 'update:layout-field']);

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
  },
  {
    key: 'noteFontFamily',
    label: 'Note text font',
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

const systemFonts = [
  {
    value: 'Arial, Helvetica, sans-serif',
    label: 'Arial',
  },
  {
    value: 'Georgia, "Times New Roman", serif',
    label: 'Georgia',
  },
  {
    value: 'Verdana, Geneva, sans-serif',
    label: 'Verdana',
  },
  {
    value: '"Trebuchet MS", Helvetica, sans-serif',
    label: 'Trebuchet MS',
  },
  {
    value: '"Times New Roman", Times, serif',
    label: 'Times New Roman',
  },
  {
    value: '"Courier New", Courier, monospace',
    label: 'Courier New',
  },
];

function getControlValue(control, value) {
  return control.unit ? Number.parseFloat(value) : value;
}

function getNumericValue(control, value) {
  return control.unit ? `${value}${control.unit}` : Number(value);
}
</script>

<template>
  <div class="theme-controls">
    <div>
      <h3>Colors</h3>
      <label v-for="control in colorControls" :key="control.key">
        <span>{{ control.label }}</span>
        <input
          type="color"
          :value="palette[control.key]"
          @input="emit('update:palette-field', control.key, $event.target.value)"
        />
      </label>
    </div>

    <div>
      <h3>Fonts</h3>
      <label v-for="control in fontControls" :key="control.key">
        <span>{{ control.label }}</span>
        <select
          :value="typography[control.key]"
          @change="emit('update:typography-field', control.key, $event.target.value)"
        >
          <option v-for="font in systemFonts" :key="font.value" :value="font.value">
            {{ font.label }}
          </option>
        </select>
      </label>
    </div>

    <div>
      <h3>Typography</h3>
      <label v-for="control in typographyControls" :key="control.key">
        <span>{{ control.label }}</span>
        <input
          type="range"
          :min="control.min"
          :max="control.max"
          :step="control.step"
          :value="getControlValue(control, typography[control.key])"
          @input="emit('update:typography-field', control.key, getNumericValue(control, $event.target.value))"
        />
        <output>{{ typography[control.key] }}{{ control.unit && control.unit !== 'px' ? control.unit : '' }}</output>
      </label>
    </div>

    <div>
      <h3>Layout</h3>
      <label v-for="control in layoutControls" :key="control.key">
        <span>{{ control.label }}</span>
        <input
          type="range"
          :min="control.min"
          :max="control.max"
          :step="control.step"
          :value="getControlValue(control, layout[control.key])"
          @input="emit('update:layout-field', control.key, getNumericValue(control, $event.target.value))"
        />
        <output>{{ layout[control.key] }}</output>
      </label>
    </div>
  </div>
</template>
