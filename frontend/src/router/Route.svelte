<script lang="ts">
  import { getContext } from 'svelte';
  import { KEY } from './store';

  export let path: string;

  const { state } = getContext(KEY);
</script>

{#if $state === path}<slot />{/if}
