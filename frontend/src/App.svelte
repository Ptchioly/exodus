<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated } from './endpointApi';
  import MainController from './MainController.svelte';
  import storages from './storage/storages';
  import TailwindCss from './TailwindCss.svelte';
  import type ClientStorage from './types/ClientStorage';
  import type { UserMeta } from './types/ClientStorage';

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
    <MainController {storage} {authorized} />
  {/if}
</main>

<svelte:head>
  <link rel="icon" type="image/png" href="images/favicon.png" />
</svelte:head>
