<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { logout } from '../endpointApi';
  import Settings from './Settings.svelte';
  import UserProfile from './UserProfile.svelte';

  export let isLoading: boolean;
  export let onUpdate: () => Promise<void>;
  export let username: string | undefined;

  export let currentAccountId: string;

  const dispatch = createEventDispatcher();

  let showSettings: boolean;
</script>

{#if showSettings}
  <Settings bind:showSettings />
{/if}

<div class="header flex justify-between w-full px-5 mt-4 mb-10 pl-10">
  <div class="w-8/12 flex justify-between ">
    <div
      class="mx-8 mt-1 py-0.5 px-4 text-sm bg-coolGreen-lessLight h-6 rounded-lg shadow-md font-bold text-white"
    >
      alpha
    </div>
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
      {#if username}
        <UserProfile
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
