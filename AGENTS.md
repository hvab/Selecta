# Agent instructions

## Communication

- Reply in Russian.
- Be concise and practical.
- If the task is unclear or risky, ask one clarifying question.
- Otherwise proceed with explicit assumptions.
- After each completed iteration, summarize what changed, how to check it, known limits, and the next small step.

## Source of truth

- `SPEC.md` is the main project specification.
- `.project/AI-HANDOFF.md` is the current AI working context, progress summary, and next-step checklist.
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
- Use only system web-safe fonts in MVP.
- Use English for all user-facing UI copy in MVP.
- Do not add i18n infrastructure in MVP.
- Do not add dark mode, presets, Google Fonts, bundled font files, JSON export/import, contrast warnings, or existing-theme import in MVP.
- The interface and preview must be responsive from the start.

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
- In MVP, prefer native controls with local styling; do not add a styled UI framework.
- Add headless UI primitives only when a real complex interaction appears that native controls do not cover well.
- Keep controls understandable and aligned with the data type:
  - color inputs for colors;
  - selects for system fonts;
  - sliders or steppers for numeric values.
- Keep the interface calm, compact, and task-focused.
- Do not add decorative marketing-style layout.

## Implementation workflow

- Work iteratively by `.project/AI-HANDOFF.md`.
- Before each implementation step, check the current state against `SPEC.md`.
- Implement only the next small stage.
- Keep diffs scoped to the prompt.
- Do not reformat unrelated code.
- Keep theme state, derived values, file generation, preview, and UI separated by responsibility.
- Prefer real verification against a local Aegea install when the exported theme contract changes.

## Tests and verification

- Do not add test infrastructure just for the scaffold.
- Start automated tests when the first pure generation logic appears, then keep adding focused tests for:
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
