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
const p0Note = computed(() => aegeaDemoContent.notes[0]);
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
        <article class="e2-note">
          <h1 class="e2-smart-title">
            <a :href="p0Note.href">{{ p0Note.title }}</a>
          </h1>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="e2-note-text e2-text" v-html="p0Note.p0Text"></div>
        </article>
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
