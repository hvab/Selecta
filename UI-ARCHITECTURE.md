# UI architecture

## Decision

`Selecta` uses two separate visual layers:

1. The preview layer represents a real Aegea page and stays close to the `plain` theme:
   - real Aegea-like markup;
   - the real `plain` CSS-variable contract;
   - values driven by the editable theme state.
2. The generator shell is a separate stable interface around the preview:
   - its own UI tokens and component styles;
   - visually calm and compatible with Aegea in spirit;
   - not driven by the theme values currently being edited.

The edited theme must be allowed to change drastically without making the editor itself harder to use.

## Why

Using the same mutable theme values for both preview and controls would couple the tool to the artifact it edits:

- changing the generated theme could unexpectedly change the readability of the controls;
- preview accuracy and editor usability would start competing with each other;
- future themes with unusual palettes or typography would make the tool less stable.

The preview should be honest. The editor should remain dependable.

## UI stack

The current shell uses `hvab-blocks` 0.4.0 tokens and block styles through `src/ui/hvab.css`. Local Vue wrappers in `src/ui/` keep Selecta's component API and behavior separate from those styles.

- Native inputs remain the basis for ordinary color, select, range, text, checkbox, switch, and button controls.
- Preset selection uses native radio inputs inside the local RadioCard adapter over hb-card. Card colors summarize each preset's base palette; shell surfaces and selected/focus states stay independent of theme colors.
- `Reka UI` supplies headless behavior for the action menu, interface-settings popover, confirmation dialog, and feedback tooltip.
- `src/components/App/AppLayers.css` owns shared floating/modal layer values, including portalled Reka content.
- `src/ui/panelLayout.js` and `src/ui/usePanelLayout.js` own the measured panel-width constraints. The saved preferred width stays separate from the effective width allowed by the current workspace.
- App-specific layout and adaptations stay local; the preview does not consume the shell's visual tokens.

Use existing wrappers for shell controls. Add another headless primitive only when a concrete interaction requires it; do not introduce a second styled UI framework.

Theme appearance and editor appearance are independent: the edited light/dark palettes drive the preview and generated theme, while the shell uses its own appearance preference. English/Russian UI and preview content are supported through the app's i18n layer.

## Styling principles

- Preview styles and shell styles stay separate.
- Theme state, derived values, preview, generated files, and shell UI remain separate responsibilities.
- Prefer semantic tokens over repeated literal values when shell styling starts to repeat.
- Avoid magic values once a value becomes shared or meaningful.
- Keep the shell compact, quiet, and work-focused.
- Do not let shell styles leak into the preview surface or preview styles leak back into the shell.

## Relationship to external references

- Aegea `plain` is the source of truth for preview markup and the exported theme contract.
- General lessons from external systems may be reused only when they fit this local architecture.
