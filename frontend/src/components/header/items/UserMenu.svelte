<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from "svelte-i18n";
  import { slide } from 'svelte/transition';

  export let name: string;
  const dispatch = createEventDispatcher();
</script>

<main
  on:click={(e) => e.stopPropagation()}
  transition:slide={{ duration: 100 }}
  class="flex flex-col absolute -ml-24 mt-2 bg-white p-0 border-gray-300 border-2 items-start rounded-lg text-sm"
  data-automation-id="menu-dropdown"
>
  <div class="rounded-lg p-2 flex items-start">
    {name}
  </div>
  <div
    class="p-2 pt-2 cursor-pointer"
    on:click={() => dispatch('openSettings', {})}
  >
    {$_('menu.acc_sett')}
  </div>
  <div
    data-automation-id="logout"
    class="p-2 cursor-pointer"
    on:click={() => dispatch('logout', {})}
  >
    {$_('menu.logout')}
  </div>
</main>

<style>
  main {
    z-index: 3000;
  }
</style>
