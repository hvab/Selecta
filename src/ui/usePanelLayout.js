import { computed, onMounted, onUnmounted, ref } from 'vue';
import { constrainControlsPaneWidth, defaultControlsPaneWidth, getControlsPaneMaxWidth } from './panelLayout.js';

export function usePanelLayout(workspaceElement) {
  const paneResizerElement = ref(null);
  // Keep the saved preference independent of temporary viewport constraints.
  const controlsPaneWidth = ref(defaultControlsPaneWidth);
  const workspaceWidth = ref(0);
  const dividerWidth = ref(0);
  const effectiveControlsPaneMaxWidth = computed(() =>
    getControlsPaneMaxWidth(workspaceWidth.value, dividerWidth.value)
  );
  const effectiveControlsPaneWidth = computed(() =>
    constrainControlsPaneWidth(controlsPaneWidth.value, effectiveControlsPaneMaxWidth.value)
  );
  let resizeObserver = null;

  function measurePanels() {
    workspaceWidth.value = workspaceElement.value?.getBoundingClientRect().width ?? 0;
    dividerWidth.value = paneResizerElement.value?.getBoundingClientRect().width ?? 0;
  }

  function getConstrainedControlsPaneWidth(value) {
    return constrainControlsPaneWidth(value, effectiveControlsPaneMaxWidth.value);
  }

  onMounted(() => {
    measurePanels();

    if (globalThis.ResizeObserver) {
      resizeObserver = new ResizeObserver(measurePanels);
      resizeObserver.observe(workspaceElement.value, { box: 'border-box' });
      resizeObserver.observe(paneResizerElement.value, { box: 'border-box' });
    } else {
      window.addEventListener('resize', measurePanels);
    }
  });

  onUnmounted(() => {
    resizeObserver?.disconnect();
    window.removeEventListener('resize', measurePanels);
  });

  return {
    controlsPaneWidth,
    effectiveControlsPaneWidth,
    effectiveControlsPaneMaxWidth,
    paneResizerElement,
    getConstrainedControlsPaneWidth,
  };
}
