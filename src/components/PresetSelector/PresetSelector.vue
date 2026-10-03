<script setup>
import { useI18n } from 'vue-i18n';
import ControlGroup from '../../ui/ControlGroup/ControlGroup.vue';
import Button from '../../ui/Button/Button.vue';
import Field from '../../ui/Field/Field.vue';
import Select from '../../ui/Select/Select.vue';

const { t } = useI18n();

defineProps({
  importError: {
    type: String,
    default: '',
  },
  presets: {
    type: Array,
    required: true,
  },
  selectedPresetId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['apply-preset', 'import-theme']);

function getPresetLabel(preset) {
  return t(`presetLabels.${preset.id}`);
}
</script>

<template>
  <div class="preset-controls">
    <ControlGroup :title="t('controls.presets')">
      <Field layout="inline" :label="t('controls.preset')" label-for="preset-selector">
        <Select id="preset-selector" :value="selectedPresetId" @change="emit('apply-preset', $event.target.value)">
          <option value="">{{ t('controls.custom') }}</option>
          <option v-for="preset in presets" :key="preset.id" :value="preset.id">
            {{ getPresetLabel(preset) }}
          </option>
        </Select>
      </Field>
      <Field
        :message="importError"
        message-id="theme-json-import-error"
        message-view="error"
      >
        <Button
          class="preset-controls__import-button"
          view="outlined"
          :aria-describedby="importError ? 'theme-json-import-error' : undefined"
          @click="emit('import-theme')"
        >
          {{ t('actions.importJson') }}
        </Button>
      </Field>
    </ControlGroup>
  </div>
</template>

<style scoped>
.preset-controls__import-button {
  width: 100%;
}
</style>
