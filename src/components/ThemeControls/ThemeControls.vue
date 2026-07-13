<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PALETTE_COLOR_CONTROLS } from '../../theme/fieldLocks.js';
import {
  FONT_SOURCE_GOOGLE,
  FONT_SOURCE_PLAIN,
  FONT_SOURCE_SYSTEM,
  namedSystemFamilies,
  systemStackVariants,
} from '../../theme/fonts.js';
import { googleFontsCatalog } from '../../theme/googleFontsCatalog.js';
import ColorInput from '../../ui/ColorInput/ColorInput.vue';
import ControlGroup from '../../ui/ControlGroup/ControlGroup.vue';
import Field from '../../ui/Field/Field.vue';
import Select from '../../ui/Select/Select.vue';
import Switch from '../../ui/Switch/Switch.vue';
import TextInput from '../../ui/TextInput/TextInput.vue';
import FieldLock from '../FieldLock/FieldLock.vue';
import RangeControlField from '../RangeControlField/RangeControlField.vue';

const { t, locale } = useI18n();
const props = defineProps({
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
  fieldLocks: {
    type: Object,
    required: true,
  },
  palette: {
    type: Object,
    required: true,
  },
  paletteLocks: {
    type: Object,
    required: true,
  },
  paletteSection: {
    type: String,
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
  'toggle-field-lock',
]);

const metadataControls = [
  {
    key: 'displayName',
    labelKey: 'controls.displayName',
  },
  {
    key: 'folderName',
    labelKey: 'controls.folderName',
  },
];

const fontControls = [
  {
    familyKey: 'mainFontFamily',
    sourceKey: 'mainFontSource',
    labelKey: 'controls.interfaceFont',
  },
  {
    familyKey: 'noteFontFamily',
    sourceKey: 'noteFontSource',
    labelKey: 'controls.noteTextFont',
  },
];

const googleFontCategories = [
  { category: 'Sans Serif', labelKey: 'fontCategories.sansSerif' },
  { category: 'Serif', labelKey: 'fontCategories.serif' },
  { category: 'Monospace', labelKey: 'fontCategories.monospace' },
  { category: 'Display', labelKey: 'fontCategories.display' },
  { category: 'Handwriting', labelKey: 'fontCategories.handwriting' },
];

const fontSelectGroups = computed(() => [
  {
    label: t('controls.systemStacks'),
    options: systemStackVariants.map((s) => ({ value: `${FONT_SOURCE_SYSTEM}|${s.value}`, label: s.label })),
  },
  {
    label: t('controls.presetFonts'),
    options: namedSystemFamilies.map((f) => ({ value: `${FONT_SOURCE_SYSTEM}|${f.value}`, label: f.label })),
  },
  ...googleFontCategories.map(({ category, labelKey }) => ({
    label: t(labelKey),
    options: googleFontsCatalog
      .filter((font) => font.category === category)
      .map((font) => ({ value: `${FONT_SOURCE_GOOGLE}|${font.family}`, label: font.family })),
  })),
]);
const knownFontSelectValues = computed(
  () => new Set(['plain|', ...fontSelectGroups.value.flatMap((group) => group.options.map((opt) => opt.value))])
);

const typographyControls = [
  {
    key: 'noteTextSize',
    labelKey: 'controls.noteTextSize',
    min: 14,
    max: 24,
    step: 1,
    unit: 'px',
  },
  {
    key: 'titleScale',
    labelKey: 'controls.titleScale',
    min: 1.2,
    max: 2,
    step: 0.05,
  },
  {
    key: 'noteTextLineHeight',
    labelKey: 'controls.lineHeight',
    min: 1.3,
    max: 1.9,
    step: 0.05,
  },
];

const layoutControls = [
  {
    key: 'maxWidth',
    labelKey: 'controls.contentWidth',
    min: 36,
    max: 64,
    step: 1,
    unit: 'rem',
  },
  {
    key: 'margins',
    labelKey: 'controls.sideMargins',
    min: 1,
    max: 4,
    step: 0.25,
    unit: 'rem',
  },
];

function getFontSelectValue(control) {
  const source = props.typography[control.sourceKey];
  return `${source}|${source === FONT_SOURCE_PLAIN ? '' : props.typography[control.familyKey]}`;
}

function isKnownFontSelectValue(value) {
  return knownFontSelectValues.value.has(value);
}

function updateFont(control, event) {
  const idx = event.target.value.indexOf('|');
  const source = idx === -1 ? event.target.value : event.target.value.slice(0, idx);
  const family = idx === -1 ? '' : event.target.value.slice(idx + 1);
  emit('update:typography-field', control.sourceKey, source);
  emit('update:typography-field', control.familyKey, family);
}

function getControlValue(control, value) {
  return control.unit ? Number.parseFloat(value) : value;
}

function getNumericValue(control, value) {
  return control.unit ? `${value}${control.unit}` : Number(value);
}

function formatDisplayValue(control, value) {
  const numberFormatter = new Intl.NumberFormat(locale.value);

  return numberFormatter.format(control.unit ? getControlValue(control, value) : value);
}

function updateMetadataField(control, event) {
  emit('update:meta-field', control.key, event.target.value);
}

function updateSupportsDarkMode(event) {
  emit('update:meta-field', 'supportsDarkMode', event.target.checked);
}
</script>

<template>
  <div class="theme-controls">
    <ControlGroup :title="t('controls.metadata')">
      <Field
        v-for="control in metadataControls"
        :key="control.key"
        layout="inline"
        :label="t(control.labelKey)"
        :label-for="`metadata-${control.key}`"
        :message="metadataErrors[control.key]"
        :message-id="metadataErrors[control.key] ? `metadata-${control.key}-error` : ''"
        message-view="error"
      >
        <TextInput
          :id="`metadata-${control.key}`"
          :value="meta[control.key]"
          :aria-describedby="metadataErrors[control.key] ? `metadata-${control.key}-error` : undefined"
          :aria-invalid="metadataErrors[control.key] ? 'true' : undefined"
          @input="updateMetadataField(control, $event)"
        />
        <template #addons>
          <FieldLock
            :locked="fieldLocks.meta[control.key]"
            :label="t(control.labelKey)"
            @update:locked="emit('toggle-field-lock', 'meta', control.key, $event)"
          />
        </template>
      </Field>
      <Field layout="inline" :label="t('controls.supportsDarkMode')" label-for="metadata-supportsDarkMode">
        <Switch id="metadata-supportsDarkMode" :checked="meta.supportsDarkMode" @change="updateSupportsDarkMode" />
      </Field>
    </ControlGroup>

    <ControlGroup :title="t('controls.fonts')">
      <Field
        v-for="control in fontControls"
        :key="control.familyKey"
        layout="inline"
        :label="t(control.labelKey)"
        :label-for="`font-select-${control.familyKey}`"
      >
        <Select
          :id="`font-select-${control.familyKey}`"
          :value="getFontSelectValue(control)"
          @change="updateFont(control, $event)"
        >
          <option value="plain|">{{ t('controls.plainFont') }}</option>
          <optgroup v-if="!isKnownFontSelectValue(getFontSelectValue(control))" :label="t('controls.customFontGroup')">
            <option :value="getFontSelectValue(control)">
              {{ typography[control.familyKey] }}
            </option>
          </optgroup>
          <optgroup v-for="group in fontSelectGroups" :key="group.label" :label="group.label">
            <option v-for="opt in group.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </optgroup>
        </Select>
        <template #addons>
          <FieldLock
            :locked="fieldLocks.typography[control.familyKey]"
            :label="t(control.labelKey)"
            @update:locked="emit('toggle-field-lock', 'typography', control.familyKey, $event)"
          />
        </template>
      </Field>
    </ControlGroup>

    <ControlGroup :title="t('controls.typography')">
      <RangeControlField
        v-for="control in typographyControls"
        :id="`typography-${control.key}`"
        :key="control.key"
        :label="t(control.labelKey)"
        :min="control.min"
        :max="control.max"
        :step="control.step"
        :model-value="getControlValue(control, typography[control.key])"
        :display-value="formatDisplayValue(control, typography[control.key])"
        :unit="control.unit"
        :locked="fieldLocks.typography[control.key]"
        @update:model-value="emit('update:typography-field', control.key, getNumericValue(control, $event))"
        @update:locked="emit('toggle-field-lock', 'typography', control.key, $event)"
      />
    </ControlGroup>

    <ControlGroup :title="t('controls.layout')">
      <RangeControlField
        v-for="control in layoutControls"
        :id="`layout-${control.key}`"
        :key="control.key"
        :label="t(control.labelKey)"
        :min="control.min"
        :max="control.max"
        :step="control.step"
        :model-value="getControlValue(control, layout[control.key])"
        :display-value="formatDisplayValue(control, layout[control.key])"
        :unit="control.unit"
        :locked="fieldLocks.layout[control.key]"
        @update:model-value="emit('update:layout-field', control.key, getNumericValue(control, $event))"
        @update:locked="emit('toggle-field-lock', 'layout', control.key, $event)"
      />
    </ControlGroup>

    <ControlGroup :title="t('controls.colors')">
      <Field
        v-for="control in PALETTE_COLOR_CONTROLS"
        :key="control.key"
        layout="inline"
        :label="t(`controls.${control.key}`)"
        :label-for="`palette-${control.key}`"
        :message-id="contrastWarningsByField[control.key]?.length ? `palette-${control.key}-warnings` : ''"
        message-view="warning"
      >
        <ColorInput
          :id="`palette-${control.key}`"
          class="theme-controls__palette-color-input"
          :value="palette[control.key]"
          :aria-describedby="
            contrastWarningsByField[control.key]?.length ? `palette-${control.key}-warnings` : undefined
          "
          @input="emit('update:palette-field', control.key, $event.target.value)"
        />
        <template #addons>
          <FieldLock
            :locked="paletteLocks[control.key]"
            :label="t(`controls.${control.key}`)"
            @update:locked="emit('toggle-field-lock', paletteSection, control.key, $event)"
          />
        </template>
        <template v-if="contrastWarningsByField[control.key]?.length" #message>
          <div v-for="message in contrastWarningsByField[control.key]" :key="`${control.key}-${message}`">
            {{ message }}
          </div>
        </template>
      </Field>
    </ControlGroup>
  </div>
</template>

<style scoped>
.theme-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--hb-gap-2);
}

.theme-controls__palette-color-input {
  --hb-color-input-control-width: 100%;
}
</style>
