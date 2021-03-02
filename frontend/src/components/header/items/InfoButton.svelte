<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div
  class="h-8 w-8 rounded-2xl cursor-pointer shadow-md mx-2"
  on:click={() => dispatch('openFAQ')}
>
  <img src="images/question.png" alt="info" />
</div>
