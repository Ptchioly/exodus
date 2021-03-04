<script lang="ts">
  import { _, locale, dictionary } from 'svelte-i18n';
  import { onDestroy } from 'svelte';

  enum ReadableLanguage {
    en = 'English',
    ru = 'Русский',
    ua = 'Українська',
  }

  let languages: string[] = [];
  let currentLanguage: string;

  const cacheLanguage = (lang: string) =>
    localStorage.setItem('language', lang);
  const changeLanguage = (lang: string) => locale.set(lang);

  const saveLanguage = (e: Event) => {
    changeLanguage(currentLanguage);
    cacheLanguage(currentLanguage);
  };

  const unsubscribeDict = dictionary.subscribe((dict) => {
    languages.push(...Object.keys(dict));
  });
  const unsubscribeLoc = locale.subscribe((lang) => {
    currentLanguage = lang;
  });

  onDestroy(() => {
    unsubscribeDict();
    unsubscribeLoc();
  });
</script>

<div class="flex flex-col w-400">
  <div class="flex flex-row mt-2 items-center">
    <div>{$_('settings.change_lang.languages')}</div>
    <select
      class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 dark:bg-darker dark:border-black p-1"
      bind:value={currentLanguage}
    >
      {#each languages as language}
        <option value={language}>{ReadableLanguage[language] || language}</option>
      {/each}
    </select>
  </div>
  <button
    class="mt-4 self-start bg-indigo-500 py-1 px-3 rounded-md text-white"
    data-automation-id="change-xtoken"
    on:click|preventDefault={saveLanguage}>{$_('settings.change_lang.btn')}</button
  >
</div>
