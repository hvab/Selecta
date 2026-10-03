<script setup>
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui';
import Button from '../Button/Button.vue';

defineProps({
  actions: {
    type: Array,
    required: true,
  },
  align: {
    type: String,
    default: 'end',
  },
  side: {
    type: String,
    default: 'bottom',
  },
  sideOffset: {
    type: Number,
    default: 4,
  },
});

const emit = defineEmits(['menu-open', 'select']);

function handleMenuOpenChange(open) {
  if (open) {
    emit('menu-open');
  }
}
</script>

<template>
  <DropdownMenuRoot @update:open="handleMenuOpenChange">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent class="hb-popover action-menu" :align="align" :side="side" :side-offset="sideOffset">
        <DropdownMenuItem
          v-for="action in actions"
          :key="action.value"
          as-child
          :disabled="action.disabled"
          @select="$emit('select', action.value)"
        >
          <Button view="flat" :disabled="action.disabled" class="action-menu__item">{{ action.label }}</Button>
        </DropdownMenuItem>
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style>
.action-menu {
  display: flex;
  flex-direction: column;
}

.action-menu__item {
  justify-content: flex-start;
}
</style>
