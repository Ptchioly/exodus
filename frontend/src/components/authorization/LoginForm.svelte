<script lang="ts">
  import type { Button } from '../../types/Layout';
  import FormTitle from './FormTitle.svelte';
  import MainSection from './MainSection.svelte';
  import RedirectSection from './RedirectSection.svelte';

  export let title: string;
  export let actionButton: Button;
  export let linkButton: Button & {
    prefix: string;
  };

  const handleEnterPress = ({ key }: KeyboardEvent) => {
    if (key === 'Enter') actionButton.onclick();
  };
</script>

<div
  class="shadow-xl max-w-xl max-h-none w-full md:max-w-sm  m-auto bg-opacity-50 rounded-3xl border-white md:border-gray-200 border-2 bg-white dark:bg-lightdark"
>
  <FormTitle label={title} />
  <MainSection on:click={actionButton.onclick} {...actionButton}>
    <slot />
  </MainSection>

  <RedirectSection on:click={linkButton.onclick} {...linkButton} />
</div>
<svelte:window on:keypress={handleEnterPress} />
