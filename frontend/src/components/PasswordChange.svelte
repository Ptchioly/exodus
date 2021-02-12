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

<div class="flex flex-row mt-2">
  <div>Current Password</div>
  <input
    bind:value={currentPass}
    placeholder="Current"
    class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5"
  />
</div>
<div class="flex flex-row mt-2">
  <div>New Password</div>
  <input
    bind:value={newPass}
    placeholder="New"
    class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5"
  />
</div>
<div class="flex flex-row mt-2">
  <div>Confirm Password</div>
  <input
    bind:value={confirmPass}
    placeholder="Confirm"
    class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5"
  />
</div>
<button
  type="submit"
  on:click={() => changePassword(currentPass, newPass, confirmPass)}
  >Change</button
>
