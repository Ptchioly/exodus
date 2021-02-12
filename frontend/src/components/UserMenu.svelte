<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { slide } from 'svelte/transition';

  export let name: string;
  export let showSettings: boolean;
  const dispatch = createEventDispatcher();
</script>

<main
  on:click={(e) => e.stopPropagation()}
  transition:slide={{ duration: 100 }}
  class="flex flex-col fixed -ml-24 mt-2 bg-white p-0 border-gray-300 border-2 items-start rounded-lg text-sm"
>
  <div class="rounded-lg p-2 pb-2 bg-gray-100 w-full flex items-start">
    {name}
  </div>
  <div class="p-2 pt-2 cursor-pointer" on:click={() => (showSettings = true)}>
    Account settings
  </div>
  <div
    data-automation-id="logout"
    class="p-2 cursor-pointer"
    on:click={() => dispatch('logout', {})}
  >
    Logout
  </div>
</main>
