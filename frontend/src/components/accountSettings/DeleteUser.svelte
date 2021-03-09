<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { deleteUser } from '../../endpointApi';
  import { isSuccessResponse } from '../../types/guards';
  import { _ } from 'svelte-i18n';

  export let error: boolean;
  export let message: string;

  const dispatch = createEventDispatcher();

  const handleDeleteUser = async () => {
    const confirmResponse = confirm($_('settings.delete_usr.confirmation_msg'));
    if (confirmResponse) {
      const response = await deleteUser();
      if (isSuccessResponse(response)) return dispatch('logout');
      error = true;
      message = $_('settings.delete_usr.error_msg');
    }
  };
</script>

<div class="flex flex-col mt-2 justify-between">
  <div>{$_('settings.delete_usr.msg')}</div>
  <button
    class="rounded-md py-1 px-3 box-content bg-red-600 text-white mr-5"
    data-automation-id="delete-user"
    on:click={handleDeleteUser}>{$_('settings.delete_usr.btn')}</button
  >
</div>
