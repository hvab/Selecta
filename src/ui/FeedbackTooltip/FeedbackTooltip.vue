<script setup>
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui';

defineProps({
  message: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
  reference: {
    type: null,
    default: null,
  },
  side: {
    type: String,
    default: 'bottom',
  },
  sideOffset: {
    type: Number,
    default: 8,
  },
  view: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <TooltipRoot :open="open" :disabled="true">
      <TooltipTrigger :reference="reference" as="span" class="feedback-tooltip__anchor" />
      <TooltipPortal>
        <TooltipContent
          :class="['hb-tooltip', { [`feedback-tooltip_view_${view}`]: view }]"
          :side="side"
          :side-offset="sideOffset"
        >
          {{ message }}
          <span class="hb-tooltip__arrow" aria-hidden="true"></span>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style>
.feedback-tooltip__anchor {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.feedback-tooltip_view_danger {
  --hb-tooltip-background: var(--hb-color-base-danger-light);
  --hb-tooltip-text-color: var(--hb-color-text-danger-heavy);
}
</style>
