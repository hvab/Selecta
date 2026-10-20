<script setup>
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';

defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent class="hb-popover" align="end" :side-offset="4" :aria-label="label">
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
