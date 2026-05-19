<script setup>
defineProps({
  palette: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:palette-field']);

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
];
</script>

<template>
  <div class="theme-controls">
    <label v-for="control in colorControls" :key="control.key">
      <span>{{ control.label }}</span>
      <input
        type="color"
        :value="palette[control.key]"
        @input="emit('update:palette-field', control.key, $event.target.value)"
      />
    </label>
  </div>
</template>
