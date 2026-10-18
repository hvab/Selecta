<script setup>
import { useI18n } from 'vue-i18n';
import Checkbox from '../../ui/Checkbox/Checkbox.vue';

const { t } = useI18n();

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
});

defineEmits(['toggle']);
</script>

<template>
  <Checkbox
    :checked="state === 'all'"
    :aria-checked="state === 'mixed' ? 'mixed' : String(state === 'all')"
    :data-state="state === 'mixed' ? 'indeterminate' : undefined"
    :aria-label="t('aria.lockGroupForRandom', { label })"
    @change="$emit('toggle')"
  />
</template>
