import { createApp } from 'vue';
import './ui/hvab.css';
import './components/App/AppLayers.css';
import App from './components/App/App.vue';
import { i18n } from './i18n/index.js';

createApp(App).use(i18n).mount('#app');
