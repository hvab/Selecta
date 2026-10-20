<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['select']);
</script>

<template>
  <label class="radio-card hb-card" data-clickable :data-selected="checked ? '' : undefined">
    <input
      class="radio-card__control"
      type="radio"
      :name="name"
      :value="value"
      :checked="checked"
      @change="$emit('select', value)"
    />
    <slot />
  </label>
</template>

<style scoped>
.radio-card {
  --hb-card-padding: var(--hb-gap-2);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--hb-gap-1);
  min-width: 0;
}

.radio-card:has(:focus-visible) {
  outline: var(--hb-focus-ring-width) solid var(--hb-color-line-focus);
  outline-offset: var(--hb-focus-ring-offset);
}

.radio-card__control {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: inherit;
  opacity: 0;
}
</style>
