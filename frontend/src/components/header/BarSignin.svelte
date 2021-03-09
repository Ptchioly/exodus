<script lang="ts">
  import HeaderContainer from './HeaderContainer.svelte';
  import InfoButton from './items/InfoButton.svelte';
  import ThemeSwitcher from './items/ThemeSwitcher.svelte';

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

<!-- svelte-ignore a11y-no-onchange -->
<HeaderContainer>
  <div slot="left" class="flex transform scale-100">
    <select
      class="ml-3 border-gray-300 border-2 rounded-md pl-3 mr-5 bg-transparent dark:border-gray-800 p-1 dark:text-gray-200 text-gray-700"
      bind:value={currentLanguage}
      on:change={saveLanguage}
    >
      {#each languages as language}
        <option value={language}
          >{ReadableLanguage[language] || language}</option
        >
      {/each}
    </select>
  </div>
  <div
    slot="right"
    class="flex transform md:scale-100 xs:scale-150 md:mr-0 xs:mr-10"
  >
    <ThemeSwitcher />
    <InfoButton on:openFAQ />
  </div>
</HeaderContainer>
