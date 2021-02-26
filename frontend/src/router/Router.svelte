<script context="module" lang="ts">
  import type { NavigationState } from '../types/Layout';
  import { writable } from 'svelte/store';

  export const state = writable<NavigationState>('loading');
  export const setState = (newState: NavigationState) => {
    console.log('setState => state', newState);
    state.set(newState);
  };
</script>

<slot />
