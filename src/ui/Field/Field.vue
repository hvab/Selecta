<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  labelFor: {
    type: String,
    default: '',
  },
  layout: {
    type: String,
    default: 'vertical',
  },
  message: {
    type: String,
    default: '',
  },
  messageId: {
    type: String,
    default: '',
  },
  messageView: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div :class="['hb-field', { 'hb-field_layout_inline': layout === 'inline' }]">
    <label v-if="label || $slots.label" class="hb-field__label" :for="labelFor">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="hb-field__control">
      <slot />
    </div>
    <span v-if="$slots.addons" class="hb-field__addons">
      <slot name="addons" />
    </span>
    <div
      v-if="message || $slots.message"
      :id="messageId || undefined"
      :class="['hb-field__message', { [`hb-field__message_view_${messageView}`]: messageView }]"
    >
      <slot name="message">{{ message }}</slot>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 40rem) {
  .hb-field.hb-field_layout_inline {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
  }
}
</style>
