# Release Flow

Selecta uses a simple trunk-based flow.

## Branches

`main` is the stable development branch. GitHub Pages is deployed from `main`.

Use short-lived branches for changes:

```text
feature/theme-export
feature/color-controls
fix/pages-build
docs/release-flow
```

`develop` is a legacy branch and is not the source of the current deployed app. Do not use it as a release baseline or create a permanent integration branch.

## Daily Work

1. Create a short-lived branch from `main`.
2. Make a focused change.
3. Run the relevant local checks.
4. Open a pull request into `main`.
5. Merge into `main` when the diff is reviewed.

After merge, GitHub Pages deploys the current app from `main`. CI and Pages are separate workflows; a successful deployment does not prove that the quality checks passed.

Branch creation, commits, pushes, merges, and tags require the owner's explicit instruction. This workflow describes authorized release work; it does not grant that authorization.

## Local Checks

CI uses Node.js 22 and `npm ci`. Before merging a code change, run:

```bash
npm run lint
npm run lint:styles
npm run format:check
npm test
npm run build
```

CI runs all five commands on pull requests to `main` and pushes to `main`.

## Versions

Use semantic versioning where practical:

```text
0.1.0 - first usable public version
0.2.0 - new user-facing functionality
0.2.1 - fixes without new feature scope
```

Public releases are cut from `main`.

Merged fixes can remain under `Unreleased` until the owner requests a versioned release. Completing an audit or deploying `main` does not create a new public version.

## Release Checklist

For each public release:

1. Make sure `main` contains only reviewed, releasable changes.
2. Move completed items from `CHANGELOG.md` `Unreleased` into a new version section.
3. Run the local checks.
4. Make sure the working tree is clean.
5. Bump the package version.
6. Create the git tag for the same version.
7. Push `main` and tags.
8. Check that both CI and GitHub Pages complete successfully for the release commit on `main`.
9. For theme-contract or preview changes, record the relevant Aegea installation/preview acceptance and its limits in `PREVIEW-BASELINE.md` or the linked audit closeout.

Example:

```bash
npm version patch
git push origin main --follow-tags
```

Use `npm version minor` for a feature release and `npm version patch` for a fix release.
With `npm version`, steps 5 and 6 happen together: it updates `package.json` and `package-lock.json`, creates a version commit, and creates a `vX.Y.Z` tag.

Tags document public versions. GitHub Pages still deploys from `main`.

## Later

Add these only when they start paying for themselves:

- GitHub Release notes copied from `CHANGELOG.md` for tagged public releases.
