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
const p1Notes = computed(() => aegeaDemoContent.notes.slice(0, 2));

function getNoteText(note) {
  return note.p1Text || note.text;
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
          v-for="note in p1Notes"
          :key="note.id"
          class="e2-note"
          :class="{
            'e2-note-favourite': note.favourite,
          }"
        >
          <h1 class="e2-smart-title">
            <a v-if="note.href" :href="note.href">{{ note.title }}</a>
            <span v-else>{{ note.title }}</span>
          </h1>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="e2-note-text e2-text" v-html="getNoteText(note)"></div>

          <div class="e2-band e2-band-meta-size e2-note-meta">
            <nav>
              <div v-if="typeof note.commentsCount === 'number'" class="band-item">
                <a class="band-item-inner" :href="note.hrefComments">{{ note.commentsText }}</a>
              </div>
              <div v-if="note.readCount" class="band-item">
                <div class="band-item-inner">{{ note.readCount }} views</div>
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
