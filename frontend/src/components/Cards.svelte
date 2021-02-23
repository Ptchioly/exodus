<script lang="ts">
  import Card from './Card.svelte';

  let activeCard: number;
  let cards = [
    { pan: '2222**********33', type: 'black' as 'black' },
    { pan: '2222**********33', type: 'white' as 'white' },
  ];
</script>

<div class="mr-16 flex">
  {#each cards as card, i}
    <Card {...card} index={i} bind:activeCard />
  {/each}
  <div
    class="opacity-50"
    class:isActive={activeCard === cards.length}
    on:click={() => (activeCard = cards.length)}
  >
    <div class="h-10 bg-gray-500 w-24 relative rounded-lg" />
    <div class="h-10 bg-black w-24 relative -mt-8 ml-2 rounded-lg" />
  </div>
</div>

<style>
  .isActive > div {
    box-shadow: 0 0 2px 2px #818181;
  }
</style>
