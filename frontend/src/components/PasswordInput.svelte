<script lang="ts">
  import type { Validator } from '../types/Layout';

  export let value: string;
  export let dataAut = 'pwd-input';
  export let placeholder: string;
  export let isValid: boolean = false;
  export let validator: Validator | undefined;

  let show: boolean = false;

  const handleInput = () => {
    isValid = validator ? validator(value) : true;
  };
</script>

<div class="py-2 w-3/4">
  <div class="relative w-full">
    {#if show}
      <input
        class="text-md text-gray-700 placeholder-gray-500 border-gray-200  border-2  pl-2  block px-3 mt-5 py-2 rounded-lg w-full"
        data-automation-id={dataAut}
        type="text"
        {placeholder}
        bind:value
        on:input={handleInput}
      />
    {:else}
      <input
        class="text-md text-gray-700 placeholder-gray-500 border-gray-200  border-2  pl-2  block px-3 mt-5 py-2 rounded-lg w-full"
        data-automation-id={dataAut}
        type="password"
        {placeholder}
        bind:value
        on:input={handleInput}
      />
    {/if}
    <div
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
    >
      <div class:show on:click={() => (show = !show)} class="px-1">
        <img src="images/show-password.svg" alt="show-password" />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .show {
    @apply rounded-2xl bg-gray-300;
  }
</style>
