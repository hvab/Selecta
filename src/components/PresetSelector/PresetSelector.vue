<script setup>
import { ref } from 'vue';
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

const emit = defineEmits(['apply-preset', 'import-files', 'drop-theme']);
const isDraggingFiles = ref(false);

function isFileDrag(event) {
  return [...(event.dataTransfer?.types ?? [])].includes('Files');
}

function handleDragEnter(event) {
  if (isFileDrag(event)) {
    event.preventDefault();
    isDraggingFiles.value = true;
  }
}

function handleDragOver(event) {
  if (isFileDrag(event)) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    isDraggingFiles.value = true;
  }
}

function handleDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDraggingFiles.value = false;
  }
}

function handleDrop(event) {
  if (isFileDrag(event)) {
    event.preventDefault();
    isDraggingFiles.value = false;
    emit('drop-theme', event.dataTransfer);
  }
}

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
      <Field :message="importError" message-id="theme-import-error" message-view="error">
        <Button
          class="preset-controls__import-button"
          :class="{ 'preset-controls__import-button_drag-over': isDraggingFiles }"
          view="outlined"
          :title="t('status.themeImportHint')"
          :aria-describedby="importError ? 'theme-import-error' : undefined"
          @click="emit('import-files')"
          @dragenter="handleDragEnter"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          {{ t('actions.importTheme') }}
        </Button>
      </Field>
    </ControlGroup>
  </div>
</template>

<style scoped>
.preset-controls__import-button {
  width: 100%;
}

.preset-controls__import-button_drag-over {
  outline: var(--hb-focus-ring-width) solid var(--hb-color-line-focus);
  outline-offset: var(--hb-focus-ring-offset);
}
</style>
