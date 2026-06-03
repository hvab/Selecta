<script setup>
defineProps({
  presets: {
    type: Array,
    required: true,
  },
  selectedPresetId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['apply-preset']);
</script>

<template>
  <div class="theme-controls preset-controls">
    <div class="control-group">
      <h3>Presets</h3>
      <div class="control-row">
        <label class="control-label" for="preset-selector">Preset</label>
        <select
          id="preset-selector"
          class="select-control"
          :value="selectedPresetId"
          @change="emit('apply-preset', $event.target.value)"
        >
          <option value="">Custom</option>
          <option v-for="preset in presets" :key="preset.id" :value="preset.id">
            {{ preset.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
