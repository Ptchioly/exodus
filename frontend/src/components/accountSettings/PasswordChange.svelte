<script lang="ts">
  import { updatePassword } from '../../endpointApi';
  import { isSuccessResponse } from '../../types/guards';
  import { _ } from 'svelte-i18n';
  import PasswordInput from './PasswordInput.svelte';

  export let error: boolean;
  export let errorMessage: number;

  let currentPass: string;
  let newPass: string;
  let confirmPass: string;
  let show = false;
  let label =
    'ml-5 border-gray-400 border-2 rounded-md pl-3 mr-5 dark:bg-darker dark:border-black';

  const changePassword = async (
    current: string,
    newPass: string,
    confirm: string
  ) => {
    if (newPass === confirm) {
      const response = await updatePassword(current, newPass);
      if (!isSuccessResponse(response)) {
        error = true;
        errorMessage = response.error;
      }
    }
  };
</script>

<div class="flex flex-col justify-between">
  <div class="flex flex-row">
    <div class="flex flex-col min-w-max-content text-left">
      <div class="">{$_('settings.change_pwd.curr_pwd')}</div>
      <div class="mt-4">{$_('settings.change_pwd.new_pwd')}</div>
      <div class="mt-4">{$_('settings.change_pwd.conf_pwd')}</div>
    </div>
    <div class="flex flex-col">
      <PasswordInput
        bind:inputValue={currentPass}
        margin="mt-0"
        bind:show
        dataAut="current-password"
        {label}
        type="curr"
      />
      <PasswordInput
        bind:inputValue={newPass}
        margin="mt-3"
        bind:show
        dataAut="new-password"
        {label}
        type="new"
      />
      <PasswordInput
        bind:inputValue={confirmPass}
        margin="mt-3"
        bind:show
        dataAut="password-check"
        {label}
        type="conf"
      />
    </div>
  </div>
  <button
    type="submit"
    on:click={() => changePassword(currentPass, newPass, confirmPass)}
    class="mt-4 self-start bg-indigo-500 py-1 px-3 rounded-md text-white"
    data-automation-id="change-password"
    >{$_('settings.change_pwd.change')}</button
  >
</div>
