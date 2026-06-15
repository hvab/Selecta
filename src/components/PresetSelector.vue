<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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

function getPresetLabel(preset) {
  return t(`presetLabels.${preset.id}`);
}
</script>

<template>
  <div class="theme-controls preset-controls">
    <div class="control-group">
      <h3>{{ t('controls.presets') }}</h3>
      <div class="control-row">
        <label class="control-label" for="preset-selector">{{ t('controls.preset') }}</label>
        <select
          id="preset-selector"
          class="select-control"
          :value="selectedPresetId"
          @change="emit('apply-preset', $event.target.value)"
        >
          <option value="">{{ t('controls.custom') }}</option>
          <option v-for="preset in presets" :key="preset.id" :value="preset.id">
            {{ getPresetLabel(preset) }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
