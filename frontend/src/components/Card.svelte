<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { CardType } from '../types/Api';

  export let activeCard: number;
  export let index: number = -1;
  export let pan: string[];
  export let type: CardType;

  const dispatch = createEventDispatcher();

  const cardTypeStyle: Record<CardType, { bg: string; text: string }> = {
    black: { bg: '#000000', text: '#FFFFFF' },
    platinum: { bg: '#d0cfcd', text: '#000000' },
    white: { bg: '#FFFFFF', text: '#6c6c6c' },
    //needs to add actual
    fop: { bg: '#000000', text: '#FFFFFF' },
    iron: { bg: '#000000', text: '#FFFFFF' },
    yellow: { bg: 'yellow', text: '#FFFFFF' },
  };

  const { bg, text } = cardTypeStyle[type];
  let style = `background-color: ${bg}`;
</script>

<div
  class="w-24 mr-2"
  on:click={(e) => {
    dispatch('click', e);
    activeCard = index;
  }}
>
  <div
    class="card rounded-lg flex items-end p-1 h-12 flex-col justify-between border-gray-600 "
    {style}
    class:isActive={activeCard === index}
  >
    <div class="pan font-bold" style="color: {text}">
      {type}
    </div>
    <div>
      {#each pan as p}
        <div class="pan self-end items-end ml-4" style="color: {text}">
          {p}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .pan {
    font-size: 0.5em;
    opacity: 0.8;
  }

  .card {
    box-shadow: 0 0 1px 1px #818181;
  }
  .card.isActive {
    box-shadow: 0 0 2px 2px #818181;
  }
</style>
