<script setup>
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui';

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
});

defineEmits(['confirm', 'update:open']);
</script>

<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="hb-modal confirm-dialog">
        <DialogContent class="hb-modal__panel" :aria-describedby="undefined">
          <div class="hb-dialog hb-dialog_size_s">
            <div class="hb-dialog__header"></div>
            <div class="hb-dialog__body">
              <DialogTitle as="div" class="hb-text hb-text_typography_body-2">
                {{ question }}
              </DialogTitle>
            </div>
            <div class="hb-dialog__footer">
              <DialogClose as-child>
                <slot name="cancel" />
              </DialogClose>
              <DialogClose as-child @click="$emit('confirm')">
                <slot name="action" />
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.confirm-dialog {
  z-index: var(--app-layer-modal);
}
</style>
