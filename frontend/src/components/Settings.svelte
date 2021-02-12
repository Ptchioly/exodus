<script lang="ts">
  import { updatePassword, deleteUser } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';
  import ErrorMessage from './ErrorMessage.svelte';
  import PasswordChange from './PasswordChange.svelte';

  let state: 'password' | 'x-token' | 'deleteUser' = 'password';
  let error;
  let errorMessage;
  let xToken;

  const changePassword = async (
    current: string,
    newPass: string,
    confirm: string
  ) => {
    if (newPass === confirm) {
      const response = await updatePassword(current, newPass);
      if (!isSuccessResponse(response)) {
        error = true;
        errorMessage = response.message;
      }
    }
  };

  const handleDeleteUser = async () => {
    const response = await deleteUser();
    if (!isSuccessResponse(response)) {
      console.log('log');
      error = true;
      errorMessage = 'Failed to delete user';
    } else {
      location.reload();
    }
  };
</script>

<div id="bg" class="w-full z-0">
  {#if error}
    <ErrorMessage bind:visible={error} {errorMessage} />
  {/if}
  <div id="content" class="flex max-w-lg relative flex-row bg-white rounded-sm">
    <div
      class="flex-col px-5 text-left border-r-2 border-gray-600 min-w-max-content"
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
    </div>
    <div class="ml-10 mt-5">
      {#if state === 'password'}
        <PasswordChange bind:error bind:errorMessage />
      {:else if state === 'x-token'}
        <div class="flex flex-row mt-2">
          <div>X-Token</div>
          <input
            bind:value={xToken}
            placeholder="X-Token"
            class="ml-5 border-r-2 border-gray-400 border-2 rounded-md pl-3 mr-5"
          />
        </div>
      {:else if state === 'deleteUser'}
        <div class="flex flex-row mt-2">
          <div>Delete user?</div>
          <button
            class="ml-5 bg-coolGreen-default rounded-md py-2 px-3"
            on:click={handleDeleteUser}>Delete</button
          >
        </div>
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
