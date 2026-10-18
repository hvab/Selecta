<script setup>
import { useI18n } from 'vue-i18n';
import Checkbox from '../../ui/Checkbox/Checkbox.vue';

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
  <Checkbox
    :checked="locked"
    :aria-label="t('aria.lockForRandom', { label })"
    @change="$emit('update:locked', $event.target.checked)"
  />
</template>
