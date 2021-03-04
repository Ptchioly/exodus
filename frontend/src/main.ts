import App from './App.svelte';
import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import en from './lang/en.json';
import ru from './lang/ru.json';
import ua from './lang/ua.json';

const app = new App({
  target: document.body,
  props: {
    name: 'world',
    hydrate: true,
  },
});

addMessages('en', en);
addMessages('ru', ru);
addMessages('ua', ua);
init({
  fallbackLocale: 'en',
  initialLocale: localStorage.getItem('language') || getLocaleFromNavigator(),
});

export default app;
