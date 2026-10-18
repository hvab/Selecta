<script setup>
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

defineProps({
  size: {
    type: String,
    default: 'm',
  },
});

const attrs = useAttrs();

function getInputAttrs() {
  return Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'));
}
</script>

<template>
  <div :class="['hb-range-input', `hb-range-input_size_${size}`, attrs.class]" :style="attrs.style">
    <input v-bind="getInputAttrs()" class="hb-range-input__control" type="range" />
  </div>
</template>
