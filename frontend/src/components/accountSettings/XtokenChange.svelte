<script lang="ts">
  import { updateXToken } from '../../endpointApi';
  import { isSuccessResponse } from '../../types/guards';
  import { _ } from 'svelte-i18n';

  export let error: boolean;
  export let errorMessage: number;

  let xToken = '';

  const handleXTokenChange = async (token) => {
    const response = await updateXToken(token);
    if (!isSuccessResponse(response)) {
      error = true;
      errorMessage = response.error;
    }
  };
</script>

<div class="flex flex-col justify-between">
  <div class="flex flex-row mt-2 items-center">
    <div>X-Token</div>
    <input
      bind:value={xToken}
      placeholder="X-Token"
      class="ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 dark:bg-darker dark:border-black"
      data-automation-id="new-xtoken"
    />
  </div>
  <button
    class="self-start bg-indigo-500 py-1 px-3 rounded-md text-white"
    data-automation-id="change-xtoken"
    on:click={() => handleXTokenChange(xToken)}
    >{$_('settings.change_token.btn')}</button
  >
</div>
