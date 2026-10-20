# Audit closeout

The October 2026 audit is complete. This document supersedes open-status and
next-step statements in the original reports and historical work logs.

## Merged corrections

| Item                    | Outcome                                                                          | PR / main commit                                        |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| R01 / C01 / F01         | Validate supported theme values at import and ZIP boundaries.                    | [#2](https://github.com/hvab/Selecta/pull/2), `6b69a41` |
| R02 / C04 / F04         | Restore the quality gate and integrate current UI styles.                        | [#6](https://github.com/hvab/Selecta/pull/6), `b9452c1` |
| R03 / C03 / F03         | Recalculate and clamp panel sizes with workspace changes.                        | #6, `b9452c1`                                           |
| R04 / C02 / F02         | Match the pinned Aegea plain font stack.                                         | [#4](https://github.com/hvab/Selecta/pull/4), `7d0f475` |
| R05 / C05–C06 / F05–N01 | Preserve session edits after Reset and on page leave; save URL imports.          | #6, `b9452c1`                                           |
| V01                     | Ignore obsolete File-import successes and errors after newer user intent.        | [#7](https://github.com/hvab/Selecta/pull/7), `830607c` |
| V03 header finding      | Prevent subtitle/control overlap with compact header layout and wrapping groups. | [#8](https://github.com/hvab/Selecta/pull/8), `8f5c722` |

PRs [#1](https://github.com/hvab/Selecta/pull/1),
[#3](https://github.com/hvab/Selecta/pull/3) and
[#5](https://github.com/hvab/Selecta/pull/5) were closed as duplicates, without
separate merges. No PR or GitHub Issue remained open at closeout. Audit IDs are
document identifiers, not GitHub issue numbers.

## Acceptance and scope decisions

- **V02: accepted by the owner.** After the install/render and preview-comparison
  scope was explained, the owner confirmed: “я это все проверял - работает хорошо”.
  Source provenance is pinned to Aegea 11.5/v4199, commit
  `e1d058356e5426bb1878785c6f4ab4e68b6c4995`. The owner's exact environment and
  detailed test matrix were not supplied; do not infer them. The old local
  PHP/libzip failure does not require repair solely to duplicate this acceptance.
- **V03: closed within the agreed scope.** Desktop preview/installed-theme
  comparison is accepted by that confirmation; header overlap is fixed in #8.
  Agent browser checks covered RU/EN at 375, 641 and 1280 px before merging #8.
  The owner then excluded all further zoom and mobile verification. This is a
  scope decision, not a claim of measured pixel parity or every platform passing.
- **V04: no mandatory experiment suite.** Real serialized configurations contain
  40 fields and measure 950 UTF-8 bytes by default, 949–1014 bytes across the ten
  built-in presets with ordinary metadata. Artificial 1/5/20 MB padded imports
  have no established product use case and were removed. No arbitrary size cap
  was added. One font-network fallback check and a highlighted-link contrast
  warning gap are low-priority items in [the backlog](../.project/IDEAS.md).

The confirmed fixes and agreed acceptance are complete. Platform coverage not
specifically demonstrated is not claimed. No new release, full WCAG compliance,
font-service availability guarantee or automatic release approval follows from
closing this audit.

## Final verification

- Merged main: `8f5c722010a615ee5916aaa5c1b79ea45ac50728`.
- [Main CI passed](https://github.com/hvab/Selecta/actions/runs/39265357150):
  dependency installation, JavaScript/Vue lint, style lint, formatting, existing
  tests and production build.
- [GitHub Pages deployment succeeded](https://github.com/hvab/Selecta/actions/runs/39265357066).
- Independent Sol 6.1 final review of PR #8 at `de5deec` found no actionable
  problems; the coordinator checked and accepted its conclusions before merge.

## Historical evidence

- [Astra report](./1-astra-xhigh.md): original findings and baseline.
- [Sol 6.1 verification and remediation plan](./2-sol-6-1-xhigh.md): original
  canonical IDs, evidence and hypotheses.
- [Archived work log](../.project/archive/progress-through-audit-2026-10-19.md):
  detailed implementation, reproduction and acceptance history.
- [Archived audit prompts](./archive/README.md): completed review instructions.

The original reports are preserved unchanged. Their statements about then-open
defects, missing provenance and future experiments describe the historical
baseline; they must not restart completed work.
