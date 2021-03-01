<script lang="ts">
  import { updateXToken } from '../../endpointApi';
  import { isSuccessResponse } from '../../types/guards';

  export let error: boolean;
  export let errorMessage: string;

  let xToken = '';

  const handleXTokenChange = async (token) => {
    const response = await updateXToken(token);
    if (!isSuccessResponse(response)) {
      error = true;
      errorMessage = response.message;
    }
  };
</script>

<div class="flex flex-col">
  <div class="flex flex-row mt-2 items-center">
    <div>X-Token</div>
    <input
      bind:value={xToken}
      placeholder="X-Token"
      class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5"
      data-automation-id="new-xtoken"
    />
  </div>
  <button
    class="mt-4 self-start bg-coolGreen-default py-1 px-3 rounded-md text-white"
    data-automation-id="change-xtoken"
    on:click={() => handleXTokenChange(xToken)}>Send</button
  >
</div>
