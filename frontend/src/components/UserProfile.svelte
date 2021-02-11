<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UserInfo } from '../types/Api';
  import Settings from './Settings.svelte';

  export let user: UserInfo;
  $: name = user.name;
  const dispath = createEventDispatcher();
  let isOpen: boolean = false;
  console.log('Name', name);
  $: [first, last] = name.split(' ');
</script>

<div>
  <div>
    <div
      data-automation-id="menu-button"
      on:click={() => (isOpen = !isOpen)}
      class="bg-coolGreen-default w-8 h-8 rounded-full text-white small shadow-lg border-coolGreen-dark border-4 flex items-center flex-row cursor-pointer"
    >
      <div class="pr-0.5">{first[0]}</div>
      <div>{last[0]}</div>
    </div>
    {#if isOpen}
      <Settings {name} on:logout={() => dispath('logout', {})} />{/if}
  </div>
</div>

<style>
  .small {
    font-size: 0.9em;
  }
</style>
