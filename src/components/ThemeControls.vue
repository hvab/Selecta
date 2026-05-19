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
});

const emit = defineEmits(['update:palette-field', 'update:typography-field']);

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
  </div>
</template>
