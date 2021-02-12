<script lang="ts">
  import { updatePassword } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';

  export let error;
  export let errorMessage;

  let currentPass = '';
  let newPass = '';
  let confirmPass = '';

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
      <input
        bind:value={currentPass}
        placeholder="Current"
        class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 max-w-xs"
      />
      <input
        bind:value={newPass}
        placeholder="New"
        class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 mt-3"
      />
      <input
        bind:value={confirmPass}
        placeholder="Confirm"
        class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 mt-3"
      />
    </div>
  </div>
  <button
    type="submit"
    on:click={() => changePassword(currentPass, newPass, confirmPass)}
    class="mt-4 self-start bg-coolGreen-default py-1 px-3 rounded-md text-white"
    >Change</button
  >
</div>
