<script setup>
defineProps({
  size: {
    type: String,
    default: 'm',
  },
});
</script>

<template>
  <select :class="['hb-select', `hb-select_size_${size}`]">
    <slot />
  </select>
</template>
