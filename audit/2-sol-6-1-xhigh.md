# Selecta — независимая проверка Astra и план исправлений (Sol 6.1 xhigh)

Дата: 2026-10-03. Проверяемый объект — локальный working tree на `3df22e0167c773a04bdefcb69c722e112068efcc`, branch `main`. Режим исследования: verification-and-planning-only. Исправления из плана не выполнялись.

## 1. Executive summary и baseline drift

Результат проверки пяти записей [Astra](./1-astra-xhigh.md): **Confirmed — 5; Partially confirmed — 0; Rejected — 0; Cannot verify — 0**. Все пять остаются актуальными. F02 понижен с Medium до Low: несовпадение CSS-стеков доказано, но масштаб визуального ущерба не измерен. Добавлен **N01, Low** — после Reset уже исходной темы первая отдельная правка может вообще не попасть в autosave, независимо от ожидания 500 ms.

Очищенный реестр содержит **6 проблем: 3 Medium и 3 Low**. План содержит **5 основных remediation items**, без P0; отдельно предусмотрены **4 verification experiments**, которые не разрешают реализацию гипотез заранее. Основные приоритеты — доверенные границы модели и работающий quality gate, затем responsive sizing и сохранение, затем font parity.

Ни исполнение PHP/JS, ни XSS, ни компрометация сервера не установлены. F01 подтверждает произвольный CSS в скачанном ZIP и неверный parent, а также принятие Infinity. F04 подтверждает красные проверки, но не дефект миграции `system`. Отсутствие live Aegea и точного baseline Git object остаётся ограничением обоих проходов.

### Зафиксированная база

- Начало повторного снимка: **08:31:34 UTC**, 2026-10-03.
- Astra baseline SHA и текущий HEAD совпадают: `3df22e0167c773a04bdefcb69c722e112068efcc`.
- Начальный status: ` M .project/PROGRESS.md`, ` M src/components/App/App.vue`, `?? audit/1-astra-xhigh.md`. Index пуст.
- Чужие изменения: PROGRESS +3 строки; App +7/−1, перенос shell color scheme на document root для порталов. Они сохранены. Их логика не изменяет источники F01–F05 или N01.
- SHA-256 App WT: `7fe8c0d3886c39b7acc164b12d7caef0738cd7c1ae691339e185d36df99a1a27`; PROGRESS WT: `8d46367d5eaa66d30280850e6202ba6f389999b9bfbfd0d241ba4b77b22ff142`.
- SHA-256 входного отчёта Astra: `cb90b30a3847a151f2ecd5d03385b5d7be7e4c988096142f5ab839d39cffd0c3`. Отчёт прочитан полностью и не редактировался.
- Сравнение всех **89 tracked файлов** со снимком начала Astra и новым снимком Sol: **0 изменений**. Таким образом, нет already-fixed findings и нет необходимости приписывать различие результатов дрейфу.
- Remote `main`, прочитанный во время исследования: `a95eb2c4df1151a8d9adad5afe3e7919ceef7968`. Это база отдельной публикации audit-документов. Локальный код и remote код не смешивались. Данный отчёт не является аудитом текущего публичного deployment.
- Сохранён подготовленный ранее commit `02f621dddc12f96fa69335fd9c58449255db9e18` с одним Astra-отчётом. Его существование не означает, что push уже состоялся. Последующее явное разрешение владельца касается только публикации двух отчётов в `hvab/Selecta → main`; оно не разрешает выполнять этот remediation plan.

**Нумерация строк:** все ссылки ниже относятся к прочитанному текущему WT. Для App после первого локального добавления строки отличаются от HEAD: `applySharedThemeState` WT 233 / HEAD 229; import WT 497 / HEAD 493; ZIP WT 515 / HEAD 511; watcher WT 576 / HEAD 571. В остальных указанных code-файлах WT совпадает с HEAD. Пути в тексте — относительно репозитория, без machine-local paths.

### Среда и независимость

Darwin 24.6.0 arm64; Node `v24.20.0`; npm `12.0.2`. Vite 6.4.3; Vue 3.5.34; vue-i18n 11.4.5; fflate 0.8.3; hvab-blocks 0.2.0; reka-ui 2.10.1; ESLint 9.39.4; stylelint 17.11.1; Prettier 3.8.3. CI использует Node 22/Linux, который в этом проходе не воспроизведён.

Прочитаны применимые AGENTS/AGENTS.local, README, SPEC, UI-ARCHITECTURE, PREVIEW-BASELINE, PROGRESS, CHANGELOG, RELEASE, package.json, configs и workflows. Проектной `.agents/skills` нет. Исторические MVP-ограничения сопоставлены с поздними принятыми решениями, а не использованы для отмены dark mode, Google Fonts, presets, JSON/URL или i18n.

Создана **новая изолированная копия** текущих tracked файлов и существующего node_modules; node_modules не является ссылкой на исходный checkout. Все пять npm commands выполнены до добавления временного synthetic harness. Не выполнялись install, auto-fix, format-write, изменения dependencies/lockfile или исправления исходников. Браузер проверял новый loopback origin и новую вкладку Chrome. Preview server остановлен, viewport override снят, вкладка закрыта. Синтетический download помещён во временный evidence-каталог, без оставления его в Downloads.

## 2. Verification matrix

Каждый F-ID представлен ровно одной строкой. Confidence относится к доказанному утверждению, а не к непроверенной установке.

| F-ID и исходное утверждение | Исходный severity | Статус | Текущая актуальность | Итоговый severity / confidence | Независимое evidence на текущей базе | Подтверждено, опровергнуто, пределы и false-positive risk | Решение | Canonical / план |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01: значения JSON/URL/storage пропускают CSS injection, другой parent и неограниченные числа | Medium | Confirmed | Still valid | Medium / высокая | serialize.js:18–23,53–54,70–74; storage.js:20–29,66–90; validation.js:1–15; css.js:47–50,69–76,93–95; themeInfo.js:19; App WT:50–57,233–238,497–520,545–551. `node audit-verification.mjs`: четыре ingress routes; PostCSS parse. Новый browser URL → Download ZIP → unzip. | Новый payload использует **margins**, а не maxWidth Astra; настоящий ZIP содержит top-level `.sol-proof` и `sol-missing-parent`, errors=0, Download enabled. JSON literal 1e999 становится Infinity и следующий roundtrip отвергает null. Проверены font fallback, PHP escaping и folder guard: это не PHP/JS injection или traversal в реальном caller. Недоверенный/ручной payload необходим; обычные controls такой CSS не создают. False-positive risk низкий для artifact defect, impact на установленном сайте не измерен. | Исправлять одну semantic boundary schema, объединить проявления | [C01](#c01) → [R01](#r01) |
| F02: plain font preview не совпадает с наследуемым Aegea 11.5 | Medium | Confirmed | Still valid | **Low** / высокая для CSS, средняя для визуального ущерба | AegeaPreview.css:8–9,19,256–260; fonts.js:91–94; css.js:66–68; PREVIEW-BASELINE:3–20. Browser default computed: preview и note `InterVariable, sans-serif`, 0 Google font links. Локальная distribution 11.5/v4199 variables.scss:115–117 содержит system-ui stack. | Реальное расхождение деклараций подтверждено. Не утверждается конкретное rasterized имя, число иных переносов или install failure. Явные system/google overrides обходят этот fallback. Точный baseline object отсутствует, distribution fingerprint записан ниже. False-positive risk низкий для разных CSS-стеков, выше для ожидаемого масштаба внешнего различия. | Исправлять локальный fallback после consumer parity check | [C02](#c02) → [R04](#r04) |
| F03: cached maximum панели не обновляется при resize | Medium | Confirmed | Still valid | Medium / высокая | App WT:128–132,149–150,396–435,737–750; App.css:63–66,159–207. Chrome: 1280 → 768 + ArrowRight ×16, DOM rects и ARIA. | Независимо получено controls=672, resizer=8, preview=88, aria-valuemax=672. Для fresh measurement 768 px сама формула даёт 408, а не 400: separator 8 px не вычтен. Это расчёт по коду, не отдельный browser замер fresh maximum. CSS не обеспечивает preview min-width. Stacked mobile при 375 работает. Ни потеря темы, ни поломка всей mobile-версии не утверждаются. False-positive risk низкий. | Исправлять реактивное измерение и reclamp | [C03](#c03) → [R03](#r03) |
| F04: четыре обязательные проверки падают, build проходит | Medium | Confirmed | Still valid | Medium / высокая локально | storage.test.js:36–63; storage.js:66–77; PROGRESS:488–491,528–535; PresetSelector.vue:43–47; App.css:11,16,127–144; .github/workflows/ci.yml. Все пять scripts заново выполнены в новой копии. | 98/99 tests; 1 JS formatting error; 7 stylelint errors; format только PresetSelector; build PASS. Stale system fixture противоречит принятой политике, а не доказывает сломанную миграцию. Stylelint `:global` не доказывает broken overlay. Node22/Linux/branch protection не проверены. False-positive risk низкий для красных checks, высокий для переноса их в runtime-bug claims. | Исправлять fixture/локальную lint-интеграцию и нарушения, не возвращать system | [C04](#c04) → [R02](#r02) |
| F05: быстрый reload до debounce теряет последнюю правку | Low | Confirmed | Still valid | Low / высокая | App WT:115–118,571–595; storage.js:101–114. Chrome сначала восстанавливает `Sol saved baseline`; затем fill `Sol rapid edit` → reload в одном batch (88 ms) вновь показывает baseline. | Обычный save/reload работает. Подтверждено короткое окно до timeout; закрытие вкладки/Back в этом конкретном временном окне не воспроизводились. Необходимости quota/storage failure нет. N01 добавляет иной, более долгий сценарий, но не меняет причину F05. False-positive risk низкий. | Исправлять в общем persistence slice, отдельно проверить Reset | [C05](#c05) → [R05](#r05) |

## 3. Снятые, пониженные и уже исправленные утверждения

**Полностью Rejected: 0. Already fixed: 0.** Результат не должен искусственно содержать rejected finding только ради adversarial формы. Контрдоказательства сузили scope:

1. **F02 понижен Medium → Low.** Default preview действительно наследует другой стек. При этом Astra не измерила метрики и сама ограничила вывод CSS. Повторная проверка тоже не определяла фактический rasterized font и не сравнивала установленную тему. Это локальный presentation/parity дефект, без доказанной невозможности настройки или установки. Low достаточен при нынешнем evidence.
2. **F01 не превращается в XSS/RCE.** CSS-правило реально выходит из custom property declaration и попадает в ZIP. Metadata строка PHP остаётся экранированной, slug guard защищает настоящий download caller. Vue style bindings не эквивалентны сырому CSS-файлу, поэтому отсутствие rule в preview не снимает F01. Aegea `olba.php:41–44` имеет fallback для отсутствующего parent; нельзя обещать сломанный сайт для любого неизвестного `based_on`. Parent-chain cycle не исполнялся.
3. **F04 — quality gate, не migration regression.** Независимо valid light/dark sessions загрузились; system/missing/old version вернули null. Это следует PROGRESS. Обратная миграция и возвращение system в implementation scope исключены. Тест `saves and loads a valid session` надо привести к текущему контракту.
4. **F03 не требует полного mobile rewrite.** Desktop cache/max и separator budget — доказанные причины. При 375 px document scrollWidth=375, separator скрыт, ZIP bounds полностью в viewport. Общую доступность на всех устройствах этот sample не доказывает.
5. **F05 не означает полную ненадёжность storage.** Сохранение после debounce и reload подтверждены. N01 ниже — отдельный механизм пропуска autosave, который нельзя закрыть только pagehide flush и забыть.

Не установлены необходимость TypeScript/backend, отказ от Reka/hvab-blocks, восстановление исторического MVP, bundled fonts, router/undo или полный перенос Aegea renderer. Эти предложения не входят в план.

## 4. Новое finding и собственное evidence

### N01 — Reset уже исходной темы пропускает первую последующую запись autosave

**Severity: Low. Confidence: высокая. Current validity: Still valid.** Canonical [C06](#c06); основной remediation [R05](#r05).

**Места:** App WT:178–184,334–345,576–594; fieldLocks.js:44–49. На HEAD resetToDefaults:330–341 и watcher:571–590; логика совпадает.

**Контракт:** CHANGELOG 0.4.0 обещает session restore и Reset. Reset должен сохранить defaults и позволять будущим изменениям сохраняться обычным способом. Одно изменение после завершённого reset не является состоянием, которое пользователь просил отбросить.

**Независимый сценарий в Chrome на production build:**

1. Открыть чистый origin: My Theme, все locks false, light theme, OS-derived light Interface.
2. Подтвердить Reset на уже исходной теме.
3. Одним событием ввода заменить Display name на `Sol first edit after reset`.
4. Подождать существенно больше 500 ms; reload возвращает **My Theme / my-theme**.
5. Повторить: сначала Reset возвращает текущую тему к defaults, второй Reset уже ничего в отслеживаемом состоянии не меняет. Затем одним fill ввести `Sol delayed reset regression`.
6. Отсчёт во внешнем audit runtime перед fill и перед reload показал **17 016 ms** ожидания. После reload вновь **My Theme**.

Это не F05: 17 секунд превышают debounce в 34 раза. Обычный subsequent edit после потребления флага сохранялся, что опровергает storage outage как объяснение.

**Причина:** resetToDefaults всегда устанавливает `shouldSkipNextSessionSave = true`. Если все присваивания в resetThemeState и clearAllFieldLocks сохраняют прежние значения, deep watch не запускается. Флаг остаётся true до **следующей пользовательской watched mutation**. Watcher очищает timeout и возвращается, не назначив новый save. Сам Reset синхронно сохраняет defaults, поэтому reload закономерно возвращает их.

**Область воздействия:** первая отдельная mutation после no-op Reset, например paste/replace text, один slider update или выбор цвета. Серия keystrokes или другая watched mutation может затем снова назначить autosave; нельзя утверждать, что весь дальнейший ввод отключён навсегда. Отмена Reset не выполняет resetToDefaults и не воспроизводит этот путь. Дефект узкий, поэтому Low.

**Минимальное направление:** suppression должна завершаться в той же транзакции Reset даже при отсутствии reactive notification; она не должна подавлять следующее пользовательское изменение. Связать Reset, pending save и lifecycle flush в одном ограниченном persistence slice, сохранив их отдельные regression scenarios.

### Независимая трассировка F01

Здесь использована другая входная точка CSS — `layout.margins`, которая дважды выводится как marginLeft/marginRight. Повторение marker в CSS — два последствия одной причины, не два findings.

Минимальный воспроизводимый synthetic пример из корня изолированной копии:

```js
import { initialThemeState } from './src/theme/model.js';
import { deserializeTheme, decodeThemeFromUrlParam } from './src/theme/serialize.js';
import { validateMetadata } from './src/theme/validation.js';
import { generateThemeZip } from './src/theme/zip.js';
import { unzipSync, strFromU8 } from 'fflate';
import postcss from 'postcss';

const input = structuredClone(initialThemeState);
input.meta.folderName = 'sol-boundary-audit';
input.meta.displayName = 'Sol boundary audit';
input.meta.basedOn = 'sol-missing-parent';
input.layout.margins =
  '2rem; }\n.sol-proof { outline: 13px solid blue; }\n:root { --sol-proof: 1';
const raw = JSON.stringify({ version: 2, ...input });
const state = deserializeTheme(raw);
const param = btoa(encodeURIComponent(raw));
console.log(validateMetadata(state.meta)); // {}
console.log(decodeThemeFromUrlParam(param).layout.margins);
const entries = unzipSync(generateThemeZip(state));
const css = strFromU8(entries['sol-boundary-audit/styles/main.css']);
console.log(postcss.parse(css).nodes.filter((n) => n.type === 'rule').map((n) => n.selector));
```

JSON, synthetic File.text, URL и valid-envelope storage приняли payload. PostCSS top-level selectors: `[':root', '.sol-proof', ':root', '.sol-proof', ':root']`. Это валидные отдельные rules, а не просто строка с punctuation.

В новом браузерном прогоне тот же payload импортирован через `?theme=`, параметр очищен, имя и папка отображаются, `aria-invalid=true` элементов 0, Download enabled. Скачанный ZIP имеет ровно:

```text
sol-boundary-audit/theme-info.php
sol-boundary-audit/styles/main.css
```

В его CSS есть `.sol-proof { outline: 13px solid blue; }`, в PHP — `'based_on' => 'sol-missing-parent'`. SHA-256 реально скачанного ZIP: `5e5fd6ad501cd4afe95e7981a7c7d9108167a6551d44f22d8d690ef20c85fd68`. Live Aegea этот архив не устанавливался.

### Coverage и журнал повторных проверок

Команды выполнялись в `$AUDIT_TMP/project`; это логическое обозначение новой временной копии, не путь checkout. PASS воспроизведения дефекта не равен PASS продуктового контракта.

| Команда / сценарий | Среда | Результат | Ключевое evidence и граница |
| --- | --- | --- | --- |
| `git status --short --untracked-files=all`, `git rev-parse HEAD`, `git branch --show-current`, hash snapshots | Исходный checkout, read-only | PASS | База и чужой diff выше; 0 drift в 89 tracked файлах |
| `npm test` | Новый temp copy, Node24/Mac | FAIL, exit 1 | 99 tests: 98 pass, 1 fail; storage.test.js:36, system fixture |
| `npm run lint` | Та же копия | FAIL, exit 1 | 1 prettier/prettier, PresetSelector.vue:43 |
| `npm run lint:styles` | Та же копия | FAIL, exit 2 | 7 App.css errors: global ×2, descending specificity ×2, duplicate selector, deprecated clip, property order |
| `npm run format:check` | Та же копия | FAIL, exit 1 | Только PresetSelector.vue |
| `npm run build` | Та же копия | PASS, exit 0 | 682 modules; CSS 89.07 kB/gzip 12.70; JS 323.87 kB/gzip 107.75; два VueUse PURE warnings |
| `node audit-verification.mjs` | Synthetic harness, создан только в temp copy | PASS, exit 0 для assertions | 4 ingress routes воспроизводят F01; 8 других scenario groups ниже. Не repo tests, не browser File chooser |
| `npm run preview -- --host 127.0.0.1 --port 4183 --strictPort` | Изолированный production build, loopback | PASS | Запущен для Chrome, затем остановлен; внешний server не публиковался |
| URL import → Download ZIP → unzip | Новый Chrome tab/origin | FAIL contract; PASS reproduction | ZIP marker/parent подтверждены по реальному download, не только helper |
| Default plain fonts | Chrome + distribution source | FAIL parity | Оба computed stacks InterVariable; export не задаёт mainFontFamily; Aegea11.5 stack начинается system-ui |
| 1280 → 768, keyboard ArrowRight ×16 | Chrome, default root sizing | FAIL layout | controls672 / separator8 / preview88 / max672 |
| 375 px, RU | Chrome | PASS sampled layout | scrollWidth375; separator display none; ZIP left231.89/right367 в viewport |
| После обычного save → reload | Chrome | PASS | Sol saved baseline восстановлен |
| Fill → reload одним batch | Chrome | FAIL persistence | 88 ms; Sol rapid edit потерян |
| No-op Reset → один fill → wait → reload | Chrome | FAIL persistence | Повтор N01, ожидание17 016ms, восстановлены defaults |
| Theme/Interface/locale separation | Chrome | PASS selected combinations | Light preview rgb255/255/255 + dark shell; dark preview rgb32/32/32 + light shell; RU не меняет metadata |
| Два валидных share URL A → B → Back → Forward | Chrome | PASS sampled history navigation | A, B, A, B; query очищен. Не обещание undo imports внутри одного документа, не тест всех BFCache modes |
| Chrome console sampled error/warn | Новая audit tab | PASS sample | 0 записей в запрошенной выборке; не гарантия отсутствия ошибок всех flows |
| `php --version` | Доступный PHP7.0.33 | FAIL среды, exit134 | Не найден libzip.5.dylib. PHP lint/live install NOT RUN |
| `git cat-file -e e1d058356e5426bb1878785c6f4ab4e68b6c4995^{commit}` | Доступный Aegea source | FAIL, exit128 | Baseline object отсутствует; exact-commit parity NOT RUN |
| Version regex + SHA256 Aegea plain files | Доступная distribution | PASS identification | E2_VERSION4199, E2_RELEASE11.5; fingerprints ниже, без чтения всего compiled core в контекст |
| GET GitHub `issues?state=all&per_page=100` | Connected read-only GitHub | PASS lookup | Пустой массив, нет issue duplicates; ничего не создано |
| Read-only `git ls-remote origin refs/heads/main` | Отдельный publication checkout | PASS | Remote a95eb2c… до подготовки второго report; требуется fresh check перед push |

Дополнительные synthetic assertions подтвердили: unknown top-level/UI/meta fields отбрасываются; version1/wrong boolean type/malformed link отвергаются; traversal slug даёт metadata error; PHP quotes/backslash экранируются; light/dark sessions принимаются, system/missing/version1 игнорируются; storage exceptions не выбрасываются наружу; все 10 presets round-trip; неизвестная Google family нормализуется к plain; system font с CSS punctuation заменяется safe fallback; dark selector и light metadata colors сохраняются; полностью locked Random сохраняет controlled keys и font sources.

Это адресный обзор, не исчерпывающий security/a11y/font audit. Первые 500 random samples Astra не выдаются за повторно выполненную проверку Sol. Partial-lock combinations и все retry outcomes отдельно не перебирались.

Aegea distribution fingerprints: variables.scss `77c53bfb7c0d94c980bdec2b523bf60333621a9377ca4f8c1706db18304808fe`; theme-info.php `3fbb894bbdbdaf990acc77e9b1a69c01f30cae5f652f190d795cd006d1e582ed`. Parent fallback traced в доступном source `system/core/olba.php:18–69`; отсутствие baseline object не позволяет приписать весь этот source точно release commit e1d0583.

## 5. Очищенный канонический реестр

### C01

**F01; Medium; высокая уверенность.** Отсутствует semantic schema модели на JSON/File/URL/storage boundaries. Из type-correct внешнего payload в downloadable CSS проходят rules, в PHP — unsupported parent; non-finite number нарушает последующий roundtrip. Пользователь может установить артефакт, не соответствующий controls и preview. Ограничение: нужен внешний/ручной input; PHP/JS execution и live installation damage не доказаны. Evidence: четыре routes и настоящий ZIP, §4. Основной item: **R01**. CSS-left/right и JSON/URL/storage не получают отдельные fixes.

### C02

**F02; Low; высокая уверенность в CSS.** Plain preview fallback использует InterVariable вместо system stack release target11.5; экспорт корректно оставляет наследование plain. Возможны другие glyph metrics, но они не измерены. Evidence: computed styles и variables.scss:115. Основной item: **R04**. Не менять plain export на Inter и не расширять font delivery.

### C03

**F03; Medium; высокая уверенность.** Available width читается внутри cached computed без reactive size source; separator не учтён, текущая ширина не reclamp. Превью сжимается до88px на desktop viewport768. Evidence: DOM/ARIA + App:128–150/App.css:63–66. Основной item: **R03**. Cache, width budget и reclamp — один pane-sizing fix.

### C04

**F04; Medium; высокая уверенность локально.** Current quality gate красный из-за stale session fixture, formatting и CSS lint integration/violations. Это мешает отличать новую регрессию от фона и не соответствует требуемым checks. Evidence: пять scripts, четыре FAIL. Node22/Linux/branch protection не проверены. Основной item: **R02**. ESLint и format — два симптома одной PresetSelector formatting cause, не два backlog items.

### C05

**F05; Low; высокая уверенность.** Pending debounced save не flush при reload/уходе; в пределах500ms теряется последняя watched правка. Evidence: baseline reload и fast batch88ms. Основной item: **R05**, отдельно от C06 в acceptance. Закрытие/Back — будущие regression scenarios, не новые якобы выполненные репродукции.

### C06

**N01; Low; высокая уверенность.** Reset suppression survives no-op Reset и подавляет следующую user mutation вместо reset notification. Отдельная правка остаётся несохранённой даже после17s до следующего watched изменения. Evidence: повторный Chrome scenario и App:334–345,576–594. Основной item: **R05**, один coherent persistence slice с C05. Это самостоятельная причина, не просто ещё один debounce sample.

## 6. Приоритизированный remediation plan

Приоритет не наследуется из severity. P0 используется только для доказанного blocker критичного использования или конкретного ближайшего выпуска; такой выпуск не задан, Critical/High не установлены. Нельзя запускать этот план в рамках текущего аудита.

### R01

**Результат / IDs:** принятая модель не может вывести unsupported CSS syntax/parent/non-finite values в export; C01/F01. **P1:** значимый риск обмена темами и несоответствия скачанного артефакта обещанному результату.

**Scope:** serialize.js, storage.js, validation/model helpers, export gate App; focused tests serialize/storage/css/zip. Минимальное направление — общий value validator на trust boundaries и проверяемый invariant перед export. Non-goals: sanitizer для редактора произвольного CSS, TypeScript/backend, новые theme fields, общий framework rewrite.

**Предпосылки / зависимости:** нет hard dependency на другой R. До изменения согласовать grammar единиц, canonical colors и finite numeric bounds по существующим controls/presets; поддерживаемые custom system stacks сохранить. Нельзя считать любую строку вне slider range атакой без контракта. R02 нужен для зелёного общего merge gate.

**Малые шаги:**

1. Выписать разрешённые section/key/value contracts, включая `basedOn=plain`, hex palette, px/rem lengths и конечные scale/line-height.
2. Разделить editable metadata error (пустое имя можно исправить) и unsupported external model; выбрать понятный reject/fallback для каждого. Unsupported model не применять частично.
3. Использовать общий validator в JSON/File/URL/storage; сохранить current version/unknown-field/font normalization policies.
4. Закрыть обход через прямой export caller invariant и добавить boundary regression cases.
5. Проверить новый ZIP и preview на обычных данных; отдельно real Aegea consumer в разрешённом изолированном install.

**Acceptance criteria:**

- Sol/Astra payloads и варианты в palette, margins/maxWidth, numeric typography не дают enabled successful ZIP с чужими rules; текущая тема остаётся целой при reject.
- `1e999` не принимается как finite number; accepted JSON → URL → JSON сохраняет корректные types/values.
- Unsupported parent не попадает в theme-info; valid ZIP имеет только правильную папку и два ожидаемых UTF-8 файла.
- Оба palettes, все10 presets, Unicode displayName, supported custom system stacks и известные Google families сохраняют roundtrip и preview/export consistency. Unknown Google fallback не регрессирует.
- Invalid-file/link feedback локализовано EN/RU; storage fallback сохраняет работоспособность приложения. Path/quote guards остаются.
- Focused regression tests плюс все пять commands после R02; browser File и URL routes; PHP lint и install11.5 в выделенной среде отмечены отдельно, не заменены build.

**Риски / внедрение:** ужесточение может отвергнуть вручную изменённые v2 payloads и сохранённые sessions. Shape не меняется автоматически; bump version не нужен только ради type guards. Политику invalid data явно определить; не silently переписывать пользовательскую тему. Не вводить redundant guards на каждом внутреннем вызове вместо boundary invariant. Откат validator возвращает доказанный риск и не считается безопасным release acceptance.

**Размер:** M; неопределённость в grammar/совместимости custom values и consumer environment. **Недостающее evidence:** agreed value table, fresh browser file import, PHP/live Aegea result; только после них закрывать C01.

### R02

**Результат / IDs:** все существующие quality commands проходят и ловят новые нарушения; C04/F04. **P1:** текущий gate неисправен; этот item нужен перед merge любых code fixes и выпуском, без вывода о production failure.

**Scope:** storage.test.js, PresetSelector.vue:43–47, App.css:11–16/127–144, узкий stylelint override для Vue scoped external CSS при необходимости. Non-goals: возвращать system, менять runtime session policy, отключать stylelint/Prettier глобально, чистить все стили или библиотеку.

**Предпосылки / зависимости:** hard R dependency нет. Проверить, что текущие чужие App/PROGRESS изменения всё ещё на месте; patch не должен переформатировать весь компонент. Node22/Linux clean install допускается только в авторизованной среде.

**Малые шаги:**

1. Заменить устаревшую valid-session fixture на current concrete light/dark и явно зафиксировать ignored system/missing cases.
2. Исправить только указанную formatting строку PresetSelector.
3. Подтвердить compile semantics external scoped `:global`; ограничить lint exception только соответствующим Vue style context, сохранив неизвестные pseudo errors для обычного CSS.
4. Минимально объединить duplicate selector/order и заменить deprecated visually-hidden declaration без изменения accessibility/overlays.
5. Выполнить пять scripts, затем воспроизвести gate на CI environment без запуска release/deploy.

**Acceptance criteria:**

- Test принимает valid light и dark, отвергает system/missing/unsupported versions; зелёный тест не требует регрессии runtime.
- `npm test`, `npm run lint`, `npm run lint:styles`, `npm run format:check`, `npm run build` — exit0 на final code; необходимые новые regressions тоже проходят.
- Invalid обычный CSS pseudo-class по-прежнему ловится stylelint; legit scoped global selectors компилируются без Vue suffix на root/popper wrapper.
- Share/Reset portals в light/dark работают, visually hidden status остаётся доступным, но не влияет на layout; sampled browser check с metadata error.
- Node22/Linux clean lockfile install + те же scripts подтверждены в log. Если такой среды нет, закрывается локальная часть, CI acceptance остаётся открытым.

**Риски / внедрение:** broad lint suppression может спрятать реальные ошибки; CSS реорганизация может сломать overlay stacking или скрыть status от AT. Проверить computed styles и accessibility names, не заменять Reka primitives. Публичный data format не меняется.

**Размер:** S; неопределённость только в подходящем scoped-CSS lint context и CI environment. **Недостающее evidence:** final Node22/Linux gate и browser overlay/status checks после patch.

### R03

**Результат / IDs:** desktop preview сохраняет предусмотренную ширину при resize и restore, ARIA max совпадает с constraint; C03/F03. **P2:** частый responsive transition ухудшает основную рабочую область; theme data не теряются.

**Scope:** App pane sizing, size subscription/lifecycle, App.css workspace/resizer budget; targeted UI tests/harness. Минимальное направление — reactive workspace measurement с реальным separator size и reclamp. Non-goals: новый layout framework, redesign header или управление preview через device simulator.

**Предпосылки / зависимости:** нет hard R dependency; R02 общий gate. При width ниже суммы controls320 + preview360 + separator определить явную fallback policy: оба minima математически невозможны. Это contract choice, а не обещание сохранить360 на любой ширине.

**Малые шаги:**

1. Измерять available workspace и separator при mount/изменениях размера; обеспечить cleanup подписки.
2. Вычислять максимум и применять его к уже выбранной/сохранённой ширине.
3. Использовать один constraint для pointer, keyboard, restore и aria-valuemax.
4. Проверить desktop↔mobile transitions и невозможные width budgets; сохранить выбранную narrow policy.
5. Проверить после шрифтов/языка/zoom, если они меняют доступное пространство.

**Acceptance criteria:**

- При768px и resizer8px max controls **400px**, preview≥360, если эти minima помещаются; нет stale672 после1280→768.
- Сужение уже растянутой панели reclamp без следующего drag/keypress и без reload.
- ArrowLeft/Right и pointer одинаково ограничены; aria min/max/now согласованы с DOM width.
- Сохранённый672 на узком startup ограничивается актуальным budget; 1280→768→1280 и375→768 не воспроизводят collapse.
- При375 stacked layout, ZIP доступен, нет horizontal document overflow; ниже суммы minima применяется согласованный fallback, а не отрицательный track.
- Targeted sizing tests, все commands после R02, Chrome и хотя бы Safari consumer check.

**Риски / внедрение:** observer feedback loop, лишние layout reads, jitter, ошибочное сохранение narrow-clamped width как предпочтения. До patch выбрать policy preferred/effective width; не добавлять сложную историю панелей. Cleanup не должен оставлять callbacks после unmount. Export format не меняется.

**Размер:** S–M; неопределённость в fallback и restore policy. **Недостающее evidence:** pointer/Safari/zoom transitions после реализации, решение для641–687px при default sizing.

### R04

**Результат / IDs:** plain preview получает baseline11.5 font stack, экспорт продолжает наследовать plain; C02/F02. **P2:** честность default preview важна, но CSS mismatch с неизмеренным ущербом не P0/P1 security issue.

**Scope:** AegeaPreview.css fallback, при необходимости baseline documentation с provenance и focused parity check. Non-goals: принудительный Inter в ZIP, переход target на12.0a, bundled fonts, точный полный pixel diff движка.

**Предпосылки / зависимости:** нет hard R dependency. Сначала verification **V02** ниже — установить доступный release oracle/provenance; exact commit unavailable не считать success. R02 общий gate. R03 полезен для сравнения одинаковых content widths, но не является hard prerequisite замены стека.

**Малые шаги:**

1. Сверить release11.5/v4199 source и declared baseline; записать происхождение oracle.
2. Изменить только default plain fallback, не значения explicit system/google.
3. Сравнить один EN/RU текст и одинаковую фактическую ширину с child theme в изолированной11.5.
4. Проверить default/plain и явные font sources light/dark; обновить baseline note только при изменении contract.

**Acceptance criteria:**

- В plain computed font-family preview/note соответствует согласованному11.5 stack; нет непоставляемого InterVariable как default.
- CSS ZIP в plain по-прежнему не создаёт main/note family override.
- В сравнительном consumer sample значения stack и измеренные widths/linebreaks согласованы в пределах явно выбранной simplified-preview tolerance.
- System stacks и одна Google family не получают двойных fallback/imports; EN/RU и dark переключения не возвращают старый fallback.
- CSS/unit checks и общий gate проходят; Aegea runtime check помечен реальным результатом, не build.

**Риски / внедрение:** preview typography изменится у существующих сохранённых plain themes, export не меняется. Не сохранять baseline font как пользовательское theme value. При отсутствии baseline verification сначала закрыть provenance вопрос, не делать скрытый upgrade engine target.

**Размер:** S code, M с consumer verification; неопределённость в доступном Aegea runtime. **Недостающее evidence:** V02 release oracle и paired render metrics.

### R05

**Результат / IDs:** актуальная корректная session сохраняется при уходе и после любой завершённой Reset-транзакции; C05/F05 и C06/N01. **P2:** no-op Reset даёт неограниченное ожиданием пропущенное сохранение. F05 отдельно — P3 по малому временному окну, но разделять два edits одного persistence lifecycle в несвязанные fixes не нужно.

**Scope:** App watcher/timers/reset/lifecycle; storage.js только при необходимости; focused persistence tests и browser harness. Минимальное направление — явная save/flush transaction и ограниченная suppression reset notifications. Non-goals: backend/autosave service, новая schema, возвращение system, гарантировать сохранение при OS kill/crash.

**Предпосылки / зависимости:** hard R dependency нет. V01 import ordering до touch shared orchestration полезен для границ, но неподтверждённая race не входит автоматически в patch. R01 определяет validator для safe-to-persist model, если в этом slice появится такая проверка; существующая политика editable metadata должна сохраняться. R02 общий gate.

**Малые шаги:**

1. Выделить общий save-latest-state шаг без копирования schema; определить pending/dirty и cleanup.
2. Ограничить Reset suppression текущей транзакцией, в том числе no-op; убрать возможность пропуска следующего user event.
3. Сохранить debounce обычного ввода; добавить подходящий flush на lifecycle/page event с чтением актуального состояния.
4. При Reset отменить старый timer и синхронно сохранить reset result, не допуская его перезаписи прежней темой.
5. Проверить storage failures, unmount/remount и быстрые действия отдельно от обычного restore.

**Acceptance criteria:**

- После Reset уже defaults одна paste/slider/color mutation сохраняется спустя debounce; после reload остаётся новое значение, даже если других действий нет.
- Повторный Reset, Reset из изменённой темы и Cancel/Escape покрыты отдельно; Cancel/Escape не трогают session/suppression.
- Fill→reload до500ms, Back и закрытие после одной правки восстанавливают последнее корректное состояние в тестируемой среде; quota/blocked localStorage не crash приложение.
- Pending pre-reset save не возвращает старую тему через500ms или после page event.
- Normal rapid typing имеет debounce, не много синхронных writes на каждый event; timer/listener после unmount очищен.
- Valid light/dark/UI width/locks и separate locale остаются совместимыми; legacy system rejection сохранён.
- Focused fake-timer tests плюс настоящий Chrome/Safari reload/pagehide path и пять commands после R02. OS hard kill не заявляется покрытым.

**Риски / внедрение:** stale closure, двойной save, flush с invalid snapshot, восстановление pre-reset состояния, writes на browser hide/teardown. Явно протестировать ordering; не полагаться только на beforeunload и не обещать crash durability. Storage schema/API сохраняются.

**Размер:** S–M; неопределённость в browser lifecycle/BFCache и выбранной save policy. **Недостающее evidence:** final real-browser quick exit and no-op Reset regression, listener/timer cleanup, quota scenarios.

## 7. Execution order, зависимости и проверки до implementation

1. Перед любым patch заново снять HEAD/status, сохранить чужой diff и проверить актуальность C-ID. Этот audit не разрешает переключать/сбрасывать исходное дерево.
2. **R02** вернуть контролируемый gate; одновременно можно уточнять value table **R01** и release oracle **V02** read-only. Одна и та же source область App требует согласованного владельца edits.
3. **R01** закрыть boundary invariant и acceptance. **R03** и CSS часть **R04** могут разрабатываться независимо, но App edits R01/R03 надо интегрировать последовательно.
4. **R05** выполнить одним persistence slice, совместив требования C05/C06. Сначала V01 только если меняется import/reset ordering; отрицательный результат эксперимента не добавляет race fix.
5. Проверить объединённый configure→preview→ZIP→isolated Aegea11.5 flow: plain/system/одна Google family, light/dark, EN/RU, desktop/narrow; затем final gate Node22/Linux. Consumer approval не заменяется unit tests.

**Hard dependency graph:** remediation items не зависят друг от друга по функциональной реализации; R02 — общий merge/release gate. R04 consumer acceptance зависит от V02. Integration acceptance R05 учитывает R01, если новая save path использует его validator. Эти направления идут от prerequisites к acceptance, обратных зависимостей и циклов нет. R03 не зависит от R04, R01 не зависит от исправления fonts, hypotheses не блокируют все подтверждённые fixes.

**Критический путь исправлений перед выпуском:** contract R01 → boundary tests/browser ZIP → isolated Aegea consumer; параллельно R02 → final supported-environment gate. R03/R05 закрывают доказанные UX defects; R04 требует oracle, но его недоступность не останавливает обычную разработку.

**Release blockers:** для выпуска именно проверяемого среза нельзя считать mandatory checks пройденными (C04); нельзя выдавать unsupported input export и необратимый roundtrip за корректный sharing/export (C01). Текущая задача — отчёты, конкретный ближайший release не объявлен, поэтому P0 не назначен. CSS parity, pane transition и autosave defects должны быть исправлены или явно приняты владельцем в release criteria; они не доказывают общий production outage. Missing PHP/oracle — блокер полной install-acceptance, а не blocker code authoring. Hypotheses/catalog sweep/header polish не блокируют текущую разработку без дополнительного evidence.

**Coverage плана:** C01→R01; C02→R04; C03→R03; C04→R02; C05→R05; C06→R05. Каждый C имеет ровно один основной item; два persistence causes сохранены раздельно в acceptance одного item.

## 8. Verification experiments, no-action и ограничения

### Неподтверждённые hypotheses — только эксперименты

| ID | Гипотеза / среда | Минимальный эксперимент и evidence | Решение после PASS/FAIL |
| --- | --- | --- | --- |
| V01 | Pending File.text может перезаписать Reset/второй import/manual edit. App WT:497–511. Browser upload в этом проходе NOT RUN; controlled race не воспроизведена. | В temp component harness задержать File.text(A), затем B/Reset/edit, завершить A. Записать последовательность apply и конечную тему; отдельно проверить error feedback от stale request. UI File input тоже проверить в разрешённом браузере. | Если старый A применяется после более нового пользовательского выбора — новый доказанный finding и отдельное минимальное ordering решение; иначе не добавлять generation token только из предположения. R05 не получает этот scope автоматически. |
| V02 | Exact Aegea baseline/provenance и rendered font parity пока неполны; это **известный verification gap**, не новая runtime проблема. | Получить release11.5/v4199 oracle или нужный commit в авторизованной среде, запустить PHP/runtime отдельно от чужого сайта; сравнить один EN/RU текст и одинаковую ширину, зафиксировать font stack/linebreaks. | Совпадение/подтверждённый mismatch закрывает R04 consumer часть; если oracle различается, пересмотреть target/fallback с владельцем. Не объявлять12.0a новым target молча. |
| V03 | Preview responsive queries по editor viewport и narrow header могут расходиться с consumer шириной/доступностью. Не подтверждено как отдельный F/N. | Парные geometry screenshots preview vs isolated consumer при одинаковой фактической ширине, margins и scale; header641px в RU/EN и200% zoom, bounds/overlap/hit targets. | Functional inaccessible/contract mismatch → новое узкое finding; просто тесный вид → optional polish, без rewrite и без смешения с C03. |
| V04 | Huge payload/Google Fonts catalog/network/contrast edge cases могут давать отдельный ущерб. Пока нет измеренного failure. | Раздельные bounded experiments в temp: размеры1/5/20MB и responsiveness; одна известная family + offline/slow response; marked-title contrast на valid palette. Сетевой тест — только с нужным разрешением и текущей первичной API документацией. | Измеренный freeze/bad response/неверное обещание → evidence и узкий follow-up; иначе no action. Не вводить произвольный size limit, массовый catalog refresh или WCAG policy из гипотезы. |

В этом проходе не делались текущие заявления об изменчивом Google API и не повторялся web lookup Astra: его внешняя ссылка не используется как доказательство сегодняшней доступности каталога. V04 требует свежую первичную документацию при выполнении.

### No-action / accepted constraints

- No action для schema version1 и old system/missing-shell sessions: reject явно принят. Обновить тест R02, не реализовывать обратную миграцию.
- No action для «UI language попадает в export»: whitelist synthetic case отбрасывает UI fields, i18n хранится отдельно; browser RU не меняет metadata.
- No action для неизвестной Google family: current normalize→plain работает; сохранить этот путь при R01/R04.
- No action для PHP injection/ZIP traversal как самостоятельных findings: escaping и metadata gate опровергают соответствующие shortcuts. CSS boundary C01 остаётся.
- No action для отсутствия router/import undo: два share URL Back/Forward дали A/B/A/B, продукт не обещает history каждой mutation.
- No action для повторов formatting failure или marker в двух margin variables: deduplicated в C04/C01.
- Low-value documentation inconsistencies и historical MVP wording не превращены в массовый cleanup. Future implementation должна поддержать явный release target и relevant decisions, без редактирования остальных документов сейчас.
- Accepted constraints: plain-only child themes; static Vue/JS/Vite, no backend/TypeScript; Google remote fonts без bundle; simplified preview без полного renderer; неблокирующая contrast heuristic, без обещания WCAG AA всем темам.
- Ни один из шести current canonical defects не помечен No action: каждый имеет основной remediation item. Hypotheses не включены в шесть.

### Оставшиеся пределы и self-check

- PHP lint и живая установка **NOT RUN**: PHP не запускается из-за отсутствующего libzip. Exact baseline commit unavailable; release distribution fingerprint не эквивалентен доказанному commit identity.
- Node22/Linux clean install **NOT RUN**; локальный node_modules не доказывает reproducibility или absence of advisories. Dependency security scan не выполнялся.
- Browser File chooser **NOT RUN** в Sol; не повторялась заблокированная процедура Astra и не менялись permission settings. File decoder проверен только synthetic File.text; URL UI/download проверены реально.
- Нет exhaustive screen reader/Safari/Firefox/touch/zoom testing, полного font/catalog sweep, stress test, race harness или всей Aegea engine security review.
- Краткий transport disconnect Mac не повредил результаты: последующие read-only commands и браузер работали, code snapshots совпали; не требовалось повторять mutations.
- Source/config/dependencies/lockfile/demo/PROGRESS не изменены. В исходном checkout добавлен только этот второй report; первый сохранён. Issues/PR/releases/deployments и execution remediation не выполнялись. Отдельная разрешённая публикация audit-файлов не переносит локальный code diff в remote.
- Все F01–F05 учтены ровно по одной строке matrix; добавлен ровно один N01. Rejected claims не возвращены в scope. Canonical mappings и plan не содержат циклов или duplicate fixes.
- До сохранения проверено отсутствие существующего `audit/2-sol-6-1-xhigh.md`; исходные tracked snapshots и index проверены повторно. Report не содержит machine-local paths, секретов или настоящих пользовательских payloads.

