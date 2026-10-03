<script setup>
defineProps({
  size: {
    type: String,
    default: 'm',
  },
});
</script>

<template>
  <input :class="['hb-color-input', `hb-color-input_size_${size}`]" type="color" />
</template>
