# Selecta

Selecta is a small browser-based theme generator for the [Aegea](https://blogengine.ru) blog engine.

The project is an experiment in making Aegea theme customization more visual and convenient: change theme settings, preview the result, and prepare theme files for further use.

## Preview

![Selecta preview](./docs/selecta-preview.gif)

Selecta is a work-in-progress tool for creating and testing visual themes for Aegea. It runs in the browser and is deployed as a static site with GitHub Pages.

## Status

The latest documented release is `0.8.0`. Subsequent audit fixes are merged into `main` and listed under `Unreleased` in [`CHANGELOG.md`](./CHANGELOG.md).

The tool currently supports:

- Aegea `plain` child themes with editable metadata, light/dark palettes, typography, and layout;
- live English/Russian preview based on Aegea `11.5`, build `v4199`;
- visual Aegea preset cards, animated Random generation, field/group locks, and contrast hints;
- inherited fonts, system font stacks, and a curated Google Fonts catalog;
- independent interface settings and a narrow layout with fixed export actions;
- local session restore, theme JSON import/export, folder/ZIP/CSS/PHP import, and share links;
- ZIP export containing the theme folder, `theme-info.php`, `styles/main.css`, and `selecta.json`.

The app runs entirely in the browser. Google Fonts require network access. The interface, generated output, and internal structure may still change.

## Continuing work on a theme

Click **Import theme** to open the file picker directly, or drop a theme folder
or files onto the button. The picker and dropped files accept one ZIP, one JSON,
or a CSS and/or PHP file with an optional JSON snapshot.
Drop one theme folder at a time, without other files alongside it.
CSS and PHP can be selected together; multiple files of the same type and ZIPs
mixed with other files are rejected. ZIPs may contain one theme folder or
the theme files directly at the archive root. For folders and ZIPs, Selecta reads
`selecta.json` when available, then applies supported settings from
`theme-info.php` and `styles/main.css`. Edits to those theme files take priority
over the JSON snapshot; CSS takes priority for shared colors. A missing or
invalid JSON snapshot does not prevent importing supported PHP/CSS settings.
Individual CSS/PHP files follow the same precedence; their names may differ.
Their export folder name comes from the JSON snapshot or Selecta defaults.

Only settings supported by Selecta are imported. Other files, templates and
CSS rules are ignored and are not included in the next export. The result is
always a new child theme based on `plain`. PHP is never executed, and imported
stylesheets are never loaded into the page. See [the import contract](./SPEC.md#111-импорт-папки-темы-и-zip)
for the supported subset.

## Demo

[Open Selecta](https://hvab.github.io/Selecta/)

## Project documentation

- [`SPEC.md`](./SPEC.md): current product scope and theme contract.
- [`.project/PROGRESS.md`](./.project/PROGRESS.md): current status and next step.
- [`audit/README.md`](./audit/README.md): audit closeout, merged fixes, and remaining optional work.
- [`PREVIEW-BASELINE.md`](./PREVIEW-BASELINE.md): Aegea target, preview coverage, and acceptance limits.
- [`UI-ARCHITECTURE.md`](./UI-ARCHITECTURE.md): preview and editor responsibilities.
- [`RELEASE.md`](./RELEASE.md): checks and release workflow.

## Development

Use Node.js 24 LTS (or Node.js 22.13+ within the 22.x line).

```bash
npm install
npm start
```

After startup, the project will be available at the local URL printed by Vite,
usually `http://localhost:5173/Selecta/`.

Build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Releases

Released changes are tracked in [`CHANGELOG.md`](./CHANGELOG.md).

## Project Flow

The `main` branch is used for active development and GitHub Pages deployment.

For changes, use short-lived branches:

```text
feature/theme-export
fix/pages-build
docs/readme
```

After merging into `main`, GitHub Actions builds the project and deploys it to GitHub Pages.

## License

MIT
