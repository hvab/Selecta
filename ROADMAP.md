# Post-MVP roadmap

Источник приоритетов после завершения MVP и этапа 8 (расширенное Aegea-превью).

Требования по смыслу — в `SPEC.md`. Итерации и промты — в `plan.md`. Этот файл фиксирует **порядок** следующих фич и целевые минор-релизы.

**Текущая база:** Выпущена версия `0.5.0` (включая контраст, сохранение сессии, пресеты, JSON-экспорт и URL state).

## Принципы

- Маленькие этапы: одна фича или связанный срез за итерацию.
- Превью и экспорт по-прежнему из одной модели темы.
- Пользовательский UI — только на английском (без i18n-инфраструктуры, пока не дойдём до отдельного этапа).
- Неблокирующие предупреждения (контраст) не мешают скачиванию ZIP.

## Порядок релизов

| Этап | Целевая версия        | Фокус                                                           |
| ---- | --------------------- | --------------------------------------------------------------- |
| 9    | `0.3.0` ✅            | Контраст + фиксация полей для Random                            |
| 10.0 | `0.4.0` ✅            | Сохранение сессии в localStorage + Reset                        |
| 10.1 | `0.4.0` ✅            | Пресеты из официальных тем Aegea                                |
| 11   | `0.5.0` ✅            | URL state + JSON export/import                                  |
| 12   | `0.6.0`               | Google Fonts                                                    |
| 13+  | по мере необходимости | Контракт темы, версии Aegea, глубокое превью                    |
| —    | позже                 | Тёмный режим, bundled кириллические шрифты, импорт тем, i18n UI |

---

## Этап 9 — Контраст и фиксация полей (`0.3.0`)

**Зачем раньше остального:** Random уже в продукте; без контраста и без «закрепления» полей случайная генерация часто даёт нечитаемые палитры и сбрасывает то, что пользователь уже подобрал.

### 9.1 Предупреждения о контрасте

Неблокирующие подсказки по `SPEC.md` §15:

- читаемость основного текста на фоне;
- ссылки (обычные и visited);
- заметность hover;
- вторичный / tag-текст;
- поля ввода (фон и текст);
- одинаковые цвета там, где состояния должны различаться.

Не блокировать Download. Пороги и формулы — в отдельном модуле (тестируемо без UI).

### 9.2 Фиксация полей (lock) для Random

- У каждого редактируемого поля (или у логической группы — уточнить при реализации) — переключатель «зафиксировано».
- **Random** меняет только **незафиксированные** поля; зафиксированные значения сохраняются.
- Состояние lock — часть UI-сессии; в MVP-экспорт ZIP lock не попадает (только значения темы).
- При необходимости: «Unlock all» / сброс всех lock одной кнопкой.

Связка с Random: доработать `getRandomThemeState` / `randomizeTheme` так, чтобы учитывать маску locked-полей, а не полную замену `meta` / `palette` / `typography` / `layout`.

### 9.3 Проверка этапа

- `npm test` — контраст и random+locks;
- вручную: зафиксировать 2–3 цвета → Random → значения на месте; снять lock → снова меняются;
- предупреждения видны на заведомо плохой палитре, ZIP всё ещё скачивается.

---

## Этап 10.0 — Сохранение сессии (`0.4.0`)

Пользователь не теряет работу при перезагрузке и может сбросить к дефолту.

- `src/storage.js`: `saveSession` / `loadSession` / `clearSession`; обёрнуты в try/catch; хранят `themeState + fieldLocks + uiState` с `version: 1`.
- Ширина левой панели — реактивный ref, персистится в `uiState.sidebarWidth`.
- `App.vue`: загрузка на mount, debounced watch → save.
- Кнопка **"Reset to defaults"**: clearSession + возврат к `initialThemeState`.

Этот этап строит инфраструктуру сериализации, которую переиспользуют пресеты (10.1) и этап 11.

---

## Этап 10.1 — Пресеты из тем Aegea (`0.4.0`)

Пользователь выбирает официальный стиль Aegea как стартовую точку.

- 10 пресетов из `system/themes/` Aegea: `plain` (дефолт), `vulcano`, `fiesta`, `douglas`, `chancery`, `acute`, `gal`, `vox`, `kolomna`, `holm`. `embeddable` не включать.
- `src/theme/presets.js`: статический массив `{ id, label, palette, typography, layout }`.
- `PresetSelector.vue`: нативный `<select>`, компактный, в духе остального UI.
- Применение: заменяет palette + typography + layout; meta остаётся; fieldLocks сбрасываются.
- Темы Aegea не переопределяют шрифты и layout → typography/layout всех пресетов = `initialThemeState`.
- `gal` (`based_on: acute`) — генерируется как `plain`-child с gal-палитрой.

Подробные чекбоксы реализации — в `plan.md`.

---

## Этап 11 — Сохранение и обмен (`0.5.0`)

Порядок внутри этапа:

1. `src/theme/serialize.js` — `serializeTheme` / `deserializeTheme` с `version: 1`; тест-покрытие.
2. URL share: `?theme=<base64url(JSON)>`; при загрузке имеет приоритет над localStorage.
3. JSON export: кнопка "Export JSON" → `<folderName>.selecta.json`.
4. JSON import: кнопка "Import JSON" → file input → apply; inline ошибка при невалидном JSON.

`fieldLocks` и `uiState` в URL/JSON формат **не входят** (только `themeState`).

---

## Этап 12 — Google Fonts (`0.6.0`)

Цель: пользователь выбирает Google Fonts для interface font и note text font, видит результат в превью и получает Aegea ZIP с явным внешним подключением Google Fonts.

Контекст Aegea:

- Текущий `plain` задаёт `--mainFontFamily: "InterVariable", sans-serif`, `--noteMainFontFamily: inherit`, `--smallFontFamily: inherit`.
- `plain` поставляет Inter normal/italic variable и JetBrains Mono regular; code/`tt`/`pre` остаются за JetBrains Mono и в Selecta на этом этапе не редактируются.
- Большинство встроенных тем наследует font-переменные от `plain`, но есть исключения: `chancery` меняет main/note/small, `holm` меняет main/note, `kolomna` меняет note.
- В проверенном markup/CSS нет отдельного обязательного состояния `700 italic`: Aegea использует regular, bold и italic как отдельные состояния.

Контракт этапа:

- Подключение только через Google Fonts CSS API; шрифтовые файлы в ZIP не складываем.
- В `styles/main.css` генерируем минимальный `@import` перед `:root`, только для реально выбранных Google Fonts.
- Запрашиваем только нужные начертания: regular `400`, bold `700`, italic `400 italic`, если они доступны у выбранного семейства.
- Если выбран один Google Font для interface и note text, в CSS API он должен быть запрошен один раз.
- Каталог в UI строится из metadata snapshot, а не из runtime-запроса с API key.
- Фильтр **Cyrillic only** включён по умолчанию и показывает семейства с `cyrillic` subset; пользователь может отключить фильтр и увидеть весь каталог.
- У каждого редактируемого font slot есть source: `plain` (не переопределять Aegea), `system` (явный system stack), `google` (выбранное Google family).
- Без bundled open-source кириллических файлов на этом этапе.

Порядок внутри этапа:

1. Stage 12.1 — typography source model:
   - добавить `mainFontSource` и `noteFontSource`;
   - `plain` source не генерирует `--mainFontFamily` / `--noteMainFontFamily`, а наследует `plain`;
   - старые JSON/URL/localStorage без source-полей мигрировать: пустой family → `plain`, непустой family → `system`.
2. Stage 12.2 — Aegea font preset reconciliation:
   - обновить пресеты `chancery`, `holm`, `kolomna`, чтобы они отражали реальные font-переопределения Aegea;
   - решить, нужно ли показывать inherited `plain` font state в UI как явный режим.
3. Stage 12.3 — Google Fonts catalog core:
   - `src/theme/googleFontsCatalog.js` — статический metadata snapshot: `family`, `category`, `subsets`, `variants`, optional `axes`; документировать источник и дату обновления;
   - `src/theme/googleFonts.js` — чистые функции:
     - фильтрация по `cyrillic`;
     - поиск по названию и категории;
     - вычисление доступных style tuples для `400`, `700`, `400 italic`;
     - генерация CSS2 URL с `display=swap`.
4. Stage 12.4 — UI font picker:
   - заменить свободный ввод на picker с режимами Plain default / System stack / Google Font;
   - в списке показывать короткий preview sample для видимых результатов, не грузить весь каталог сразу.
5. Stage 12.5 — Preview/export:
   - в генераторе подгружать выбранные Google Fonts для live preview;
   - в `generateThemeCss` добавлять `@import` только при выбранных Google Fonts;
   - в JSON/URL сериализацию включать выбранный font source как часть `typography`.
6. Stage 12.6 — Ручная проверка:
   - кириллический фильтр по умолчанию скрывает латиницу-only семейства;
   - выбранный кириллический шрифт виден в Aegea preview на русском sample text;
   - ZIP содержит только `@import` + CSS variables, без font files;
   - при одинаковом font family для обоих полей запрос не дублируется.

---

## Этап 13+ — Контракт темы и превью

Делать по конкретной боли, не «на всякий случай»:

- расширение theme contract: шапка, blog title, logo/userpic, compact layout, follow/search/admin/menu — сейчас частично только в preview;
- выбор целевой версии Aegea для превью и генерации;
- глубокие состояния превью (полная форма комментария, admin, sharing, author-only, полный `plain/styles/main.css`) — только если превью врёт в реальной установке.

---

## Отложено (backlog без целевой версии)

| Фича                                                                | Примечание                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Тёмный режим                                                        | Отдельная палитра + UX; после стабильного светлого пайплайна |
| Кириллические open-source шрифты в ZIP                              | Bundled files, лицензии                                      |
| Импорт существующих тем                                             | Парсинг чужого `main.css`                                    |
| i18n UI (русский и др.)                                             | Инфраструктура + копирайт                                    |
| Visual diff, галерея тем, arbitrary CSS editor, GitHub-ready export | Вне ближайших релизов                                        |

---

## Сопровождение (параллельно любому этапу)

- Чеклист в `PREVIEW-BASELINE.md` при обновлении Aegea.
- Релизы по `RELEASE.md`: changelog, тег, GitHub Pages.

## Следующий шаг по репозиторию

Этап 11 полностью завершён. Следующий: **этап 12** (Google Fonts).
