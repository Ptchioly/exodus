<script lang="ts">
  import { updatePassword } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';
  import Input from './Input.svelte';

  export let error: boolean;
  export let errorMessage: string;

  let currentPass: string;
  let newPass: string;
  let confirmPass: string;
  let show = false;
  let label = 'ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5';

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
</script>

<div class="flex flex-col">
  <div class="flex flex-row">
    <div class="flex flex-col min-w-max-content text-left">
      <div class="">Current Password</div>
      <div class="mt-4">New Password</div>
      <div class="mt-4">Confirm Password</div>
    </div>
    <div class="flex flex-col">
      <div class="relative">
        {#if show}
          <Input
            type="text"
            bind:value={currentPass}
            placeholder="Current"
            dataAutomationId="current-password"
            className={label}
          />
        {:else}
          <Input
            type="password"
            bind:value={currentPass}
            placeholder="Current"
            dataAutomationId="current-password"
            className={label}
          />
        {/if}
        <div class="eye-icon leading-5">
          <div
            class:show
            on:click={() => (show = !show)}
            class="px-1 rounded-md"
          >
            <img src="images/show-password.svg" alt="show-password" />
          </div>
        </div>
      </div>
      <div class="relative">
        {#if show}
          <Input
            type="text"
            bind:value={newPass}
            placeholder="New"
            dataAutomationId="new-password"
            className={`${label} mt-3`}
          />
        {:else}
          <Input
            type="password"
            bind:value={newPass}
            placeholder="New"
            dataAutomationId="new-password"
            className={`${label} mt-3`}
          />
        {/if}
        <div class="eye-icon leading-5 mt-3">
          <div
            class:show
            on:click={() => (show = !show)}
            class="px-1 rounded-md"
          >
            <img src="images/show-password.svg" alt="show-password" />
          </div>
        </div>
      </div>
      <div class="relative">
        {#if show}
          <Input
            type="text"
            bind:value={confirmPass}
            placeholder="Confirm"
            dataAutomationId="password-check"
            className={`${label} mt-3`}
          />
        {:else}
          <Input
            type="password"
            bind:value={confirmPass}
            placeholder="Confirm"
            dataAutomationId="password-check"
            className={`${label} mt-3`}
          />
        {/if}
        <div class="eye-icon leading-5 mt-3">
          <div
            class:show
            on:click={() => (show = !show)}
            class="px-1 rounded-md"
          >
            <img src="images/show-password.svg" alt="show-password" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <button
    type="submit"
    on:click={() => changePassword(currentPass, newPass, confirmPass)}
    class="mt-4 self-start bg-coolGreen-default py-1 px-3 rounded-md text-white xs:mb-5"
    data-automation-id="change-password">Change</button
  >
</div>

<style lang="postcss">
  div.show {
    background-color: #ccc;
  }

  .label {
    @apply ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5;
  }

  .eye-icon {
    @apply absolute inset-y-0 right-4 pr-3 flex items-center text-sm leading-5;
  }
</style>
