<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { CardType } from '../types/Api';

  export let activeCard: number;
  export let index: number;
  export let pan: string[];
  export let type: CardType;

  const dispatch = createEventDispatcher();

  const cardTypeStyle: Record<CardType, { bg: string; text: string }> = {
    black: { bg: '#000000', text: '#FFFFFF' },
    white: { bg: '#FFFFFF', text: '#6c6c6c' },
    platinum: { bg: '#6c6c6c', text: '#000000' },
    //needs to add actual
    fop: { bg: '#000000', text: '#FFFFFF' },
    iron: { bg: '#000000', text: '#FFFFFF' },
    yellow: { bg: 'yellow', text: '#FFFFFF' },
  };

  const { bg, text } = cardTypeStyle[type];
  let style = `background-color: ${bg}`;
  console.log('style', style);
</script>

<div
  class="w-24 mr-2"
  on:click={(e) => {
    dispatch('click', e);
    activeCard = index;
  }}
>
  <div
    class="rounded-lg opacity-80 p-2 h-12 {type === 'white'
      ? 'border-gray-200 border-2'
      : ''}"
    {style}
    class:isActive={index === activeCard}
  >
    {#each pan as p}
      <div class="pan self-end items-end ml-4" style="color: {text}">
        {p}
      </div>
    {/each}
  </div>
</div>

<style>
  .pan {
    font-size: 0.5em;
  }
  .isActive {
    box-shadow: 0 0 2px 2px #818181;
  }
</style>
