<script lang="ts">
  export let activeCard: number;
  export let index: number;
  export let pan: string;
  export let type: 'black' | 'white';
  let style = `background-color: ${type === 'black' ? '#000000' : '#FFFFFF'}`;
  console.log('style', style);
</script>

<div class="w-24 mr-2" on:click={() => (activeCard = index)}>
  <div
    class="rounded-lg opacity-80 p-2 h-12 {type === 'white'
      ? 'border-gray-200 border-2'
      : ''}"
    {style}
    class:isActive={index === activeCard}
  >
    <div
      class="{type === 'black' ? 'text-white' : 'text-gray-500'} pan mt-4 ml-4"
    >
      {pan}
    </div>
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
