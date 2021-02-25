<script lang="ts">
  import { fly } from 'svelte/transition';

  import type { CardType, Account } from '../types/Api';
  import Card from './Card.svelte';

  export let accounts: Account[];
  export let currentAccountId: string;

  $: mobileFly = isMobile ? fly : () => null;

  let currentCardType: CardType =
    accounts.find(({ id }) => id === currentAccountId)?.type || 'all';

  let activeCard: number = accounts.findIndex(
    ({ id }) => id === currentAccountId
  );

  let cards = accounts.map(({ pan, type }) => ({ pan, type }));

  let offsetWidth: number;
  let isOpen = false;
  $: isMobile = offsetWidth < 300;
  $: currentAccountId =
    accounts.find(({ type }) => type === currentCardType)?.id || 'all';
</script>

<div
  class="flex cards"
  bind:offsetWidth
  on:click={() => (isOpen = !isOpen)}
  class:isMobile
>
  {#if isMobile && !isOpen}
    <div class="my-2">
      {#if activeCard > -1}
        <Card
          {...cards[activeCard]}
          type={currentCardType}
          index={activeCard}
          bind:activeCard
        />
      {:else}
        {#each cards as card, i}
          <div class="relative -mt-{i * 8} ml-{i * 2}">
            <Card {...card} index={-1} bind:activeCard />
          </div>
        {/each}
      {/if}
    </div>
  {:else}
    <div class="w-full flex flex-row" class:isMobile>
      {#each cards as card, i}
        <div class="my-2" in:mobileFly={{ duration: 500, x: i && -100 }}>
          <Card
            {...card}
            index={i}
            bind:activeCard
            on:click={() => {
              currentCardType = card.type;
            }}
          />
        </div>
      {/each}

      {#if cards.length > 0}
        <div
          on:click={() => {
            activeCard = -1;
            currentCardType = 'all';
          }}
          class="my-2"
          in:mobileFly={{ duration: 500, x: -100 }}
        >
          {#each cards as card, i}
            <div class="relative -mt-{i * 8} ml-{i * 2}">
              <Card {...card} index={-1} {activeCard} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .isActive > div {
    box-shadow: 0 0 2px 2px #818181;
  }

  .isMobile {
    flex-direction: row;
  }
  .cards.isMobile {
    width: 100%;
  }
</style>
