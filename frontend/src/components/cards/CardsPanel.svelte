<script lang="ts">
  import { fly } from 'svelte/transition';

  import type { CardType, Account } from '../../types/Api';
  import Card from './Card.svelte';
  import MultipleCards from './MultipleCards.svelte';

  export let accounts: Account[];
  export let currentAccountId: string;

  let activeCard: number = accounts.findIndex(
    ({ id }) => id === currentAccountId
  );

  let currentCardType: CardType = accounts[activeCard]?.type || 'all';

  let offsetWidth: number;
  let isOpen = false;

  $: isMobile = offsetWidth < 400;
  $: currentAccountId = accounts[activeCard]?.id || 'all';
  $: currentCardType = accounts[activeCard]?.type || 'all';
  $: mobileFly = isMobile ? fly : () => null;
</script>

<div class="flex justify-start">
  <div
    class="flex cards w-1/2 md:max-h-16 xs:h-28"
    bind:offsetWidth
    on:click={() => (isOpen = !isOpen)}
    class:isMobile
  >
    <!-- Closed cards for mobile version -->
    {#if isMobile && !isOpen}
      <div class="my-2">
        {#if activeCard > -1}
          <Card
            {...accounts[activeCard]}
            type={currentCardType}
            index={activeCard}
            {activeCard}
          />
        {:else}
          <MultipleCards {accounts} index={-1} {activeCard} />
        {/if}
      </div>

      <!-- Opened cards in row for both versions -->
    {:else}
      <div class="w-full flex flex-row max-h-16 xs:h-28" class:isMobile>
        {#each accounts as account, i}
          <div class="my-2" in:mobileFly={{ duration: 500, x: i && -100 }}>
            <Card
              {...account}
              index={i}
              bind:activeCard
              on:click={() => (activeCard = i)}
            />
          </div>
        {/each}

        {#if accounts.length > 1}
          <div
            on:click={() => (activeCard = -1)}
            class="my-2"
            in:mobileFly={{ duration: 500, x: -100 }}
          >
            <MultipleCards {accounts} index={-1} {activeCard} />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .isActive > div {
    box-shadow: 0 0 2px 2px #818181;
  }

  .isMobile {
    flex-direction: row;
  }
</style>
