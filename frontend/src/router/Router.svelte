<script lang="ts">
  import { setContext } from 'svelte';
  import { KEY, state } from './store';

  setContext(KEY, { state });
</script>

<slot />
