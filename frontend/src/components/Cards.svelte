<script lang="ts">
  import type { CardType } from '../types/Api';
  import Card from './Card.svelte';

  let activeCard: number = 1;
  type CardData = { pan: string[]; type: CardType };
  export let cards: CardData[];
  export let currentCardType: CardType = cards[0].type;

  let offsetWidth: number;
  let isOpen = false;
  $: isMobile = offsetWidth < 300;
</script>

<div
  class="mr-16 flex"
  class:isMobile
  bind:offsetWidth
  on:click={() => (isOpen = !isOpen)}
>
  {#if isMobile && !isOpen}
    <div class="my-2">
      {#if activeCard > 0}
        <Card
          {...cards[activeCard - 1]}
          index={activeCard}
          bind:activeCard
          on:click={() => {
            currentCardType = cards[activeCard - 1].type;
          }}
        />
      {:else}
        {#each cards as card, i}
          <div class="relative -mt-{i * 8} ml-{i * 2}">
            <Card
              {...card}
              index={0}
              bind:activeCard
              on:click={() => {
                currentCardType = card.type;
                isOpen = false;
              }}
            />
          </div>
        {/each}
      {/if}
    </div>
  {:else}
    {#each cards as card, i}
      <div class="my-2">
        <Card
          {...card}
          index={i + 1}
          bind:activeCard
          on:click={() => {
            currentCardType = card.type;
          }}
        />
      </div>
    {/each}
    {#if cards.length > 1}
      <div
        on:click={() => {
          activeCard = 0;
          currentCardType = 'all';
        }}
        class="my-2"
      >
        {#each cards as card, i}
          <div class="relative -mt-{i * 8} ml-{i * 2}">
            <Card
              {...card}
              index={0}
              bind:activeCard
              on:click={() => {
                currentCardType = card.type;
              }}
            />
          </div>
        {/each}
        <!-- <div class="h-10 bg-gray-500 w-24 relative rounded-lg" />
    <div class="h-10 bg-black w-24 relative -mt-8 ml-2 rounded-lg" /> -->
      </div>
    {/if}
  {/if}
</div>

<style>
  .isActive > div {
    box-shadow: 0 0 2px 2px #818181;
  }

  .isMobile {
    flex-direction: column;
  }
</style>
