<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  export let errorMessage: string;
  export let visible: boolean;

  onMount(async () => {
    setTimeout(() => {
      visible = false;
    }, 10000);
  });
</script>

<div
  class=" mt-2 lg:mt-7 absolute text-center flex justify-center top-0 right-0 left-0"
>
  <p
    class="relative m-auto block min-w-min max-w-xl bg-red-300 rounded-md border-red-700 border-solid border-2 py-3 px-5"
  >
    {errorMessage}
  </p>
</div>
