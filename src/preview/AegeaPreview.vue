<script setup>
import { computed } from 'vue';
import { getThemeCssVariables } from '../theme/css.js';
import './style.css';

const props = defineProps({
  themeState: {
    type: Object,
    required: true,
  },
});

const themeCssVariables = computed(() => getThemeCssVariables(props.themeState));
</script>

<template>
  <section class="aegea-preview" :style="themeCssVariables">
    <div class="common">
      <header class="flag">
        <div class="header-content">
          <div class="header-description">
            <div class="title">
              <div class="title-inner">
                <h1><a href="#">Northbound Notes</a></h1>
              </div>
              <div>Field notes on design, cities, and small routines</div>
            </div>
          </div>
        </div>

        <div class="header-menu">
          <div class="e2-band e2-band-full-size">
            <nav>
              <div class="band-item band-item-current">
                <span class="band-item-inner">Notes</span>
              </div>
              <div class="band-item"><a class="band-item-inner" href="#">Projects</a></div>
              <div class="band-item"><a class="band-item-inner" href="#">Archive</a></div>
              <div class="band-item"><a class="band-item-inner" href="#">About</a></div>
            </nav>
          </div>
        </div>
      </header>

      <main class="content">
        <article class="e2-note">
          <h1 class="e2-smart-title"><a href="#">A quiet page for testing themes</a></h1>

          <div class="e2-note-text e2-text">
            <p class="lead">This preview keeps the important states visible while the theme stays simple.</p>
            <p>
              A regular <a href="#">link</a>, a <a class="visited" href="#">visited link</a>, and a
              <a class="hover" href="#">hover example</a> should all be easy to compare.
            </p>
            <p>
              Theme work also needs a <a class="tag" href="#">secondary tag</a>, <mark>marked text</mark>, and enough
              body copy to judge the reading tone.
            </p>
            <p class="loud">A quoted fragment should still feel like part of the same page.</p>
            <label>
              <span class="label-text">Email</span>
              <input type="email" value="reader@example.com" />
            </label>
          </div>
        </article>
      </main>

      <footer class="footer">
        © Mira North, 2026 · <a href="mailto:mira@example.com">mira@example.com</a> ·
        <a href="#">RSS</a>
        <div class="engine">Powered by Aegea</div>
      </footer>
    </div>
  </section>
</template>
