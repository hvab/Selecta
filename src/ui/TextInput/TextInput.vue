<script setup>
defineProps({
  type: {
    type: String,
    default: 'text',
  },
  size: {
    type: String,
    default: 'm',
  },
});
</script>

<template>
  <input :class="['hb-text-input', `hb-text-input_size_${size}`]" :type="type" />
</template>
