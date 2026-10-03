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
  <label :class="['hb-checkbox', `hb-checkbox_size_${size}`, attrs.class]" :style="attrs.style">
    <input v-bind="getInputAttrs()" class="hb-checkbox__control" type="checkbox" />
    <span class="hb-checkbox__box" aria-hidden="true"></span>
    <span v-if="$slots.default" class="hb-checkbox__label"><slot /></span>
  </label>
</template>
