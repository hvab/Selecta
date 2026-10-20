<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ControlGroup from '../../ui/ControlGroup/ControlGroup.vue';
import Button from '../../ui/Button/Button.vue';
import Field from '../../ui/Field/Field.vue';
import RadioCard from '../../ui/RadioCard/RadioCard.vue';

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
      <template v-if="!selectedPresetId" #actions>
        <span class="hb-text hb-text_typography_caption-2 hb-text_color_secondary">{{ t('controls.custom') }}</span>
      </template>
      <div class="preset-controls__grid" role="radiogroup" :aria-label="t('controls.presets')">
        <RadioCard
          v-for="preset in presets"
          :key="preset.id"
          name="theme-preset"
          :value="preset.id"
          :checked="selectedPresetId === preset.id"
          @select="emit('apply-preset', $event)"
        >
          <span class="preset-controls__swatch" aria-hidden="true">
            <span
              v-for="key in ['background', 'foreground', 'headings', 'link', 'hover']"
              :key="key"
              :style="{ backgroundColor: preset.palette[key] }"
            ></span>
          </span>
          <span class="preset-controls__name hb-text hb-text_typography_caption-2">{{ getPresetLabel(preset) }}</span>
        </RadioCard>
      </div>
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
.preset-controls__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  gap: var(--hb-gap-1);
}

.preset-controls__swatch {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  height: var(--hb-size-control-height-m);
  overflow: hidden;
  border-radius: var(--hb-radius-m);
}

.preset-controls__name {
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
}

.preset-controls__import-button {
  width: 100%;
}

.preset-controls__import-button_drag-over {
  outline: var(--hb-focus-ring-width) solid var(--hb-color-line-focus);
  outline-offset: var(--hb-focus-ring-offset);
}
</style>
