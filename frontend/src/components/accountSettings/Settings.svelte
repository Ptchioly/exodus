<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import DeleteUser from './DeleteUser.svelte';
  import ErrorMessage from '../ErrorMessage.svelte';
  import PasswordChange from './PasswordChange.svelte';
  import XtokenChange from './XtokenChange.svelte';
  import ChangeLanguage from './ChangeLanguage.svelte';
  import { _ } from 'svelte-i18n';
  import Navigation from './Navigation.svelte';

  let state: 'password' | 'x-token' | 'deleteUser' | 'changeLanguage' =
    'password';
  let error = false;
  let errorMessage = '';

  const dispatch = createEventDispatcher();
</script>

<div id="bg" class="w-full z-0 bg-shade dark:bg-shadeDark">
  {#if error}
    <ErrorMessage message={errorMessage} />
  {/if}
  <div
    id="content"
    class="flex xs:flex-col sm:flex-row bg-white rounded-lg sm:min-w-max-content overlay dark:bg-dark dark:text-gray-300"
  >
    <Navigation bind:state on:close />
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
    backdrop-filter: blur(2px);
  }
  #content {
    min-height: 20rem;
  }
  .overlay {
    z-index: 4000;
  }
</style>
