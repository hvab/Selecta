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

function getNoteText(note) {
  return note.snippetText || note.text;
}
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
                <span v-if="item.current" class="band-item-inner">{{ item.title }}</span>
                <a v-else class="band-item-inner" :class="{ hover: item.hover }" :href="item.href">{{ item.title }}</a>
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
          <div v-if="note.thumbs" class="e2-note-thumbs">
            <div v-for="thumb in note.thumbs" :key="thumb.src" class="e2-note-thumb">
              <mark v-if="thumb.highlighted">
                <img :src="thumb.src" :width="thumb.width" :height="thumb.height" alt="" />
              </mark>
              <img v-else :src="thumb.src" :width="thumb.width" :height="thumb.height" alt="" />
            </div>
          </div>

          <h1 class="e2-smart-title">
            <a v-if="note.href" :href="note.href">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="note.title"></span>
            </a>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-else v-html="note.title"></span>
          </h1>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="e2-note-text e2-text" v-html="getNoteText(note)"></div>

          <div class="e2-band e2-band-meta-size e2-note-meta">
            <nav>
              <div v-if="typeof note.commentsCount === 'number'" class="band-item">
                <a class="band-item-inner" :href="note.hrefComments">{{ note.commentsText }}</a>
              </div>
              <div v-if="note.readCount" class="band-item">
                <div class="band-item-inner">
                  <span
                    ><span class="e2-svgi">
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
                <span v-if="tag.current" class="band-item-inner"
                  ><mark>{{ tag.name }}</mark></span
                >
                <a v-else class="e2-tag band-item-inner" :href="tag.href">{{ tag.name }}</a>
              </div>
            </nav>
          </div>
        </article>

        <div v-if="aegeaDemoContent.pages.timeline" class="e2-pages">
          <a :href="aegeaDemoContent.pages.earlierHref">{{ aegeaDemoContent.pages.earlierTitle }}</a>
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
          <button type="button">{{ aegeaDemoContent.simpleForm.submitText }}</button>
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
