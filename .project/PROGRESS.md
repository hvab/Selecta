# Progress

Current working context for Selecta. Product behavior is defined in
[`SPEC.md`](../SPEC.md); historical plans are not active instructions.

## Status

The audit remediation is complete. Main is `8f5c722` after PR #8 (2026-10-19).
[CI](https://github.com/hvab/Selecta/actions/runs/39265357150) and
[Pages](https://github.com/hvab/Selecta/actions/runs/39265357066) succeeded on
that revision. No new versioned release was created during audit closeout.
Package version remains `0.8.0`; subsequent changes belong to `Unreleased`.
The dependency refresh below is local to `develop`, not yet published to main.

Local `develop` was synchronized with main `8f5c722` on 2026-10-20 before
the dependency refresh. Audit documentation closeout is preserved separately
in commit `eb5b4c8`. The dependency refresh preserves that audit baseline.

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
- Local Vue adapters over `hvab-blocks` 0.4.0, with Reka menu, dialog and
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

## Latest iteration: dependency refresh (2026-10-20)

- [x] Commit audit documentation closeout (`eb5b4c8`) and merge main into
      `develop` (`ff68291`), preserving all merged audit fixes.
- [x] Run `ncu -u` and update the lockfile to latest stable dependencies,
      including `hvab-blocks` 0.4.0, Vue 3.5.44, Reka UI 2.11, Vite 8.3.4,
      ESLint 10.13 and the current Stylelint toolchain.
- [x] Verify library changes and engines/peers with independent Sol 6.1 agents.
      Existing Vite/ESLint/Stylelint configurations and UI adapters remain
      compatible. Remove one unused initial assignment required by ESLint 10.
- [x] Document Node.js `^22.13.0 || >=24`; retain Node 22 in CI. Vite 8 uses
      its current default browser targets (Chrome/Edge 111, Firefox 114,
      Safari 16.4). The generated Aegea theme contract is unchanged.
- [x] Verify clean `npm ci`, lint, style lint, formatting, all 166 existing
      checks, and production build on Node 24.22. Repeat lint, style lint,
      all 166 checks and build on Node 22.17; both builds produce matching assets.
- [x] Verify production build in desktop Chromium: RU/EN, both shell themes,
      light/dark preview, preset selection, keyboard radio navigation, Share
      menu/copy feedback/disabled actions, dialog focus cycle/Escape/Reset,
      immediate reload persistence, and downloaded ZIP entries/metadata.
      Captured console has no warnings/errors. No zoom/mobile verification.
- [x] Independently review the diff with Sol 6.1 and accept the result after
      coordinator checks. No confirmed regressions found in this scope.

`ncu` reports all direct dependencies current. `npm audit --omit=dev` reports
zero vulnerabilities. Full audit retains nine related high-severity entries
from the single unpatched [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
in Stylelint's dev-only dependency chain. `braces` 3.0.3 is still latest;
there is no published compatible fix. Lint glob patterns here are fixed and
browser theme data never reaches this chain. Do not force the proposed
Stylelint downgrade. The separate `fast-uri` advisory was removed by updating
the compatible transitive dependency.

Audit documentation closeout is committed: historical setup/work logs and
prompts are archived, original audit reports are preserved, and actual optional
UI polish remains in [`IDEAS.md`](./IDEAS.md). No active audit task remains.

Next step: publish/review the local `develop` changes when requested. This
iteration has not pushed, merged into main, deployed, or created a release;
GitHub CI has not run for these local commits. Verification above is local.
No further application migration is currently required. Do not restart
completed audit work from historical plans.

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
