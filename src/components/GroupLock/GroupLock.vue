<script setup>
import { useI18n } from 'vue-i18n';
import LockToggle from '../../ui/LockToggle/LockToggle.vue';

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
  <LockToggle
    group
    :state="state"
    :label="
      t(
        state === 'all'
          ? 'aria.unlockAllForRandom'
          : state === 'mixed'
            ? 'aria.lockRemainingForRandom'
            : 'aria.lockAllForRandom',
        { label }
      )
    "
    @toggle="$emit('toggle')"
  />
</template>
