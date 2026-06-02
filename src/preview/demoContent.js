const selfHref = '#';
const previewAssetPath = `${import.meta.env.BASE_URL}preview/`;

export const aegeaDemoContent = {
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
      thumbs: [
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
      ],
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
    name: 'John Smith',
    email: '',
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
};
