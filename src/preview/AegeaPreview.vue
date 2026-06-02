<script setup>
import { computed } from 'vue';
import { getThemeCssVariables } from '../theme/css.js';
import { aegeaDemoContent } from './demoContent.js';
import './style.css';

const props = defineProps({
  themeState: {
    type: Object,
    required: true,
  },
});

const themeCssVariables = computed(() => getThemeCssVariables(props.themeState));
const visibleMainMenuItems = computed(() => aegeaDemoContent.mainMenu.filter((item) => item.visible));
const p2Notes = computed(() => aegeaDemoContent.notes);

const menuIconSvgById = {
  'favourite-on':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path stroke="none" d="m4.63 9.372-1.77 5.452 4.64-3.372 4.64 3.372-1.77-5.452L15 6.002H9.27L7.5.55 5.73 6.002H0l4.63 3.37z"/></svg>',
  settings:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path stroke="none" fill-rule="evenodd" clip-rule="evenodd" d="M8.018 1.747a6.248 6.248 0 0 0-6.249 6.25 6.25 6.25 0 1 0 6.249-6.25zm0 11a4.75 4.75 0 0 1-4.75-4.75 4.75 4.75 0 1 1 4.75 4.75z"/><path d="m2.098 13.285 1.75-.839L2.63 10.86l-1.263 1.474zm12.534-9.618-.73-.952-1.751.84 1.217 1.586zM.246 9.626l1.935.149-.261-1.983-1.831.645zM15.91 7.564l-.156-1.19-1.937-.148.261 1.983zM.472 5.532l1.601 1.096.766-1.848L.93 4.423zm14.596 6.046.46-1.109-1.603-1.097-.765 1.848zM2.715 2.098l.839 1.75L5.14 2.631 3.666 1.367zm9.618 12.535.952-.73-.84-1.752-1.586 1.218zM6.374.247l-.149 1.935 1.983-.261L7.563.089zM8.436 15.91l1.19-.155.148-1.937-1.983.261zM10.468.472 9.372 2.074l1.848.765.357-1.908zM4.422 15.069l1.109.46 1.097-1.603-1.848-.766z" stroke="none" fill-rule="evenodd" clip-rule="evenodd"/></svg>',
  tags: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 16 16" xml:space="preserve"><path stroke="none" d="M6.938 16.001c-.43 0-.891-.16-1.32-.59L.607 10.38C-.406 9.367.037 8.191.581 7.647l6.538-6.501C7.145 1.116 8.176 0 9.427 0h4.044c1.153 0 2.5.659 2.5 2.516v3.991c0 1.167-1.029 2.229-1.146 2.347L8.32 15.415c-.308.309-.818.586-1.382.586zM9.427 1c-.801 0-1.578.828-1.586.837L1.287 8.354c-.146.152-.587.706.027 1.319l5.011 5.031c.589.59 1.137.15 1.29.003l6.501-6.559c.238-.241.855-1.002.855-1.642v-3.99c0-1.318-.94-1.516-1.5-1.516H9.427zm1.571 5.754c-.468 0-.907-.183-1.238-.515a1.765 1.765 0 0 1 0-2.487c.661-.664 1.814-.664 2.475 0 .331.332.513.774.513 1.243 0 .469-.182.911-.513 1.243a1.73 1.73 0 0 1-1.237.516z"/></svg>',
};
</script>

<template>
  <section class="aegea-preview" :style="themeCssVariables">
    <div class="common">
      <header class="flag">
        <div class="header-content">
          <div class="header-description">
            <div class="title">
              <div class="title-inner">
                <h1>
                  <a :href="aegeaDemoContent.blog.href">
                    <span id="e2-blog-title">{{ aegeaDemoContent.blog.title }}</span>
                  </a>
                </h1>
              </div>
              <div id="e2-blog-description">{{ aegeaDemoContent.blog.subtitle }}</div>
            </div>
          </div>
        </div>

        <div class="header-menu">
          <div class="e2-band e2-band-full-size">
            <nav>
              <div
                v-for="item in visibleMainMenuItems"
                :key="item.title"
                class="band-item"
                :class="{
                  'band-item-current': item.current,
                  'band-item-parent': item.parent,
                }"
              >
                <span v-if="item.current" class="band-item-inner">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-if="item.svgId" class="band-item__icon e2-svgi" v-html="menuIconSvgById[item.svgId]"></span>
                  {{ item.title }}
                </span>
                <a v-else class="band-item-inner" :class="{ hover: item.hover }" :href="item.href">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-if="item.svgId" class="band-item__icon e2-svgi" v-html="menuIconSvgById[item.svgId]"></span>
                  {{ item.title }}
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main class="content">
        <article
          v-for="note in p2Notes"
          :key="note.id"
          class="e2-note"
          :class="{
            'e2-note-favourite': note.favourite,
            'e2-note-snippet': note.snippetText,
          }"
        >
          <a v-if="note.thumbs && note.href" class="nu" :href="note.href">
            <div class="e2-note-thumbs">
              <div v-for="thumb in note.thumbs" :key="thumb.src" class="e2-note-thumb">
                <mark v-if="thumb.highlighted">
                  <img :src="thumb.src" :width="thumb.width" :height="thumb.height" alt="" />
                </mark>
                <img
                  v-else
                  :class="{ 'e2-note-thumb-dimmed': note.hasHighlightedThumbs }"
                  :src="thumb.src"
                  :width="thumb.width"
                  :height="thumb.height"
                  alt=""
                />
              </div>
            </div>
          </a>
          <div v-else-if="note.thumbs" class="e2-note-thumbs">
            <div v-for="thumb in note.thumbs" :key="thumb.src" class="e2-note-thumb">
              <mark v-if="thumb.highlighted">
                <img :src="thumb.src" :width="thumb.width" :height="thumb.height" alt="" />
              </mark>
              <img
                v-else
                :class="{ 'e2-note-thumb-dimmed': note.hasHighlightedThumbs }"
                :src="thumb.src"
                :width="thumb.width"
                :height="thumb.height"
                alt=""
              />
            </div>
          </div>

          <h1 :class="{ 'e2-smart-title': !note.snippetText }">
            <a v-if="note.href" :href="note.href">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span :class="{ 'e2-note-favourite-title': note.favourite }" v-html="note.title"></span>
            </a>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-else :class="{ 'e2-note-favourite-title': note.favourite }" v-html="note.title"></span>
          </h1>

          <div v-if="note.snippetText" class="e2-note-snippet-text">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-html="note.snippetText"></p>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-else class="e2-note-text e2-text" v-html="note.text"></div>

          <div class="e2-band e2-band-meta-size e2-note-meta">
            <nav>
              <div v-if="typeof note.commentsCount === 'number'" class="band-item">
                <a class="band-item-inner" :href="note.hrefComments">
                  <span>
                    <span class="e2-svgi">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        y="0"
                        width="16"
                        height="16"
                        xml:space="preserve"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 4.5C3.7 4.5 1 5.9 1 8s2.7 3.5 7 3.5 7-1.4 7-3.5-2.7-3.5-7-3.5z"
                          stroke="none"
                          style="fill: none"
                        />
                        <path
                          d="M8 3.5C3.1 3.5 0 5.2 0 8c0 1.5.9 2.7 2.5 3.5V15l3.4-2.6c.7.1 1.4.1 2.1.1 4.9 0 8-1.7 8-4.5s-3.1-4.5-8-4.5zm0 8c-4.3 0-7-1.4-7-3.5s2.7-3.5 7-3.5 7 1.4 7 3.5-2.7 3.5-7 3.5z"
                          stroke="none"
                        />
                      </svg> </span
                    >&nbsp;{{ note.commentsText }}</span
                  >
                </a>
              </div>
              <div v-if="note.readCount" class="band-item">
                <div class="band-item-inner">
                  <span>
                    <span class="e2-svgi">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        y="0"
                        viewBox="0 0 16 16"
                        xml:space="preserve"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 12.5C3 12.5.3 8.4.2 8.3L0 8l.1-.3C.2 7.6 2.5 3.5 8 3.5s7.8 4.1 7.8 4.3l.2.3-.2.2c-.1.2-2.8 4.2-7.8 4.2zM1.2 8c.7.8 3.1 3.5 6.8 3.5 3.8 0 6.1-2.7 6.8-3.5-.6-.9-2.6-3.5-6.8-3.5-4.2 0-6.2 2.6-6.8 3.5z"
                          stroke="none"
                        />
                        <path
                          d="M8 10.5c-1.9 0-3.5-1.6-3.5-3.5S6.1 3.5 8 3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm0-6C6.6 4.5 5.5 5.6 5.5 7S6.6 9.5 8 9.5s2.5-1.1 2.5-2.5S9.4 4.5 8 4.5z"
                          stroke="none"
                        />
                        <circle cx="6.7" cy="6.5" r="1.5" />
                      </svg> </span
                    >&nbsp;{{ note.readCount }}</span
                  >
                </div>
              </div>
              <div v-for="tag in note.tags" :key="tag.name" class="band-item">
                <span v-if="tag.current" class="band-item-inner">
                  <mark>
                    <span class="e2-tag">
                      <span v-if="!tag.visible" class="e2-svgi e2-svgi-lock-nano">
                        <svg viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path
                            fill-rule="evenodd"
                            stroke="none"
                            clip-rule="evenodd"
                            d="M4 6a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1Z"
                          />
                          <path
                            fill-rule="evenodd"
                            stroke="none"
                            clip-rule="evenodd"
                            d="M7.414 4.586A1.51 1.51 0 0 0 7 4.292V3a3 3 0 0 0-6 0v1.292a1.51 1.51 0 0 0-.414.294C0 5.172 0 6.114 0 8c0 1.886 0 2.828.586 3.414C1.172 12 2.114 12 4 12c1.886 0 2.828-.586 3.414-.586C8 10.828 8 9.886 8 8c0-1.886 0-2.828-.586-3.414ZM6 3v1.05C5.484 4 4.834 4 4 4c-.834 0-1.484 0-2 .05V3a2 2 0 1 1 4 0Zm-4.061 7.936C2.4 10.998 3.029 11 4 11c.971 0 1.599-.002 2.061-.064.434-.059.57-.153.646-.229.076-.076.17-.212.229-.646C6.998 9.6 7 8.971 7 8c0-.971-.002-1.599-.064-2.061-.059-.434-.153-.57-.229-.646-.076-.076-.212-.17-.646-.229C5.6 5.002 4.971 5 4 5c-.971 0-1.599.002-2.061.064-.434.059-.57.153-.646.229-.076.076-.17.212-.229.646C1.002 6.4 1 7.029 1 8c0 .971.002 1.599.064 2.061.059.434.153.57.229.646.076.076.212.17.646.229Z"
                          />
                        </svg> </span
                      >&nbsp;{{ tag.name }}
                    </span>
                  </mark>
                </span>
                <a v-else class="e2-tag band-item-inner" :href="tag.href">
                  <span v-if="!tag.visible" class="e2-svgi e2-svgi-lock-nano">
                    <svg viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        stroke="none"
                        clip-rule="evenodd"
                        d="M4 6a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1Z"
                      />
                      <path
                        fill-rule="evenodd"
                        stroke="none"
                        clip-rule="evenodd"
                        d="M7.414 4.586A1.51 1.51 0 0 0 7 4.292V3a3 3 0 0 0-6 0v1.292a1.51 1.51 0 0 0-.414.294C0 5.172 0 6.114 0 8c0 1.886 0 2.828.586 3.414C1.172 12 2.114 12 4 12c1.886 0 2.828-.586 3.414-.586C8 10.828 8 9.886 8 8c0-1.886 0-2.828-.586-3.414ZM6 3v1.05C5.484 4 4.834 4 4 4c-.834 0-1.484 0-2 .05V3a2 2 0 1 1 4 0Zm-4.061 7.936C2.4 10.998 3.029 11 4 11c.971 0 1.599-.002 2.061-.064.434-.059.57-.153.646-.229.076-.076.17-.212.229-.646C6.998 9.6 7 8.971 7 8c0-.971-.002-1.599-.064-2.061-.059-.434-.153-.57-.229-.646-.076-.076-.212-.17-.646-.229C5.6 5.002 4.971 5 4 5c-.971 0-1.599.002-2.061.064-.434.059-.57.153-.646.229-.076.076-.17.212-.229.646C1.002 6.4 1 7.029 1 8c0 .971.002 1.599.064 2.061.059.434.153.57.229.646.076.076.212.17.646.229Z"
                      />
                    </svg> </span
                  >&nbsp;{{ tag.name }}</a
                >
              </div>
            </nav>
          </div>
        </article>

        <div v-if="aegeaDemoContent.pages.timeline" class="e2-pages">
          <a :href="aegeaDemoContent.pages.earlierHref">{{ aegeaDemoContent.pages.earlierTitle }}</a>
          <span class="e2-keyboard-shortcut e2-keyboard-shortcut_visible">&#x2325; &darr;</span>
        </div>

        <form class="e2-comment-form">
          <label>
            <span class="label-text">Name</span>
            <input type="text" :value="aegeaDemoContent.simpleForm.name" />
          </label>
          <label>
            <span class="label-text">Email</span>
            <input type="email" :value="aegeaDemoContent.simpleForm.email" />
          </label>
          <label>
            <span class="label-text">Comment</span>
            <textarea :value="aegeaDemoContent.simpleForm.text"></textarea>
          </label>
          <button type="button" class="e2-button e2-submit-button">
            {{ aegeaDemoContent.simpleForm.submitText }}
          </button>
        </form>
      </main>

      <footer class="footer">
        © <span id="e2-blog-author">{{ aegeaDemoContent.footer.author }}</span
        >, {{ aegeaDemoContent.footer.yearsRange }} ·
        <a :href="`mailto:${aegeaDemoContent.footer.email}`">{{ aegeaDemoContent.footer.email }}</a> ·
        <a class="e2-rss-button" :href="aegeaDemoContent.footer.rssHref">{{ aegeaDemoContent.footer.rssText }}</a>
        <div class="engine">{{ aegeaDemoContent.footer.engineText }}</div>
      </footer>
    </div>
  </section>
</template>
