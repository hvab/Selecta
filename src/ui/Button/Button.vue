<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  view: {
    type: String,
    default: 'flat',
  },
  size: {
    type: String,
    default: 'm',
  },
});
</script>

<template>
  <button :class="['hb-button', `hb-button_view_${view}`, `hb-button_size_${size}`]" :type="type">
    <slot />
  </button>
</template>
