<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let duration: number = 1000;
  let isLoading: boolean;
  const dispatch = createEventDispatcher();
</script>

<div
  class="h-8 w-8 flex cursor-pointer shadow-md rounded-2xl mx-2 "
  on:click={(e) => {
    isLoading = true;
    dispatch('click', e);
    setTimeout(() => (isLoading = false), duration);
  }}
>
  <img
    src="images/refresh.png"
    class="reload"
    class:isLoading
    alt="refresh page"
    style="animation-duration: 1000ms;"
  />
</div>

<style>
  .reload.isLoading {
    animation-name: spin;
  }
  @keyframes spin {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
  @media (max-width: 600px) {
    .header {
      max-width: 300px;
    }
  }
</style>
