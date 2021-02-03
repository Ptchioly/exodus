<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { logout } from '../endpointApi';
  const dispatch = createEventDispatcher();
</script>

<div>YO MOTHERFUCKER</div>
<div>TI PTCHIOLA</div>
<div
  on:click={async () => {
    await logout();
    dispatch('logout', {});
  }}
>
  Logout
</div>
