<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="control-group hb-card hb-card_view_filled">
    <h3 class="control-group__title hb-text hb-text_typography_subheader-3">{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped>
.control-group {
  --hb-card-padding: var(--hb-gap-3);

  display: flex;
  flex-direction: column;
  gap: var(--hb-gap-2);
}

.control-group__title {
  margin: 0;
}
</style>
