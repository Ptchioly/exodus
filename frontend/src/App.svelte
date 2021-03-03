<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated } from './endpointApi';
  import MainPage from './MainPage.svelte';
  import storages from './storage/storages';
  import TailwindCss from './TailwindCss.svelte';
  import type ClientStorage from './types/ClientStorage';
  import type { UserMeta } from './types/ClientStorage';

  import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";
  import en from './lang/en.json';
  import ru from './lang/ru.json';
  import ua from './lang/ua.json';

  addMessages('en', en);
  addMessages('ru', ru);
  addMessages('ua', ua);
  init({ fallbackLocale: 'en', initialLocale: localStorage.getItem('language') || getLocaleFromNavigator() });

  const theme: string = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') document.querySelector('html').classList.add('dark');

  let authorized: boolean | undefined;
  let storage: ClientStorage<UserMeta, 'name'>;

  onMount(async () => {
    authorized = await isAuthenticated();
    storage = await storages.Accounts();
  });
</script>

<TailwindCss />
<main
  class="font-main h-full box-border px-10 md:px-20 text-center flex content-center dark:bg-dark overscroll-y-auto overflow-y-scroll"
>
  {#if storage}
    <MainPage {storage} {authorized} />
  {/if}
</main>

<svelte:head>
  <link rel="icon" type="image/png" href="images/favicon.png" />
</svelte:head>
