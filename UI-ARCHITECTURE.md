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

For MVP:

- use native controls wherever they are enough:
  - color inputs;
  - selects;
  - sliders or numeric inputs;
  - checkboxes;
  - buttons;
- style the generator shell locally;
- do not add a styled framework such as Bootstrap;
- do not adopt another project's design system as-is.

If the product later needs complex accessible interactions that native controls do not cover well, add headless primitives selectively instead of introducing a fully styled UI kit. Good candidates:

- combobox or autocomplete;
- custom select;
- dialog;
- tabs.

For Vue, `Reka UI` is the preferred first candidate for that headless layer because it provides unstyled accessible primitives while keeping styling local to `Selecta`.

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
