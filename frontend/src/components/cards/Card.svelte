<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { CardType } from '../../types/Api';

  export let activeCard: number;
  export let index: number = -1;
  export let pan: string[];
  export let type: CardType;

  const dispatch = createEventDispatcher();

  const cardTypeStyle: Record<
    CardType,
    { bg: string; text: string; grad: string }
  > = {
    black: { bg: '#000000', text: '#FFFFFF', grad: '#6c6c6c' },
    platinum: { bg: 'rgb(245 193 191)', text: '#000000', grad: '#ffffff' },
    white: { bg: '#FFFFFF', text: '#6c6c6c', grad: '#ffffff' },
    //needs to add actual
    fop: { bg: '#000000', text: '#FFFFFF', grad: '#ffffff' },
    iron: { bg: '#000000', text: '#FFFFFF', grad: '#ffffff' },
    yellow: { bg: 'yellow', text: '#FFFFFF', grad: '#ffffff' },
    all: { bg: 'yellow', text: '#FFFFFF', grad: '#ffffff' },
  };

  const { bg, text, grad } = cardTypeStyle[type];
  let style = `background: linear-gradient(150deg, ${grad}, ${bg})`;
</script>

<div
  class="md:w-24 xs:w-32 mr-2 cursor-pointer"
  on:click={(e) => dispatch('click', e)}
>
  <div
    class="card rounded-md flex items-end md:p-1 xs:p-1 md:h-12 xs:h-16 flex-col md:justify-center xs:justify-between border-gray-600"
    {style}
    class:isActive={activeCard === index}
  >
    <div
      class="pan md:text-tiny xs:text-sm font-bold xs:mt-2 md:mt-0"
      style="color: {text}"
    >
      {type}
    </div>
    <div class="xs:mb-2 md:mb-0 flex flex-col items-end">
      {#each pan as p}
        <div
          class="pan self-end items-end md:text-tiny xs:text-sm ml-4 p-0 "
          style="color: {text}"
        >
          {p}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .pan {
    opacity: 0.8;
  }

  .card {
    border: 1px solid #acacac;
  }
  .card.isActive {
    border: none;
    box-shadow: 0 0 2px 2px #a5a5a5;
  }
</style>
