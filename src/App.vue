<script setup>
import { generateThemeCss } from './theme/css.js';
import { initialThemeState } from './theme/model.js';
import { generateThemeInfo } from './theme/themeInfo.js';

const themeStateJson = JSON.stringify(initialThemeState, null, 2);
const themeCss = generateThemeCss(initialThemeState);
const themeInfo = generateThemeInfo(initialThemeState);
</script>

<template>
  <main class="app">
    <h1>Selecta</h1>
    <p>Theme generator for Aegea.</p>

    <section>
      <h2>Theme state</h2>
      <pre>{{ themeStateJson }}</pre>
    </section>

    <section>
      <h2>styles/main.css</h2>
      <pre>{{ themeCss }}</pre>
    </section>

    <section>
      <h2>theme-info.php</h2>
      <pre>{{ themeInfo }}</pre>
    </section>
  </main>
</template>
