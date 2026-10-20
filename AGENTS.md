# Agent instructions

## Communication

- Reply in Russian.
- Be concise and practical.
- If the task is unclear or risky, ask one clarifying question.
- Otherwise proceed with explicit assumptions.
- After each completed iteration, summarize what changed, how to check it, known limits, and the next small step.

## Source of truth

- `SPEC.md` is the main project specification.
- `.project/PROGRESS.md` is the current AI working context, progress summary, active feature plan, and next-step checklist.
- `.project/IDEAS.md` is the raw backlog for future ideas.
- The Aegea repository is the external source of truth for how themes work and for the real markup/CSS-variable contract used by preview.
- If `AGENTS.local.md` exists, read it for machine-local paths to the Aegea checkout and related local-only context.
- Keep machine-local paths in `AGENTS.local.md`; do not copy them into tracked project documents.
- If preview structure, theme inheritance, or CSS variables are in question, inspect current Aegea code instead of guessing.

## Project decisions

- Use Vite, Vue, and plain JavaScript.
- Do not use TypeScript.
- Do not add backend.
- Generate only child themes based on `plain`.
- Export a ZIP archive with the theme folder inside it.
- Support inherited `plain` fonts, system fonts, and the curated Cyrillic Google Fonts catalog through the CSS API; do not bundle font files.
- User-facing app UI supports English and Russian.
- Preserve implemented presets, Random with field/group locks, contrast warnings, light/dark theme palettes, JSON import/export, URL sharing, and local session persistence.
- Keep generator-shell appearance independent from the edited theme; UI state and locks do not belong in theme JSON, share URLs, or ZIP output.
- Do not add existing-theme import or other features outside `SPEC.md` without a new scoped iteration.
- Desktop is the primary usage scenario. Keep the interface and preview visually intact on narrow screens; do not schedule further zoom or mobile verification under the agreed scope.

## Local commands

- Use `npm start` for local development.
- Use `npm run lint`, `npm run lint:styles`, and `npm run format:check` for code-quality checks.

## Preview rules

- Preview should stay as close as practical to real Aegea markup and the real CSS-variable contract.
- Keep track of which Aegea version the preview is based on.
- When preview-related code changes, check whether current Aegea changed:
  - the relevant markup;
  - the `plain` CSS-variable set;
  - the states that need to be represented in preview.
- Do not silently let preview become a generic mockup detached from Aegea.

## UI rules

- Build a working tool, not a landing page.
- Follow `UI-ARCHITECTURE.md` for the separation between the preview layer and the generator shell.
- Keep preview styles tied to Aegea `plain`; keep generator-shell styles separate and stable while the edited theme changes.
- Use local Vue adapters over the pinned `hvab-blocks` CSS blocks for generator-shell controls. Keep preview styles separate from these blocks and tokens.
- Prefer native control semantics. Use the existing `reka-ui` headless primitives for menus, dialogs, and tooltips; keep their visible styling in `hvab-blocks`.
- Keep controls understandable and aligned with the data type:
  - color inputs for colors;
  - grouped selects for inherited, system, and curated Google fonts;
  - sliders or steppers for numeric values.
- Keep the interface calm, compact, and task-focused.
- Do not add decorative marketing-style layout.

## Implementation workflow

- Work iteratively by `.project/PROGRESS.md`.
- When planning a new feature, first write a step-by-step implementation plan in `.project/PROGRESS.md` before making code changes.
- Break feature plans into small ordered steps with status checkboxes, expected files/areas, and verification commands or manual checks for each step.
- After each implementation step, update `.project/PROGRESS.md` with what changed, what was verified, known limits, and the next small step.
- Before each implementation step, check the current state against `SPEC.md`.
- Implement only the next small stage.
- Keep diffs scoped to the prompt.
- Do not reformat unrelated code.
- Keep theme state, derived values, file generation, preview, and UI separated by responsibility.
- Prefer real verification against a local Aegea install when the exported theme contract changes.

## Tests and verification

- Keep the existing focused checks for:
  - theme state derivation;
  - CSS generation;
  - `theme-info.php` generation;
  - validation;
  - ZIP structure.
- For preview and install flow changes, prefer a concise manual verification path in a real local Aegea instance.

## Git workflow

- Do not stage, commit, switch branches, or push unless explicitly requested.
- Commit only files related to the current iteration when the user asks for a commit.
- Do not rewrite history or run destructive git commands unless explicitly requested.
- For release steps, follow `RELEASE.md`.
