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

Do not add a permanent `develop` branch unless the project grows into several active contributors or long-running release trains.

## Daily Work

1. Create a short-lived branch from `main`.
2. Make a focused change.
3. Run the relevant local checks.
4. Open a pull request into `main`.
5. Merge into `main` when the diff is reviewed.

After merge, GitHub Pages deploys the current app from `main`.

## Local Checks

Before merging a code change, run:

```bash
npm run lint
npm run lint:styles
npm run format:check
npm run build
```

For changes that touch generation logic, also run:

```bash
npm test
```

## Versions

Use semantic versioning where practical:

```text
0.1.0 - first usable public version
0.2.0 - new user-facing functionality
0.2.1 - fixes without new feature scope
```

Public releases are cut from `main`.

## Release Checklist

For each public release:

1. Make sure `main` contains only reviewed, releasable changes.
2. Move completed items from `CHANGELOG.md` `Unreleased` into a new version section.
3. Run the local checks.
4. Make sure the working tree is clean.
5. Bump the package version.
6. Create the git tag for the same version.
7. Push `main` and tags.
8. Check that GitHub Pages deploys successfully from `main`.

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
