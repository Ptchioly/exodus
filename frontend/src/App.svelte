<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated } from './endpointApi';
  import MainPage from './MainPage.svelte';
  import { AccountsStorage } from './storage/accountsStorage';
  import TailwindCss from './TailwindCss.svelte';
  import type ClientStorage from './types/ClientStorage';
  import type { UserMeta } from './types/ClientStorage';

  let authorized: boolean | undefined;
  let storage: ClientStorage<UserMeta, 'name'>;

  onMount(async () => {
    authorized = await isAuthenticated();
    storage = await AccountsStorage();
  });
</script>

<TailwindCss />
<main class="font-main h-screen md:mx-20 text-center flex content-center my-10">
  {#if storage}
    <MainPage {storage} {authorized} />
  {/if}
</main>

<svelte:head>
  <link rel="icon" type="image/png" href="images/favicon.png" />
</svelte:head>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
