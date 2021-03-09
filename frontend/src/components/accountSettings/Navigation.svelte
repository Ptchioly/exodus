<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';

  export let state: 'password' | 'x-token' | 'deleteUser' | 'changeLanguage';

  const dispatch = createEventDispatcher();
</script>

<div
  class="sm:flex-col px-5 sm:text-left xs:border-b-1 sm:border-solid sm:border-r-2 border-gray-600 relative"
>
  <div
    class="nav-button"
    on:click={() => (state = 'password')}
    data-automation-id="change-password-nav"
  >
    {$_('settings.change_pwd.title')}
  </div>
  <div
    class="nav-button"
    on:click={() => (state = 'x-token')}
    data-automation-id="change-token-nav"
  >
    {$_('settings.change_token.title')}
  </div>
  <div
    class="nav-button"
    on:click={() => (state = 'changeLanguage')}
    data-automation-id="change-language"
  >
    {$_('settings.change_lang.title')}
  </div>
  <div
    class="nav-button"
    on:click={() => (state = 'deleteUser')}
    data-automation-id="delete-user-nav"
  >
    {$_('settings.delete_usr.title')}
  </div>
  <div
    class="cursor-pointer sm:absolute xs:mt-2 m-auto sm:bottom-5 bg-red-600 py-1 px-3 rounded-md text-white text-center"
    on:click={() => dispatch('close')}
    data-automation-id="close-settings"
  >
    {$_('settings.close')}
  </div>
</div>

<style lang="postcss">
  .nav-button {
    @apply cursor-pointer xs:mt-2 sm:mt-5;
  }
</style>
