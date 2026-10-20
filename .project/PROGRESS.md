# Progress

Current working context for Selecta. Product behavior is defined in
[`SPEC.md`](../SPEC.md); historical plans are not active instructions.

## Status

The audit remediation is complete. Main is `8f5c722` after PR #8 (2026-10-19).
[CI](https://github.com/hvab/Selecta/actions/runs/39265357150) and
[Pages](https://github.com/hvab/Selecta/actions/runs/39265357066) succeeded on
that revision. No new versioned release was created during audit closeout.
Package version remains `0.8.0`; subsequent changes belong to `Unreleased`.

This is the status of merged main. The local working checkout was still older
`develop` at `29fb10c` when these documents were consolidated; no application
checkout synchronization is implied. Verify the actual revision before new work.

## Implemented

- Vite, Vue and plain JavaScript; browser-only generation of child themes based
  on Aegea `plain`, with a theme folder inside the ZIP.
- Metadata, layout, typography and light/dark palette controls; independent
  light/dark shell appearance and RU/EN interface/preview.
- Aegea presets, Random, per-field/group locks, session restore and Reset.
- JSON import/export and URL sharing; validated input boundaries and stale
  File-import protection. Language and shell preferences stay outside exports.
- System/plain font choices and a curated Cyrillic Google Fonts catalog;
  remote CSS loading with fallbacks, without bundling font files.
- Non-blocking contrast hints; no comprehensive contrast certification.
- Local Vue adapters over `hvab-blocks` 0.3.0, with Reka menu, dialog and
  feedback-tooltip behavior. Shell and Aegea preview styles remain separate.
- Compact header with wrapping groups below `64rem`; workspace breakpoint
  stays at `40rem`. Desktop is the primary use case.

## Audit closeout

The authoritative outcome and PR mapping are in [`audit/README.md`](../audit/README.md).

- R01–R05 are merged: validation, quality gate, panel sizing, plain font stack
  and persistence. V01 stale File success/error handling is also merged.
- V02 install/render acceptance and V03 desktop preview comparison are closed
  by the owner's manual confirmation. Do not repair local PHP/libzip merely
  to repeat that acceptance; no detailed platform matrix is claimed.
- The separate V03 header overlap is fixed and merged in PR #8.
- V04 large-file stress scenarios were withdrawn: real configs are about 1 KB.
  Font-network fallback and highlighted-link contrast are optional backlog items.
- No further zoom or mobile checks. Historical unchecked checklists do not
  reinstate them. Broader platform coverage is not claimed or a mandatory audit
  follow-up without a concrete task.
- PR #2, #4, #6, #7 and #8 are merged; #1, #3 and #5 are closed duplicates.
  No open PR or GitHub Issue remained at closeout.

## Active work

No implementation track is active. Do not restart completed header, radio-group,
overlay, block-library, validation or persistence migrations from old plans.

Documentation closeout consolidated the current context and audit outcome,
archived completed setup/work logs and audit prompts, removed generated local
build output/Finder metadata, and moved actual unfinished UI polish to
[`IDEAS.md`](./IDEAS.md). Application code and dependencies were not changed by
this cleanup. Commit/push and release are separate actions, not implied here.

Documentation formatting and local links were checked; original audit reports
and archived setup/prompts retain their contents. Independent Sol 6.1 review
found no actionable documentation issues, and the coordinator accepted it.

Choose a small task from the backlog only when requested. The disabled-ZIP
feedback layout remains optional UI polish; do not mark it implemented merely
because audit remediation is complete.

## Working references

- [`SPEC.md`](../SPEC.md): current product scope.
- [`UI-ARCHITECTURE.md`](../UI-ARCHITECTURE.md): shell/preview separation.
- [`PREVIEW-BASELINE.md`](../PREVIEW-BASELINE.md): pinned Aegea source contract.
- [`RELEASE.md`](../RELEASE.md): checks, PR and release workflow.
- [`CHANGELOG.md`](../CHANGELOG.md): release history and unreleased changes.
- [`IDEAS.md`](./IDEAS.md): optional future work.
- [`archive/README.md`](./archive/README.md): completed plans and detailed history.

Read `AGENTS.md` before implementation; machine-local paths belong only in
`AGENTS.local.md`. Use scoped checks for documentation changes. Plan the next
implementation slice here before changing code, and record actual verification
and remaining limits afterward.
