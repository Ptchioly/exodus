<script lang="ts">
  import { updatePassword } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';

  export let error: boolean;
  export let errorMessage: string;

  let currentPass = '';
  let newPass = '';
  let confirmPass = '';
  let show = false;
  let type = 'text'

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

  $: type = (show ? 'text' : 'password')
</script>

<div class="flex flex-col">
  <div class="flex flex-row">
    <div class="flex flex-col min-w-max-content text-left">
      <div class="">Current Password</div>
      <div class="mt-4">New Password</div>
      <div class="mt-4">Confirm Password</div>
    </div>
    <div class="flex flex-col">
      <div class='relative'>
        <input
          bind:value={currentPass}
          placeholder="Current"
          class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 max-w-"
          data-automation-id="current-password"
        />
        <div class="absolute inset-y-0 right-5 pr-3 flex items-center text-sm leading-5"
      >
        <div class:show on:click={() => (show = !show)} class="px-1">
          <img src="images/show-password.svg" alt="show-password" />
        </div>
      </div>
      </div>
      <div class="relative">
        <input
          bind:value={newPass}
          placeholder="New"
          class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 mt-3"
          data-automation-id="new-password"
        />
      </div>
      <div class="relative">
        <input
          bind:value={confirmPass}
          placeholder="Confirm"
          class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 mt-3"
          data-automation-id="password-check"
        />
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
