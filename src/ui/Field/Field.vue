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
@container controls-pane (max-width: 23rem) {
  .hb-field.hb-field_layout_inline {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--hb-gap-1) var(--hb-gap-2);
  }

  .hb-field_layout_inline > .hb-field__label {
    grid-column: 1 / -1;
  }
}

@media (max-width: 40rem) {
  .hb-field.hb-field_layout_inline {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--hb-gap-1) var(--hb-gap-2);
  }

  .hb-field_layout_inline > .hb-field__label {
    grid-column: 1 / -1;
  }
}
</style>
