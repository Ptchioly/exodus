<script lang="ts">
  import type { CardType } from '../types/Api';
  import Card from './Card.svelte';

  let activeCard: number = 1;
  type CardData = { pan: string[]; type: CardType };
  export let cards: CardData[];
  export let currentCardType: CardType = cards[0].type;
</script>

<div class="mr-16 flex">
  {#each cards as card, i}
    <Card
      {...card}
      index={i + 1}
      bind:activeCard
      on:click={() => (currentCardType = card.type)}
    />
  {/each}
  <div
    id="a"
    on:click={() => {
      activeCard = 0;
      currentCardType = 'all';
    }}
  >
    {#each cards as card, i}
      <div class="relative -mt-{i * 8} ml-{i * 2}">
        <Card
          {...card}
          index={0}
          bind:activeCard
          on:click={() => (currentCardType = card.type)}
        />
      </div>
    {/each}
    <!-- <div class="h-10 bg-gray-500 w-24 relative rounded-lg" />
    <div class="h-10 bg-black w-24 relative -mt-8 ml-2 rounded-lg" /> -->
  </div>
</div>

<style>
  .isActive > div {
    box-shadow: 0 0 2px 2px #818181;
  }
</style>
