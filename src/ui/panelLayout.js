export const defaultControlsPaneWidth = 416;
export const controlsPaneMinWidth = 320;
export const controlsPaneMaxWidth = 672;
export const previewPaneMinWidth = 360;

export function getControlsPaneMaxWidth(workspaceWidth, dividerWidth) {
  return Math.max(
    controlsPaneMinWidth,
    Math.min(controlsPaneMaxWidth, workspaceWidth - dividerWidth - previewPaneMinWidth)
  );
}

export function constrainControlsPaneWidth(value, maximum = controlsPaneMaxWidth) {
  return Math.min(Math.max(value, controlsPaneMinWidth), maximum);
}
