<script setup>
import { useI18n } from 'vue-i18n';
import Field from '../ui/Field/Field.vue';
import Select from '../ui/Select/Select.vue';

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
      <Field layout="inline" :label="t('controls.preset')" label-for="preset-selector">
        <Select id="preset-selector" :value="selectedPresetId" @change="emit('apply-preset', $event.target.value)">
          <option value="">{{ t('controls.custom') }}</option>
          <option v-for="preset in presets" :key="preset.id" :value="preset.id">
            {{ getPresetLabel(preset) }}
          </option>
        </Select>
      </Field>
    </div>
  </div>
</template>
