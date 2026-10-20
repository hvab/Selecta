<script setup>
import { useI18n } from 'vue-i18n';
import LockToggle from '../../ui/LockToggle/LockToggle.vue';

const { t } = useI18n();

defineProps({
  locked: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
});

defineEmits(['update:locked']);
</script>

<template>
  <LockToggle
    :state="locked ? 'all' : 'none'"
    :label="t(locked ? 'aria.unlockForRandom' : 'aria.lockForRandom', { label })"
    @toggle="$emit('update:locked', !locked)"
  />
</template>
