<script lang="ts">
  import { updatePassword, deleteUser } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';
  import ErrorMessage from './ErrorMessage.svelte';

  let state: 'password' | 'x-token' | 'deleteUser' = 'password';
  let currentPass = '';
  let newPass = '';
  let confirmPass = '';
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

{#if error}
  <ErrorMessage bind:visible={error} {errorMessage} />
{/if}

<div id="bg" class="w-full z-0">
  <div id="content" class="flex max-w-lg relative flex-row bg-white">
    <div class="flex-col px-5 text-left border-r-2 border-gray-600">
      <div class="cursor-pointer" on:click={() => (state = 'password')}>
        Change password
      </div>
      <div class="cursor-pointer" on:click={() => (state = 'x-token')}>
        Change X-Token
      </div>
      <div class="cursor-pointer" on:click={() => (state = 'deleteUser')}>
        Delete User
      </div>
    </div>
    <div class="ml-10">
      {#if state === 'password'}
        <div class="flex flex-row mt-2">
          <div>Current Password</div>
          <input bind:value={currentPass} placeholder="Current" class="ml-5" />
        </div>
        <div class="flex flex-row mt-2">
          <div>New Password</div>
          <input bind:value={newPass} placeholder="New" class="ml-5" />
        </div>
        <div class="flex flex-row mt-2">
          <div>Confirm Password</div>
          <input bind:value={confirmPass} placeholder="Confirm" class="ml-5" />
        </div>
        <button
          type="submit"
          on:click={() => changePassword(currentPass, newPass, confirmPass)}
          >Change</button
        >
      {:else if state === 'x-token'}
        <div class="flex flex-row mt-2">
          <div>X-Token</div>
          <input bind:value={xToken} placeholder="X-Token" class="ml-5" />
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
    min-width: 50%;
  }
</style>
