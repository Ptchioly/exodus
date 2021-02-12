<script lang="ts">
  import { deleteUser } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';

  export let error;
  export let errorMessage;

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

<div class="flex flex-row mt-2 items-center">
  <div>Delete user?</div>
  <button
    class="ml-5 rounded-md py-1 px-3 box-content bg-red-600 text-white"
    on:click={handleDeleteUser}>Delete</button
  >
</div>
