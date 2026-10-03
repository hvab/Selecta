<script setup>
import Field from '../../ui/Field/Field.vue';
import RangeInput from '../../ui/RangeInput/RangeInput.vue';
import FieldLock from '../FieldLock/FieldLock.vue';

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  displayValue: {
    type: [Number, String],
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue', 'update:locked']);

// Narrow no-break space: keeps the unit from wrapping onto its own line while reading
// noticeably tighter than a regular space.
const UNIT_SEPARATOR = '\u202f';
</script>

<template>
  <Field layout="inline" :label="label" :label-for="id">
    <RangeInput
      :id="id"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <template #addons>
      <output class="range-control-field__value" :for="id"
        >{{ displayValue
        }}<span v-if="unit" class="hb-text hb-text_color_secondary">{{ UNIT_SEPARATOR }}{{ unit }}</span></output
      >
      <FieldLock :locked="locked" :label="label" @update:locked="$emit('update:locked', $event)" />
    </template>
  </Field>
</template>

<style scoped>
.range-control-field__value {
  min-width: 3.5rem;
  font-size: var(--hb-typography-body-short-size);
  line-height: var(--hb-typography-body-short-line);
  text-align: right;
}

@media (max-width: 40rem) {
  .range-control-field__value {
    text-align: left;
  }
}
</style>
