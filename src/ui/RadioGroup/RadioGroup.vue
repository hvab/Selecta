<script setup>
defineProps({
  ariaLabel: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  size: {
    type: String,
    default: 'm',
  },
  showOptionLabels: {
    type: Boolean,
    default: true,
  },
  value: {
    type: String,
    required: true,
  },
});

defineEmits(['update:value']);
</script>

<template>
  <div :class="['hb-radio-group', `hb-radio-group_size_${size}`]" role="radiogroup" :aria-label="ariaLabel">
    <label v-for="option in options" :key="option.value" class="hb-radio-group__option">
      <input
        class="hb-radio-group__control"
        type="radio"
        :name="name"
        :value="option.value"
        :checked="value === option.value"
        :aria-label="option.ariaLabel || option.label"
        @change="$emit('update:value', option.value)"
      />
      <span class="hb-radio-group__content">
        <span v-if="option.icon" aria-hidden="true">{{ option.icon }}</span>
        <span v-if="showOptionLabels">{{ option.label }}</span>
      </span>
    </label>
  </div>
</template>
