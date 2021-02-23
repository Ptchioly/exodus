<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { logout } from '../endpointApi';
  import Card from './Card.svelte';
  import Cards from './Cards.svelte';

  import Settings from './Settings.svelte';
  import UserProfile from './UserProfile.svelte';
  export let isLoading: boolean;
  export let onUpdate: () => Promise<void>;
  export let username: string | undefined;

  const dispatch = createEventDispatcher();

  let showSettings: boolean;
</script>

{#if showSettings}
  <Settings bind:showSettings />
{/if}

<div class="header flex justify-end w-full px-5 mt-4 md:mb-20 mb-10">
  <div class="w-8/12 flex justify-center">
    <Cards />
  </div>
  <div class="flex w-1/8 ">
    <div
      class="h-8 w-8 flex cursor-pointer shadow-md rounded-2xl "
      on:click={async () => {
        isLoading = true;
        await onUpdate();
        isLoading = false;
      }}
    >
      <img
        src="images/refresh.png"
        class="reload"
        class:isLoading
        alt="refresh page"
        style="animation-duration: 1000ms;"
      />
    </div>
    <div
      class="h-8 w-8 flex cursor-pointer shadow-md rounded-2xl ml-6"
      data-automation-id="telegram-link"
      on:click={() => window.open('https://t.me/exodus_MonobankBudgetBot')}
    >
      <img src="images/tg.png" alt="telegram" />
    </div>
    <div class="user flex items-center" />
    <div class="logout ml-6 user flex">
      {#if username}<UserProfile
          bind:showSettings
          user={username}
          on:logout={async () => {
            await logout();
            dispatch('logout', {});
          }}
        />{/if}
    </div>
  </div>
</div>

<style>
  .reload.isLoading {
    animation-name: spin;
  }
  @keyframes spin {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
