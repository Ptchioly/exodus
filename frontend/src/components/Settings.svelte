<script lang="ts">
  import { updatePassword, deleteUser } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';
  import DeleteUser from './DeleteUser.svelte';
  import ErrorMessage from './ErrorMessage.svelte';
  import PasswordChange from './PasswordChange.svelte';
  import XtokenChange from './XtokenChange.svelte';

  let state: 'password' | 'x-token' | 'deleteUser' = 'password';
  let error = false;
  let errorMessage = '';

  export let showSettings: boolean;
</script>

<div id="bg" class="w-full z-0">
  {#if error}
    <ErrorMessage bind:visible={error} {errorMessage} />
  {/if}
  <div id="content" class="flex flex-row bg-white rounded-lg min-w-max-content">
    <div
      class="flex-col px-5 text-left border-r-2 border-gray-600 min-w-max-content relative"
    >
      <div class="cursor-pointer mt-5" on:click={() => (state = 'password')}>
        Change password
      </div>
      <div class="cursor-pointer mt-5" on:click={() => (state = 'x-token')}>
        Change X-Token
      </div>
      <div class="cursor-pointer mt-5" on:click={() => (state = 'deleteUser')}>
        Delete User
      </div>
      <div
        class="cursor-pointer absolute bottom-5 bg-coolGreen-default py-1 px-3 rounded-md text-white"
        on:click={() => (showSettings = false)}
      >
        Close
      </div>
    </div>
    <div class="ml-10 mt-5">
      {#if state === 'password'}
        <PasswordChange bind:error bind:errorMessage />
      {:else if state === 'x-token'}
        <XtokenChange bind:error bind:errorMessage />
      {:else if state === 'deleteUser'}
        <DeleteUser bind:error bind:errorMessage />
      {/if}
    </div>
  </div>
</div>

<style>
  #bg {
    position: fixed;
    height: 100%;
    background: rgb(0, 121, 191);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 300;
    display: flex;
    flex-direction: column;
    padding-top: 32px;
    justify-content: center;
    align-items: center;
    user-select: none;
    background-color: rgba(0, 121, 191, 0.3);
  }

  #content {
    min-width: 60%;
    min-height: 20rem;
  }
</style>
