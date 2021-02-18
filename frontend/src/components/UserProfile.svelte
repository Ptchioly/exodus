<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UserInfo } from '../types/Api';
  import UserMenu from './UserMenu.svelte';

  export let user: string;
  $: name = user;
  const dispath = createEventDispatcher();
  let isOpen: boolean = false;
  $: [first, last] = name.split(' ');
  export let showSettings;
</script>

<div>
  <div>
    <div
      data-automation-id="menu-button"
      on:click={async () => {
        isOpen = !isOpen;
      }}
      class="bg-coolGreen-default w-8 h-8 rounded-full text-white small shadow-lg border-coolGreen-dark border-4 flex items-center justify-center flex-row cursor-pointer "
    >
      <div class="pr-0.5">{first[0]}</div>
      <div>{last[0]}</div>
    </div>
    {#if isOpen}
      <UserMenu
        bind:showSettings
        {name}
        on:logout={() => {
          isOpen = false;
          dispath('logout', {});
        }}
      />{/if}
  </div>
</div>

<style>
  .small {
    font-size: 0.9em;
  }
</style>
