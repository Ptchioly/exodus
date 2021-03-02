<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import DeleteUser from './DeleteUser.svelte';
  import ErrorMessage from '../ErrorMessage.svelte';
  import PasswordChange from './PasswordChange.svelte';
  import XtokenChange from './XtokenChange.svelte';
  import ChangeLanguage from './ChangeLanguage.svelte';
  import { _ } from "svelte-i18n";

  let state: 'password' | 'x-token' | 'deleteUser' | 'changeLanguage' = 'password';
  let error = false;
  let errorMessage = '';

  const dispatch = createEventDispatcher();
</script>

<div id="bg" class="w-full z-0">
  {#if error}
    <ErrorMessage message={errorMessage} />
  {/if}
  <div
    id="content"
    class="flex xs:flex-col sm:flex-row bg-white rounded-lg sm:min-w-max-content overlay"
  >
    <div
      class="xs:flex-row xs:justify-between sm:flex-col px-5 sm:text-left xs:border-b-1 sm:border-solid sm:border-r-2 border-gray-600 relative"
    >
      <div
        class="nav-button"
        on:click={() => (state = 'password')}
        data-automation-id="change-password-nav"
      >
      {$_("settings.change_pwd.title")}
      </div>
      <div
        class="nav-button"
        on:click={() => (state = 'x-token')}
        data-automation-id="change-token-nav"
      >
      {$_("settings.change_token.title")}
      </div>
      <div
        class="nav-button"
        on:click={() => (state = 'deleteUser')}
        data-automation-id="delete-user-nav"
      >
      {$_("settings.delete_usr.title")}
      </div>
      <div
      class="nav-button"
      on:click={() => (state = 'changeLanguage')}
      data-automation-id="change-language"
    >
    {$_("settings.change_lang.title")}
    </div>
      <div
        class="cursor-pointer sm:absolute xs:mt-2 m-auto w-1/4 sm:bottom-5 bg-red-600 py-1 px-3 rounded-md text-white text-center"
        on:click={() => dispatch('close')}
        data-automation-id="close-settings"
      >
      {$_("settings.close")}
      </div>
    </div>
    <div class="ml-10 mt-5">
      {#if state === 'password'}
        <PasswordChange bind:error bind:errorMessage />
      {:else if state === 'x-token'}
        <XtokenChange bind:error bind:errorMessage />
      {:else if state === 'deleteUser'}
        <DeleteUser bind:error bind:errorMessage on:logout />
      {:else if state === 'changeLanguage'}
        <ChangeLanguage />
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  #bg {
    position: fixed;
    height: 100%;
    background: rgb(0, 121, 191);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4000;
    display: flex;
    flex-direction: column;
    padding-top: 32px;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 121, 191, 0.3);
  }
  #content {
    min-height: 20rem;
  }
  .overlay {
    z-index: 4000;
  }
  .nav-button {
    @apply cursor-pointer xs:mt-2 sm:mt-5;
  }
</style>
