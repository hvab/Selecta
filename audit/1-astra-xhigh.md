# Selecta — независимый аудит, проход 1 (Astra xhigh)

Дата: 2026-10-03. Режим: review-only, без исправлений. Отчёт относится к **локальному working tree**, основанному на `3df22e0167c773a04bdefcb69c722e112068efcc`, а не к текущему GitHub Pages или remote `main`.

## 1. Executive summary

Подтверждены пять проблем: четыре Medium и одна Low; Critical/High не установлены.

| ID  | Severity | Уверенность                       | Вывод                                                                                                                                                                                                       |
| --- | -------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01 | Medium   | Высокая                           | JSON/URL/storage проверяют типы, но пропускают недопустимые значения. Через настоящий URL-импорт скачан ZIP с произвольным CSS-правилом и неверным `based_on`; нечисловой предел `1e999` также принимается. |
| F02 | Medium   | Высокая для расхождения CSS       | «Как в родительской теме» показывает `InterVariable, sans-serif`, тогда как экспорт наследует системный стек Aegea 11.5.                                                                                    |
| F03 | Medium   | Высокая                           | Максимум ширины панели кэшируется без реакции на изменение окна: при 768 px панель занимает 672 px, превью — 88 px.                                                                                         |
| F04 | Medium   | Высокая для локального результата | Четыре обязательные проверки завершаются ошибкой: test, lint, lint:styles, format:check. Сборка проходит.                                                                                                   |
| F05 | Low      | Высокая                           | Последнее изменение теряется при reload до истечения 500 ms debounce сохранения; воспроизведено в браузере.                                                                                                 |

Главный генераторный путь имеет рабочие основы: общая модель для CSS/preview/PHP, корректные ZIP-пути на допустимых данных, отдельное UI-состояние и обоснованная схема dark mode. Основной приоритет — закрыть входные границы и вернуть надёжный контроль качества, затем устранить расхождения preview и размеры панелей. Это направления для независимой проверки, не готовый implementation plan.

Установка и переключение темы в живой Aegea **не проверены**. Наличие исходников, успешная Vite-сборка и unit tests не доказывают install parity.

## 2. Baseline, ограничения и coverage

### 2.1. Зафиксированное состояние

- Branch: `main`.
- HEAD: `3df22e0167c773a04bdefcb69c722e112068efcc`.
- Начальный `git status --short`: ` M .project/PROGRESS.md`, ` M src/components/App/App.vue`; staged изменений не было.
- Чужой diff: 3 добавленные строки в PROGRESS; в App 7 добавлений/1 удаление — перенос `data-color-scheme` с `.app` на document root, watcher и cleanup. Ни один из этих файлов не менялся аудитом. Браузер проверял именно их текущую версию.
- SHA-256 working-tree App: `7fe8c0d3886c39b7acc164b12d7caef0738cd7c1ae691339e185d36df99a1a27`.
- SHA-256 working-tree PROGRESS: `8d46367d5eaa66d30280850e6202ba6f389999b9bfbfd0d241ba4b77b22ff142`.
- Первый промпт отсутствовал локально; прочитан через GitHub из [audit/1-astra-xhigh-prompt.md](https://github.com/hvab/Selecta/blob/a95eb2c4df1151a8d9adad5afe3e7919ceef7968/audit/1-astra-xhigh-prompt.md), blob `20263e6e1bec97689963971c77ce5bfe58665387`. Второй проход не выполнялся.
- Наблюдавшийся remote main: `a95eb2c4df1151a8d9adad5afe3e7919ceef7968`; его родитель — `6f96c76eed686caec3b9d60eb66c2568e71067cd`. Это отдельная линия с audit-документами; локальная линия содержит последующие изменения shell, Reka и hvab-blocks. Отчёт нельзя автоматически переносить на публичный deployment.
- Прочитаны применимые родительский и проектный AGENTS, AGENTS.local, SPEC, README, UI-ARCHITECTURE, PREVIEW-BASELINE, PROGRESS, IDEAS, CHANGELOG, RELEASE, package/config/workflow-файлы. Проектной `.agents/skills` нет; найденные общие навыки для других проектов и оптимизации изображений к review не применялись.
- Исследование велось 2026-10-03; версии инструментов и baseline зафиксированы в 07:12 UTC. Проверки повторно подтверждены после браузерного этапа.

Все ссылки на строки findings ниже относятся к **HEAD**, если явно не указано WT. В App после начала локального diff строки смещены: например, `downloadThemeZip` HEAD 511 / WT 515, watcher сохранения HEAD 571 / WT 576. Логика findings не изменена чужим diff. В других указанных файлах WT совпадает с HEAD.

### 2.2. Среда

Darwin 24.6.0 arm64; Node `v24.20.0`; npm `12.0.2`. CI настроен на Node 22/Linux, такая среда в этом прогоне не воспроизводилась.

Фактически установлены Vue 3.5.34, vue-i18n 11.4.5, fflate 0.8.3, hvab-blocks 0.2.0, reka-ui 2.10.1, Vite 6.4.3, ESLint 9.39.4, stylelint 17.11.1, Prettier 3.8.3. hvab-blocks закреплён lockfile на `b9c78a6bdccbc6d511032381b04c9b5143cc3719`. Сопоставлены версии 273 фактически присутствующих пакетов с lockfile: 0 расхождений. Это не проверка integrity tarball и не чистый `npm ci`.

Проверки выполнялись в отдельной временной копии tracked working-tree файлов с копией существующего node_modules; node_modules не являлся ссылкой на исходный checkout. Установки зависимостей, auto-fix, format-write, изменения lockfile и запуск deployments не выполнялись. Временный HTTP preview привязан к loopback. Для браузерных проверок использовалась отдельная вкладка Chrome; временные viewport overrides сняты.

Доступны два источника Aegea:

1. User-available distribution с `E2_VERSION=4199`, `E2_RELEASE='11.5'`, прочитанными `plain/theme-info.php`, `plain/src/styles/variables.scss` и стилями layout. SHA-256 variables.scss: `77c53bfb7c0d94c980bdec2b523bf60333621a9377ca4f8c1706db18304808fe`; theme-info.php: `3fbb894bbdbdaf990acc77e9b1a69c01f30cae5f652f190d795cd006d1e582ed`.
2. Чистый source checkout Aegea на `fada36ef1e5fba78d8d9f66dcc1b0d646e2df2fb`; изучены механизм наследования `system/core/olba.php` и релевантные стили. Объект baseline `e1d058356e5426bb1878785c6f4ab4e68b6c4995` в этом Git-хранилище отсутствует. Поэтому точное совпадение distribution с заявленным baseline commit не утверждается.

Локальный PHP 7.0.33 не стартует: динамический загрузчик не находит `libzip.5.dylib`. PHP lint и исполнение темы помечены NOT RUN, а не PASS. Починка окружения не проводилась.

### 2.3. Coverage matrix

| Область               | Глубина и метод                                                                                                                                                                      | Границы                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| App/state             | Прочитан script/template App целиком; traced init, URL → session → defaults, watchers, preset/random, resize, Reset, export, feedback                                                | Не тестировались все конкурентные async-порядки и teardown/remount                                                       |
| Model/generation      | Прочитаны model, css, themeInfo, zip, validation, metadata, typography; synthetic JSON/URL/storage → ZIP; браузер URL → Download ZIP                                                 | Нет живой установки в Aegea, PHP runtime недоступен                                                                      |
| Serialization/storage | Полное чтение serialize/storage, соответствующих tests; malformed JSON/version/type tests, Unicode, неизвестные поля, неверные values, Infinity, reload                              | Не выполнялся stress большим файлом/URL, не проверены реальные browser quota/private mode                                |
| Random/locks/presets  | Полное чтение реализаций; preset data и tests обозрены, все существующие tests запущены; 500 дополнительных детерминированных samples                                                | Не исчерпывающий перебор lock combinations; лимит retries может оставить предупреждения при несовместимых locks          |
| Fonts                 | fonts/googleFonts/catalog, вызовы preview/export и tests; сверка синтаксиса CSS API v2 с первичной документацией                                                                     | Не загружались все семьи каталога; фактическая доступность каждой гарнитуры/варианта и offline rendering не подтверждены |
| Contrast/color        | Полное чтение функций и проверяемых пар; unit tests; traced текущая light/dark palette                                                                                               | Нет WCAG-аудита произвольной пользовательской темы; threshold 3:1 — установленная продуктовая эвристика                  |
| Preview               | Прочитаны Vue-разметка и CSS, просмотрены структура/локализация demoContent; sampled assets, computed styles и Aegea variables/layout                                                | Не построчное сравнение всего demo prose и полного renderer Aegea; нет pixel diff и всех состояний движка                |
| UI/a11y               | Прочитаны все локальные UI adapters, ThemeControls, RangeControlField, PresetSelector, FieldLock/GroupLock; AX/DOM, labels, disabled/errors, menu/dialog, Escape/focus, radio groups | Нет screen reader, Safari/Firefox/touch, OS zoom; не проверены все keyboard-trap permutations и clipboard-denial         |
| Responsive            | Chrome на 1680, 1280, 768, 641, 375 px; DOM geometry, screenshot, клавиатурный resize                                                                                                | Browser zoom 200% отдельно не проверен; 641 px header требует дополнительной полировки (см. open questions)              |
| i18n                  | index, паритет ключей unit tests, просмотр обеих locale maps; RU/EN переключение, lang и reload                                                                                      | Не редакторская вычитка каждой фразы; названия семейств шрифтов намеренно не переводятся                                 |
| DX/release            | Scripts, configs, CI/Pages, lock versions, release docs, пять npm checks                                                                                                             | Не `npm ci`, не Node22/Linux, не security/advisory scan dependencies и не реальный Pages deploy                          |
| GitHub                | Чтение prompt, remote commit и `issues?state=all&per_page=100` (пустой массив)                                                                                                       | Нет релевантных Issues для corroboration; статус branch protection и live workflows не проверялся                        |

Непрочитанное/непроверенное: весь транзитивный dependency source, все тестовые тела построчно (полностью разобраны прежде всего serialize/storage/css/themeInfo/zip), полный Aegea engine, binary demo GIF, весь внешний каталог Google Fonts и сетевые font responses, live production. Большой compiled Aegea core использован только для определения версии; это не security review Aegea.

### 2.4. Журнал проверок

`$AUDIT_TMP/project` ниже обозначает изолированную копию, не исходное дерево. Никаких machine-local путей и секретов в отчёте нет.

| Команда/действие                                                                                     | Результат                                  | Evidence и предел                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git status --short --untracked-files=all`, `git rev-parse HEAD`, `git branch --show-current`        | PASS                                       | Baseline выше; исходные два изменения сохранены                                                                                                     |
| `npm test` в копии                                                                                   | FAIL, exit 1                               | 99 tests, 98 pass, 1 fail: `saves and loads a valid session`, storage.test.js:36                                                                    |
| `npm run lint`                                                                                       | FAIL, exit 1                               | Одна prettier/prettier ошибка, PresetSelector.vue:43                                                                                                |
| `npm run lint:styles`                                                                                | FAIL, exit 2                               | Семь ошибок App.css:11,16,127,132,143,144                                                                                                           |
| `npm run format:check`                                                                               | FAIL, exit 1                               | Только PresetSelector.vue в исходном наборе файлов                                                                                                  |
| `npm run build`                                                                                      | PASS                                       | Vite 6.4.3: 682 modules, CSS 89.07 kB (gzip 12.70), JS 323.87 kB (gzip 107.75); два предупреждения PURE comments из @vueuse/core; ошибки сборки нет |
| Повтор test/lint/styles/format с фиксацией exit codes                                                | FAIL, те же результаты                     | Нужен был для однозначного статуса отдельных commands в первоначальной shell-последовательности                                                     |
| `npm run preview -- --host 127.0.0.1 --port 4179 --strictPort`                                       | PASS после разрешённого запуска loopback   | Первая sandbox-попытка EPERM; второй запуск работал. Это не app defect                                                                              |
| Synthetic Node reproduction: deserialize/decode/loadSession → metadata gate → generateThemeZip/unzip | FAIL контракт, PASS воспроизведение F01    | CSS marker и `missing-parent` сохранены, metadata errors `{}`; code ниже                                                                            |
| PostCSS parse сгенерированного CSS                                                                   | PASS воспроизведение F01                   | Top-level rules `[':root', 'body', ':root']`, следовательно marker — настоящее правило CSS                                                          |
| Chrome URL import → Download ZIP → чтение скачанного архива                                          | FAIL контракт, PASS воспроизведение F01    | Кнопка enabled, field errors отсутствуют; архив имеет `my-theme/theme-info.php` и `my-theme/styles/main.css`, содержит marker и неверный parent     |
| Browser file chooser JSON import                                                                     | NOT RUN до конца                           | Расширению не разрешён доступ к file URLs; настройки не менялись. Это ограничение инструмента, не дефект Selecta                                    |
| Browser download event ожидание                                                                      | FAIL инструмента, результат проверен иначе | API ожидания timeout, но файл фактически скачался; его проверили по синтетическому имени/содержимому и переместили во временную evidence-папку      |
| Random: 500 samples, LCG seed=1701                                                                   | PASS в выборке                             | Для light и dark 0 наборов с warnings; это не гарантия для всех seeds/locks                                                                         |
| Chrome default assets                                                                                | PASS                                       | Четыре изображения loaded с корректным `/Selecta/preview/` prefix                                                                                   |
| Chrome shell/preview modes                                                                           | PASS в выбранных комбинациях               | Light preview + dark shell и dark preview + light shell независимы; dark theme включает supportsDarkMode                                            |
| Reset: open → Escape/Cancel; confirm                                                                 | PASS                                       | Cancel не сбрасывает; focus возвращается к Reset; confirm возвращает My Theme                                                                       |
| Metadata input empty                                                                                 | PASS                                       | ZIP disabled, `aria-invalid=true`, связанный error ID, локализованные ошибки обоих обязательных полей                                               |
| Share menu open/Escape                                                                               | PASS                                       | Два menuitem, меню закрывается; copy/tooltip success/error полностью не прогонялись                                                                 |
| Chrome resize 1280 → 768 + ArrowRight ×16                                                            | FAIL                                       | Sidebar 672 px, preview 88 px, aria-valuemax 672                                                                                                    |
| Chrome 375 px                                                                                        | PASS в выбранном состоянии                 | document scrollWidth=375, ZIP action в viewport; не общий сертификат mobile/a11y                                                                    |
| Chrome обычный reload после autosave                                                                 | PASS                                       | `Audit saved baseline`, язык ru и theme mode восстановлены                                                                                          |
| Chrome fill `Audit fast edit` → немедленный reload                                                   | FAIL                                       | Осталось `Audit saved baseline`; повторяет ранее наблюдавшуюся потерю ввода                                                                         |
| `php --version`, запрос baseline Git object Aegea                                                    | BLOCKED/FAIL среды                         | PHP dyld/libzip; baseline object отсутствует. PHP lint/install — NOT RUN                                                                            |
| SHA-256 всех tracked файлов против начального снимка                                                 | PASS                                       | Ни один tracked файл не изменился за исследование                                                                                                   |

## 3. Findings

### F01 — Недостаточная проверка значений на входе превращает JSON/URL в произвольный CSS экспорт

**Severity: Medium. Confidence: высокая.**

**Места:** `src/theme/serialize.js:18–23` (`copyKnownSection`), `src/storage.js:20–29` (`getCompatibleSection`), `src/theme/validation.js:1–15`, `src/theme/css.js:47–50,69–76,93–95`, `src/theme/themeInfo.js:19`; caller `src/components/App/App.vue:50–57,493–516,541–549` на HEAD.

**Контракт:** SPEC §§2–6,8–9,17: тема основана на `plain`, controls имеют определённые типы и размеры; приложение не является редактором произвольного CSS. Import/share должны принимать корректную модель, а ошибка во внешних данных не должна незаметно попасть в ZIP.

**Путь:** `?theme=` → decodeThemeFromUrlParam → deserializeTheme → copyKnownSection → applySharedThemeState → metadataErrors → enabled Download → generateThemeZip → generateThemeCss. File import использует тот же decoder; storage повторяет только `typeof`-проверки. Фильтрация font-family не распространяется на palette/layout/числа/basedOn.

**Минимальное воспроизведение** в копии из её корня (Node 24, установленные зависимости; без сетевых обращений):

```js
import { initialThemeState } from './src/theme/model.js';
import { serializeTheme, deserializeTheme, encodeThemeToUrlParam } from './src/theme/serialize.js';
import { validateMetadata } from './src/theme/validation.js';
import { generateThemeZip } from './src/theme/zip.js';
import { unzipSync, strFromU8 } from 'fflate';

const input = structuredClone(initialThemeState);
input.meta.displayName = 'Audit imported theme';
input.meta.basedOn = 'missing-parent';
input.layout.maxWidth = '48rem; }\nbody { outline: 9px solid rgb(1, 2, 3); }\n:root { --audit-marker: 1';
const accepted = deserializeTheme(serializeTheme(input));
console.log(validateMetadata(accepted.meta)); // {}
const zip = unzipSync(generateThemeZip(accepted));
console.log(strFromU8(zip['my-theme/styles/main.css']));
console.log(encodeThemeToUrlParam(input)); // передать URLSearchParams.set('theme', ...)
```

Ожидается отказ от неподдерживаемого parent и значения длины/структуры CSS. Фактически ZIP содержит top-level `body { outline: ... }`, `based_on => missing-parent`, ошибок интерфейса нет. Browser URL → реальный скачанный ZIP подтвердил достижимость; standalone helper — не единственное evidence. Само preview не показало outline body, поэтому опасный экспорт не обязательно заметен визуально.

Другие проявления того же отсутствия value schema:

- `typography.titleScale` с JSON literal `1e999` проходит как `number`, результат — `Infinity`; при следующем serialize становится `null`, и такой экспорт уже нельзя нормально deserialize. Допустимые UI-границы обойдены.
- Неверные цветовые строки/alpha-форматы не проверяются, хотя parseHexColor понимает только 3/6 hex; проверка контраста может оперировать NaN или игнорировать alpha.
- Изменённый `basedOn` уходит в PHP, несмотря на неизменный plain-preview. Aegea-source `system/core/olba.php:18–69` действительно следует parent-chain. Для отсутствующего parent есть fallback, поэтому нельзя утверждать, что любой неверный parent обязательно ломает сайт; сам выход за контракт подтверждён. Циклы parent-chain на живом движке не исполнялись.

**Влияние/охват:** пользователь, открывший чужую тему по ссылке/JSON и установивший экспорт, может получить непредусмотренные CSS-правила и другой результат. Вредный payload не создаётся обычным slider/color UI. Вероятность ограничена недоверенными или вручную изменёнными payloads; последствия зависят от установки темы. XSS, исполнение PHP/JS, кража данных или компрометация сервера в этом аудите **не доказаны**; severity не повышена до High.

**False-positive checks:** путь не требует редактирования app source или вызова helper из devtools; browser Download использует только metadata guard. PHP quotes экранируются, ZIP path traversal через `folderName` блокирует настоящий caller. Безопасная обработка font-family и Vue DOM style не защищают текстовый CSS export.

**Минимальное направление:** единая проверка допустимых значений на trust boundaries для JSON/URL/storage; enforce `basedOn=plain`, конечные числа, согласованные единицы/границы и канонические цвета. Повторная проверка перед export либо доказанный invariant валидной модели. Не достаточно strip `;` в одном поле.

**Проверка исправления:** воспроизведение выше должно завершаться понятной ошибкой до изменения текущей темы/ZIP; обычные Unicode metadata, обе палитры, все presets и Google/system fonts должны round-trip. Проверить literal `1e999`, отрицательные/нулевые и чрезмерные размеры, 8-digit/invalid colors, неизвестные parent; сопоставить UI и файл после accepted import.

### F02 — Режим шрифта plain не соответствует Aegea 11.5 в preview

**Severity: Medium. Confidence: высокая для расхождения, установленный сайт не проверен.**

**Места:** `src/components/AegeaPreview/AegeaPreview.css:8–9,19,256–260`; `src/theme/fonts.js:91–94`, `src/theme/css.js:66–68`; `PREVIEW-BASELINE.md:3–20`.

**Контракт:** пользователь выбирает «Plain (Aegea default)» / «Как в родительской теме»; PREVIEW-BASELINE задаёт Aegea 11.5/v4199 и откладывает 12.0a с bundled Inter. SPEC требует preview, близкое к установленной теме.

**Сценарий:** Reset; обе font source = plain. В Chrome computed font-family у preview и note text — `InterVariable, sans-serif`. В проекте нет @font-face для InterVariable; при таком source нет и Google Fonts link/import. Export намеренно не задаёт mainFontFamily — Aegea наследует свой `plain`.

В прочитанной Aegea 11.5 `system/themes/plain/src/styles/variables.scss:115–117` main stack начинается с `system-ui, -apple-system, BlinkMacSystemFont, "SF UI Text", "Segoe UI", ...`; note font наследуется. Это другой стек, и он не равен `InterVariable, sans-serif` При отсутствии локально установленного InterVariable браузер выберет generic sans-serif; фактическое имя rasterized font отдельно не извлекалось.

**Влияние:** основной default-сценарий показывает другие метрики/переносы и визуальный характер шрифта; пользователь выбирает масштаб/ширину по неточному образцу. Особенно вероятно на системах, где generic sans-serif и UI font различаются.

**Альтернативы:** явные system/google font overrides генерируют общие значения для preview/export и обходят этот конкретный дефект. Выбор будущей Aegea 12.0a не оправдывает drift: текущий документ фиксирует 11.5; да и Inter в preview не поставляется. Это не требование bundled fonts и не требование pixel-perfect всего preview.

**Минимальное направление:** привести plain fallback preview к зафиксированному release target и документировать выбранный baseline. Проверить computed styles и сравнительный образец одного текста в установленной дочерней теме 11.5; потом отдельно явные system/google sources и обе локали. Не менять экспорт на принудительный Inter для маскировки ошибки.

### F03 — Ограничение ширины панели не пересчитывается после resize окна

**Severity: Medium. Confidence: высокая.**

**Места:** `src/components/App/App.vue:111–115,128–132,149–150` (`effectiveControlsPaneMaxWidth`, `getConstrainedControlsPaneWidth`), `src/components/App/App.css:58–62,162–207`.

**Контракт:** SPEC §12 и код `previewPaneMinWidth=360` предусматривают usable responsive preview и ограниченную ширину controls.

**Сценарий/результат:** открыть в Chrome при 1280 px, затем сузить до 768 px (desktop split ещё активен). Focus separator, ArrowRight 16 раз. DOM measurement: controls=672, preview=88, `aria-valuemax=672`. Ожидается актуальный предел около 400 px с учётом resizer 8 px и preview не уже 360 px, когда суммарные минимумы помещаются.

`computed` читает element rect/window.innerWidth, но у него нет реактивной зависимости от размеров. Vue кэширует результат, DOM resize его не инвалидирует. Уже выбранная ширина тоже не reclamp при сужении. Даже формула `appWidth - previewPaneMinWidth` не вычитает 8 px separator; это часть того же расчёта available width.

**Влияние:** при изменении размера окна или возвращении из mobile в desktop layout рабочее preview может почти исчезнуть. Восстанавливается ручным уменьшением панели/reload; это не потеря theme state.

**False-positive checks:** использован настоящий keyboard-handler, не мутация CSS через devtools; screenshot/geometry подтверждают эффект. При 375 px работает другой stacked layout, поэтому дефект не означает поломку всей mobile-версии.

**Минимальное направление:** реактивно измерять workspace, пересчитывать максимум с учётом separator и reclamp текущую ширину при изменении available space. Проверить drag и клавиатуру на 1280 → 768 → 1280, а также mobile → desktop и restore сохранённой ширины; ARIA max/now должны совпадать с реальными пределами.

### F04 — Текущий локальный срез не проходит обязательный quality gate

**Severity: Medium. Confidence: высокая локально; CI runner не запускался.**

**Места:** `src/storage.test.js:36–63`, `src/storage.js:64–77`; `src/components/PresetSelector/PresetSelector.vue:43–47`; `src/components/App/App.css:11,16,127–145`; `.github/workflows/ci.yml:27–49`.

**Контракт:** README/RELEASE/AGENTS и CI требуют прохождения test/lint/stylelint/format/build. Полный журнал команд приведён выше.

1. `saves and loads a valid session` использует `shellAppearance: 'system'`, current validator разрешает только light/dark; ожидает объект, получает null. Это **устаревшее ожидание теста**, а не установленный дефект миграции: PROGRESS:488–491,528–534 прямо говорит игнорировать старые system/missing sessions. Не надо возвращать system или миграцию вопреки принятому решению только ради зелёного теста.
2. PresetSelector multiline Field props нарушают текущий Prettier, ломая одновременно eslint и format:check.
3. Stylelint не принимает Vue `:global` в отдельно лежащем App.css; дополнительно сообщает descending specificity, повтор download-error, deprecated clip и order. Vue compiler при этом понимает :global, так что эти сообщения не доказывают неисправность overlay runtime.

**Влияние:** невозможно получить зелёный текущий check suite; ошибки затрудняют отделение новой регрессии от известного фона. Конкретный эффект branch protection неизвестен. Запуск на Node24/Mac не подменяет CI Node22/Linux, но перечисленные причины непосредственно следуют из файлов и воспроизводятся.

**False-positive checks:** сравнение SHA-256 подтвердило неизменность оригиналов, проверки без --fix. Файлы с ошибками, включая stale test, совпадают с HEAD; чужой root-theme diff не является причиной.

**Минимальное направление:** обновить тест под утверждённую session-политику и добавить valid light/dark case; минимально согласовать формат и lint configuration для Vue scoped external styles; исправить реально дублированные/несогласованные declarations. Затем все пять существующих команд на поддерживаемой среде. Это не основание переписывать компонентную архитектуру.

### F05 — Последняя правка теряется при немедленном reload

**Severity: Low. Confidence: высокая.**

**Места:** `src/components/App/App.vue:116,567–590` (WT:571–595), `sessionSaveDelay`, deep watcher; `src/storage.js:101–118`.

**Контракт:** текущий продукт обещает session restore (PROGRESS current state, CHANGELOG 0.4.0). Отсутствует сообщение, что свежая правка ещё не сохранена.

**Воспроизведение в Chrome:** ввести `Audit saved baseline`, дать debounce завершиться; reload восстанавливает это имя. Ввести `Audit fast edit` и сразу reload; восстанавливается `Audit saved baseline`. Ранее в том же прогоне аналогично вместо нового имени вернулось `My Theme`.

**Причина:** любое изменение лишь перезапускает timeout на 500 ms; нет flush на уходе со страницы. Unmount чистит feedback timer, но не сохраняет/обрабатывает pending session timer. Потеря при быстрой навигации/закрытии следует из этого же пути; отдельно закрытие вкладки не воспроизводилось.

**Влияние/вероятность:** узкое временное окно; теряются последние изменения, не весь ранее сохранённый результат. Поэтому Low. Обычный reload после debounce работает, quota error и системный storage failure для этого сценария не требуются.

**Минимальное направление:** сохранить debounce для частого ввода, но добавить flush последнего корректного состояния при подходящем lifecycle/page event; cleanup таймера на unmount. Проверить быстрый reload/Back/закрытие после ввода, preset/import и Reset, не возвращая старое состояние после сброса. No-crash при недоступном localStorage должен сохраниться.

## 4. Architecture observations и documentation drift

- Декомпозиция theme helpers / App orchestration / ThemeControls / preview / UI adapters подходит масштабу проекта. Reactivity концентрируется в App; export и preview используют общий derivation. Полный rewrite, TypeScript или backend не нужны.
- Два независимых слоя действительно сохранены: theme variables ставятся на preview; shell использует hb tokens. Чужой перенос color scheme на root обслуживает portal; выбранные browser cases не показали изменения preview palette от Interface toggle. Это наблюдение о WT, не утверждение о чистом HEAD.
- Две почти одинаковые схемы `copyKnownSection` и `getCompatibleSection` уже расходятся по политике UI compatibility и вместе пропускают semantic values. Общая boundary schema — локальное улучшение, а не новый framework.
- `AGENTS.md`/SPEC содержат исторические MVP-запреты на presets, Google Fonts, dark mode, i18n, импорт. CHANGELOG и PROGRESS обосновывают эти реализованные расширения: сами расширения не являются findings.
- UI-ARCHITECTURE всё ещё содержит запрет на adoption чужой design system в MVP, тогда как PROGRESS описывает завершённый hvab-blocks track. Приоритет текущего этапа понятен, но история смешана с действующими указаниями.
- PROGRESS называет 0.8.0 prepared, CHANGELOG уже содержит выпуск; IDEAS сохраняет dark-mode/i18n как unchecked. Это drift документов, не доказанный runtime bug. Местами исторические списки команд помечены pass, текущие проверки иные — результаты прошлых этапов не нужно считать ложью автоматически.
- Prompt перечисляет старые `src/App.vue`/`src/preview/`; текущая структура перенесена в `src/components/App/` и `src/components/AegeaPreview/`. Audit следовал реальному дереву.
- Pages workflow запускает свой build независимо от CI checks. На текущем коде build успешен при красных checks, поэтому зелёная публикация не означала бы прохождения quality gate. Реальный deployment/branch protection не исследованы; workflow не запускался.
- RELEASE проверяет чистое дерево до bump, а пример использует npm version. Непроверенная свежая установка из lockfile остаётся важной release-проверкой: не делать из локального node_modules обещание воспроизводимости.

## 5. Hypotheses / open questions

Эти пункты не входят в подтверждённые findings и не должны незаметно превратиться в implementation scope.

1. **Race file import ↔ Reset/повторный import.** `importThemeJson` HEAD:493–507 await-ит file.text без generation token, loading/disable или отмены. Старый read может примениться после более нового действия. Нужен controlled delayed File.text в временном harness и последовательности A → B, A → Reset, A → manual edit. Browser upload был недоступен; race runtime не воспроизведён.
2. **Размер payloads.** Нет лимита file.size/URL length/metadata length. Потенциально большие JSON, synchronous ZIP и encodeURIComponent/btoa могут заморозить UI. Проверить временные 1/5/20 MB synthetic inputs и измерить main-thread delay/ошибки, прежде чем назначать severity/порог.
3. **Aegea responsive parity.** Preview media queries работают по viewport редактора, а не по ширине preview-pane; дополнительно content margins меняются на фиксированный 1rem при 48rem, тогда как Aegea compact layout использует свои variables. Нужен paired preview/installed-theme test при одинаковой фактической ширине и marginals. Это шире доказанного F03; полный responsive mismatch не измерялся.
4. **Header 641 px/RU.** Screenshot показывает тесное расположение brand и controls чуть выше mobile breakpoint. ZIP остаётся видимым; при 375 px переполнения нет. Следующий шаг — bounding-box overlap и 200% zoom с длинными строками, затем отделить функциональную недоступность от визуального polish.
5. **Google Fonts network/catalog.** CSS API v2 syntax соответствует [официальной спецификации](https://developers.google.com/fonts/docs/css2) (документ last updated 2024-07-23, прочитан 2026-10-03): сортировка ital,wght/tuples, несколько family и display=swap. Это не доказательство, что каждый snapshot family/variant поддерживается сейчас. Нужны реальные ответы выбранных families, offline/slow network и fallback screenshots. Расширение каталога не требуется.
6. **History.** URL parameter очищается через replaceState после удачного/неудачного startup import; это предотвращает повторное применение при reload, но не обеспечивает undo между импортами. Нет подтверждённого требования делать из Back/Forward историю тем. Отдельно проверить два share URLs и browser history, не объявляя отсутствие router дефектом.
7. **Contrast edge cases.** 3:1 и сравнение hue — сознательная эвристика, а не обещание WCAG AA для любого текста. Mark в заголовке наследует headings color, предупреждение смотрит foreground; фактические комбинации на marked headings требуют отдельной оценки. Невалидный цвет/alpha из внешних данных относится к F01.

## 6. Что сохранять

- ZIP состоит из папки темы и двух UTF-8 файлов, проверено unzip; Unicode displayName проходит JSON/URL/ZIP. Ограниченный slug path блокирует traversal в UI-export caller. Не расширять path syntax без необходимости.
- PHP single-quoted strings экранируют backslash/quote; проверены tests и synthetic output. PHP runtime lint отдельно недоступен. Нет основания называть template генератор PHP-инъекцией.
- Dark export использует реальный путь `@media (prefers-color-scheme: dark) { :root .e2-responds-to-dark-mode { ... } }`; metadata colors берутся из light palette. Эти свойства согласованы с просмотренным Aegea 11.5 contract.
- Язык, shell appearance, locks и viewport не входят в theme JSON/share; unknown theme fields отбрасываются. Session localStorage exceptions ловятся. Полезные trust-boundary checks уже есть — их нужно дополнить values, не удалить.
- Native controls имеют labels/accessible names, metadata errors связаны через aria-describedby, ZIP disabled; Reka даёт dialog/menu поведение. Не заменять primitives самодельными overlays из-за найденных stylelint ошибок.
- Static demo HTML/SVG — локальные константы; пользовательские metadata не идут в v-html. Не утверждать XSS только из-за наличия v-html.
- Random/locks, Google/system font pairing, каталог с категориями и shared font URL helper имеют существующее тестовое покрытие. 500 дополнительных samples не дали contrast warnings; ограничения locks/retry budget сохраняются.
- Осознанные исключения: old system sessions игнорируются, unsupported serialization version отвергается, plain-only child themes, remote Google Fonts без bundled файлов, отсутствие backend, галереи, полного renderer и установки в один клик. Аудит не требует расширения scope.

## 7. Направления remediation для независимой проверки

1. Сначала проверить F01 на JSON, URL и storage с тем же payload, затем согласовать минимальную semantic schema и regression scenarios. Отдельно решить допустимые единицы/цвета, чтобы не потерять поддерживаемые custom system stacks и валидные presets.
2. Восстановить зелёные checks по F04, не отменяя явно принятую политику system-сессий. Выполнить их на Node22/Linux и чистом lockfile install в разрешённой среде; исходный checkout с чужими правками для этого не использовать.
3. Исправления F02 и F03 независимы: первое требует сверки Aegea baseline и установленной темы, второе — layout measurement, separator и viewport transitions. Они не требуют изменения формата theme JSON.
4. F05 — небольшой отдельный lifecycle шаг с проверкой, что flush не восстанавливает старую тему после Reset. Проверку import race выполнить до изменения того же участка async/state orchestration, чтобы не смешать подтверждённый debounce defect и гипотезу.
5. После этого пройти configure → preview → ZIP → реальная Aegea 11.5 для light/dark, plain/system/одного Google font, RU/EN, desktop/mobile. Успешные unit tests и screenshot редактора не заменяют последнюю стадию.

Ни одно направление не реализовано. Issues, PR, release и deployment этим аудитом не создавались. Следующий проход Sol должен работать отдельно и учитывать отличия local baseline от remote main.
