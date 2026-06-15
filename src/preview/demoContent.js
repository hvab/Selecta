const selfHref = '#';
const previewAssetPath = `${import.meta.env.BASE_URL}preview/`;

function createThumbs() {
  return [
    {
      src: `${previewAssetPath}sample-thumb-1@2x.jpg`,
      width: 100,
      height: 79,
      highlighted: false,
    },
    {
      src: `${previewAssetPath}sample-thumb-2@2x.jpg`,
      width: 100,
      height: 67,
      highlighted: false,
    },
    {
      src: `${previewAssetPath}sample-thumb-3@2x.jpg`,
      width: 100,
      height: 44,
      highlighted: true,
    },
  ];
}

const aegeaDemoContentByLocale = {
  en: {
    blog: {
      title: 'Theme preview',
      subtitle: 'Use this page to preview and adjust your theme.',
      href: selfHref,
    },
    mainMenu: [
      {
        title: 'Main menu',
        href: selfHref,
        svgId: 'favourite-on',
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Preferences',
        href: selfHref,
        svgId: 'settings',
        current: false,
        parent: true,
        visible: true,
      },
      {
        title: 'Tags',
        href: selfHref,
        svgId: 'tags',
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Movies',
        href: selfHref,
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Music',
        href: selfHref,
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Books',
        href: selfHref,
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Theme preview',
        href: selfHref,
        current: true,
        parent: false,
        visible: true,
      },
    ],
    notes: [
      {
        id: 1,
        title: 'A sample post',
        href: selfHref,
        hrefComments: selfHref,
        commentsCount: 0,
        commentsText: 'No comments',
        text: `
          <p class="lead">This post has a lead paragraph.</p>
          <p>A regular <a href="${selfHref}">hyperlink</a>, a <a class="visited" href="${selfHref}">visited link</a>, and a <a class="hover" href="${selfHref}">hover example</a> should all be easy to compare.</p>
          <p>Theme work also needs <mark>highlighted text</mark> and enough body copy to judge the reading tone.</p>
          <p>This is what a post looks like. This post is starred — in the built-in theme its title is big, but you may do something else.</p>
          <p>This paragraph has just a filler text. The theory of empathy is free. The rhythm has an elegant factographic chthonic myth. Artistic mediation is a catharsis. The liturgical drama has psychological parallelism.</p>
          <h2>Subheadings, text formatting and images</h2>
          <p>Your post may have subheadings as above, <a href="${selfHref}">hyperlinks</a> and use text formatting, like <i>italics</i>, <b>bold</b>, or <tt>monospace</tt>.</p>
          <p>An image with a caption:</p>
          <div class="e2-text-picture">
          <div style="width: 800px; max-width: 100%"><div class="e2-text-proportional-wrapper" style="padding-bottom: 44.375%"><img src="${previewAssetPath}sample-image.jpg" width="800" height="355" alt="">
          </div></div>
          <div class="e2-text-caption">La creazione di Adamo. Michelangelo Buonarroti, c. 1511</div>
          </div>
          <p>Let’s say we have an important idea about this image:</p>
          <p class="loud">God created man in his own image</p>
          <p>A table follows this paragraph. This paragraph has just a filler text. The theory of empathy is free. The rhythm has an elegant factographic chthonic myth. Artistic mediation is a catharsis. The liturgical drama has psychological parallelism.</p>
          <div class="e2-text-table">
            <table cellpadding="0" cellspacing="0" border="0">
            <tr><th>City</th><th>Time zone</th><th>Code</th><th>From Greenwich</th></tr>
            <tr><td>Chelyabinsk</td><td>Yekaterinburg Time</td><td>YEKT</td><td>+5 h.</td></tr>
            <tr><td>Moscow</td><td>Moscow Time</td><td>MSK</td><td>+3 h.</td></tr>
            <tr><td>London</td><td>Greenwich Mean Time</td><td>GMT</td><td></td></tr>
            <tr><td>New York</td><td>Eastern Time</td><td>ET</td><td>−5 h.</td></tr>
            <tr><td>San Francisco</td><td>Pacific Time</td><td>PT</td><td>−8 h.</td></tr>
            </table>
          </div>
          <p>Some text may be separated with a horisontal rule:</p>
          <hr />
          <p>Some other text.</p>
          <h3>Third-level heading</h3>
          <p>Ordered list:</p>
          <ol>
            <li>This is a long list item so that you see what it looks like spanning several lines. Make sure the spacing between the items is bigger than the line height.</li>
            <li>This is a short element.</li>
          </ol>
          <p>Unordered list:</p>
          <ul>
            <li>This is a long list item so that you see what it looks like spanning several lines. Make sure the spacing between the items is bigger than the line height.</li>
            <li>This is a short element.</li>
          </ul>
        `,
        favourite: false,
        tags: [
          {
            name: 'a tag',
            href: selfHref,
            current: false,
            visible: true,
          },
          {
            name: 'another one',
            href: selfHref,
            current: false,
            visible: true,
          },
          {
            name: 'hidden one',
            href: selfHref,
            current: false,
            visible: false,
          },
        ],
        readCount: 42,
      },
      {
        id: 2,
        title: 'A sample favourite post',
        href: '',
        text: `
          <p class="lead">This post has a lead paragraph.</p>
          <p>This is a second example¹ to help you adjust the distance between the posts in a feed. The title is not a link here — as if we were on the posts’ page. It also has a highlighed tag — as if we were on that tag’s page.</p>
          <p class="foot">¹ By the way, this is an example of a footnote. It’s remarkable.</p>
        `,
        favourite: true,
        tags: [
          {
            name: 'first tag',
            href: selfHref,
            current: false,
            visible: true,
          },
          {
            name: 'the current one',
            href: selfHref,
            current: true,
            visible: true,
          },
          {
            name: 'and one more',
            href: selfHref,
            current: false,
            visible: true,
          },
        ],
        readCount: 147,
      },
      {
        id: 3,
        title: 'A sample post in the <mark>search</mark> results',
        href: selfHref,
        hrefComments: selfHref,
        text: '',
        snippetText:
          'This is what a post looks like in the <mark>search</mark> results page. The query text would be <mark>highlighted</mark>, and all the images from the post would be previewed below. Some of them may also be <mark>highlighted</mark>. The <tt>mark</tt> tag is used for all <mark>highlighting</mark>, including the tag in the post above.',
        favourite: false,
        readCount: 31,
        hasHighlightedThumbs: true,
        thumbs: createThumbs(),
      },
    ],
    pages: {
      timeline: true,
      count: 2,
      current: 1,
      earlierHref: selfHref,
      earlierTitle: 'Earlier',
    },
    simpleForm: {
      submitText: 'Submit',
      nameLabel: 'Name',
      name: 'John Smith',
      emailLabel: 'Email',
      email: '',
      textLabel: 'Comment',
      text: 'This is a sample comment form',
    },
    footer: {
      author: 'Aegea',
      yearsRange: '2026',
      email: 'author@example.com',
      rssHref: selfHref,
      rssText: 'RSS',
      enginePoweredBy: 'Powered by',
      engineName: 'Aegea',
      engineHref: 'https://blogengine.me/',
    },
  },
  ru: {
    blog: {
      title: 'Предпросмотр темы',
      subtitle: 'На этой странице смотрите и настраивайте вашу тему оформления.',
      href: selfHref,
    },
    mainMenu: [
      {
        title: 'Главное меню',
        href: selfHref,
        svgId: 'favourite-on',
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Настройка',
        href: selfHref,
        svgId: 'settings',
        current: false,
        parent: true,
        visible: true,
      },
      {
        title: 'Теги',
        href: selfHref,
        svgId: 'tags',
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Кино',
        href: selfHref,
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Музыка',
        href: selfHref,
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Книги',
        href: selfHref,
        current: false,
        parent: false,
        visible: true,
      },
      {
        title: 'Предпросмотр темы',
        href: selfHref,
        current: true,
        parent: false,
        visible: true,
      },
    ],
    notes: [
      {
        id: 1,
        title: 'Заметка-образец',
        href: selfHref,
        hrefComments: selfHref,
        commentsCount: 0,
        commentsText: 'Нет комментариев',
        text: `
          <p class="lead">У этой заметки есть вводный абзац.</p>
          <p>Обычная <a href="${selfHref}">ссылка</a>, <a class="visited" href="${selfHref}">посещенная ссылка</a> и <a class="hover" href="${selfHref}">пример наведения</a> должны легко сравниваться.</p>
          <p>Для работы над темой также нужны <mark>подсвеченный текст</mark> и достаточно основного текста, чтобы оценить характер набора.</p>
          <p>Так выглядит заметка. Это заметка со звездой. Во встроенной теме у нее крупный заголовок, но вы можете выделить его иначе.</p>
          <p>В этом абзаце — рыбный текст. Теория вчувствования свободна. Ритм изящно имеет фактографический хтонический миф. Художественное опосредование представляет собой катарсис. Литургическая драма имеет психологический параллелизм.</p>
          <h2>Подзаголовки, форматирование текста и картинки</h2>
          <p>В заметке могут быть подзаголовки, как здесь, <a href="${selfHref}">ссылки</a> и разные виды форматирования текста — <i>курсив</i>, <b>жирный</b>, или <tt>моноширинный</tt>.</p>
          <p>Картинка с подписью:</p>
          <div class="e2-text-picture">
          <div style="width: 800px; max-width: 100%"><div class="e2-text-proportional-wrapper" style="padding-bottom: 44.375%"><img src="${previewAssetPath}sample-image.jpg" width="800" height="355" alt="">
          </div></div>
          <div class="e2-text-caption">Сотворение Адама. Микеланджело, ок. 1511 г.</div>
          </div>
          <p>Допустим, у нас есть важная мысль об этой картинке:</p>
          <p class="loud">И сотворил бог человека по образу своему</p>
          <p>За этим абзацем следует таблица. В этом абзаце — рыбный текст. Теория вчувствования свободна. Ритм изящно имеет фактографический хтонический миф. Художественное опосредование представляет собой катарсис. Литургическая драма имеет психологический параллелизм.</p>
          <div class="e2-text-table">
            <table cellpadding="0" cellspacing="0" border="0">
            <tr><th>Город</th><th>Часовой пояс</th><th>Код</th><th>К Гринвичу</th></tr>
            <tr><td>Челябинск</td><td>Екатеринбургское время</td><td><nobr>YEKT</nobr></td><td>+5 ч.</td></tr>
            <tr><td>Москва</td><td>Московское время</td><td><nobr>MSK</nobr></td><td>+3 ч.</td></tr>
            <tr><td>Лондон</td><td>Среднее время по Гринвичу</td><td><nobr>GMT</nobr></td><td></td></tr>
            <tr><td><nobr>Нью-Йорк</nobr></td><td>Североамериканское восточное время</td><td><nobr>ET</nobr></td><td>−5 ч.</td></tr>
            <tr><td><nobr>Сан-Франциско</nobr></td><td>Тихоокеанское время</td><td><nobr>PT</nobr></td><td>−8 ч.</td></tr>
            </table>
          </div>
          <p>Часть текста может быть отделена горизонтальной линейкой:</p>
          <hr />
          <p>А тут другой текст.</p>
          <h3>Заголовок третьего уровня</h3>
          <p>Упорядоченный список:</p>
          <ol>
            <li>Это длинный элемент списка, чтобы посмотреть, как выглядит перенос на несколько строк — убедитесь что отступы между элементами списка больше, чем между строками одного элемента.</li>
            <li>А это — короткий элемент.</li>
          </ol>
          <p>Неупорядоченный список:</p>
          <ul>
            <li>это длинный элемент списка, чтобы посмотреть, как выглядит перенос на несколько строк — убедитесь что отступы между элементами списка больше, чем между строками одного элемента;</li>
            <li>а это — короткий элемент.</li>
          </ul>
        `,
        favourite: false,
        tags: [
          {
            name: 'тег',
            href: selfHref,
            current: false,
            visible: true,
          },
          {
            name: 'другой тег',
            href: selfHref,
            current: false,
            visible: true,
          },
          {
            name: 'скрытый тег',
            href: selfHref,
            current: false,
            visible: false,
          },
        ],
        readCount: 42,
      },
      {
        id: 2,
        title: 'Избранная заметка-образец',
        href: '',
        text: `
          <p class="lead">У этой заметки есть вводный абзац.</p>
          <p>Это еще один пример¹, чтобы вы настроили расстояние между заметками в ленте. Заголовок этой заметки не является ссылкой — как будто мы уже на ее странице. Еще один из тегов снизу подсвечен — как будто мы на его странице.</p>
          <p class="foot">¹ А это — пример примечания. Оно весьма примечательно.</p>
        `,
        favourite: true,
        tags: [
          {
            name: 'первый тег',
            href: selfHref,
            current: false,
            visible: true,
          },
          {
            name: 'текущий тег',
            href: selfHref,
            current: true,
            visible: true,
          },
          {
            name: 'и еще один',
            href: selfHref,
            current: false,
            visible: true,
          },
        ],
        readCount: 147,
      },
      {
        id: 3,
        title: 'Пример заметки в результатах <mark>поиска</mark>',
        href: selfHref,
        hrefComments: selfHref,
        text: '',
        snippetText:
          'Так выглядит заметка в результатах <mark>поиска</mark>. Текст запроса <mark>подсвечивается</mark>, а все картинки из заметки показываются ниже. Некоторые из них тоже могут быть <mark>подсвечены</mark>. Тег <tt>mark</tt> используется для всей <mark>подсветки</mark>, включая тег в предыдущей заметке.',
        favourite: false,
        readCount: 31,
        hasHighlightedThumbs: true,
        thumbs: createThumbs(),
      },
    ],
    pages: {
      timeline: true,
      count: 2,
      current: 1,
      earlierHref: selfHref,
      earlierTitle: 'Ранее',
    },
    simpleForm: {
      submitText: 'Отправить',
      nameLabel: 'Имя',
      name: 'Иван Петров',
      emailLabel: 'Почта',
      email: '',
      textLabel: 'Комментарий',
      text: 'Это пример формы комментариев',
    },
    footer: {
      author: 'Эгея',
      yearsRange: '2026',
      email: 'author@example.com',
      rssHref: selfHref,
      rssText: 'RSS',
      enginePoweredBy: 'Работает на',
      engineName: 'Эгее',
      engineHref: 'https://blogengine.ru/',
    },
  },
};

export function getAegeaDemoContent(locale) {
  return aegeaDemoContentByLocale[locale] ?? aegeaDemoContentByLocale.en;
}
