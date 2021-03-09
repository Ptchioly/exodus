<script lang="ts">
  import { currentTheme, Theme } from './../../../theme';

  const toggleTheme = () => {
    currentTheme.set($currentTheme === Theme.dark ? Theme.light : Theme.dark);
  };
</script>

<div
  class="h-8 w-8 rounded-2xl cursor-pointer mx-2 flex justify-center"
  on:click={toggleTheme}
>
  {#if $currentTheme === Theme.dark}
    <img src="images/sun.svg" alt="info" />
  {:else}
    <img src="images/mode_night.svg" alt="info" />
  {/if}
</div>
