<script lang="ts">
  import type { Account } from '../../types/Api';
  import Card from './Card.svelte';

  export let accounts: Account[];
  export let activeCard: number;
  export let index: number;
  export let isMobile = false;

  const multipleCardsStyle = (i: number) =>
    `margin-top: -${i * 2 + 0.5}rem; margin-left: ${i * 1}rem`;
</script>

{#each accounts as { pan, type }, i}
  <div class="relative" style={multipleCardsStyle(i)}>
    <Card {pan} {type} index={-1} {activeCard} />
  </div>
{/each}
