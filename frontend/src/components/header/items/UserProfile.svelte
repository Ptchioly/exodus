<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import UserMenu from './UserMenu.svelte';

  export let username: string;
  const dispath = createEventDispatcher();
  let isOpen: boolean = false;
  $: [first, last] = username ? username.split(' ') : [''];
</script>

<div class="ml-2">
  <div>
    <div
      data-automation-id="menu-button"
      on:click|stopPropagation={() => (isOpen = !isOpen)}
      class=" bg-indigo-600 w-8 h-8 rounded-full text-white small shadow-lg border-4 flex items-center justify-center flex-row cursor-pointer "
    >
      <div class="pr-0.5">{first[0]}</div>
      <div>{last && last[0]}</div>
    </div>
    {#if isOpen}
      <UserMenu
        name={username}
        on:openSettings={() => {
          isOpen = false;
          dispath('settings', {});
        }}
        on:logout={() => {
          isOpen = false;
          dispath('logout', {});
        }}
      />{/if}
  </div>
</div>

<svelte:window on:click={() => (isOpen = false)} />

<style>
  .small {
    font-size: 0.9em;
  }
</style>
