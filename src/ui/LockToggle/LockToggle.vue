<script setup>
import Button from '../Button/Button.vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    validator: (value) => ['all', 'mixed', 'none'].includes(value),
  },
  group: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['toggle']);
</script>

<template>
  <Button
    class="lock-toggle"
    :view="state === 'mixed' ? 'outlined' : 'flat'"
    size="xs"
    :aria-label="label"
    :title="label"
    :aria-pressed="state === 'mixed' ? 'mixed' : String(state === 'all')"
    @click="$emit('toggle')"
  >
    <svg
      class="lock-toggle__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <g v-if="group">
        <path d="M6 13H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2" />
        <path d="M4 13v-3a3 3 0 0 1 3-3" />
      </g>
      <g :transform="group ? 'translate(3 -2)' : undefined">
        <rect x="6" y="11" width="12" height="10" rx="2" />
        <g
          v-for="iconState in ['none', 'all', 'mixed']"
          :key="iconState"
          class="lock-toggle__glyph"
          :class="{ 'lock-toggle__glyph_active': state === iconState }"
        >
          <path :d="iconState === 'none' ? 'M8 11V7a4 4 0 0 1 8 0' : 'M8 11V7a4 4 0 0 1 8 0v4'" />
          <path v-if="iconState === 'mixed'" d="M10 16h4" />
          <template v-else>
            <circle cx="12" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
            <path d="M12 16.5v1.5" />
          </template>
        </g>
      </g>
    </svg>
  </Button>
</template>

<style scoped>
.lock-toggle {
  --hb-button-padding: 0;

  flex-shrink: 0;
  width: var(--hb-size-control-height-xs);
}

.lock-toggle[aria-pressed='false'] {
  --hb-button-text-color: var(--hb-color-text-secondary);
  --hb-button-text-color-hover: var(--hb-color-text-primary);
}

.lock-toggle__icon {
  display: block;
}

.lock-toggle__glyph {
  opacity: 0;
  transition: opacity 140ms var(--hb-ease-out);
}

.lock-toggle__glyph_active {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .lock-toggle__glyph {
    transition: none;
  }
}
</style>
