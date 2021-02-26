<script lang="ts">
  import { state } from './Router.svelte';
  export let path: string;
  $: show = $state === path;
</script>

{#if show}<slot />{/if}
