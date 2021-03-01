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

{#if show}
  <input
    class="pwd-input text-lg"
    data-automation-id={dataAut}
    type="text"
    {placeholder}
    bind:value
    on:input={handleInput}
  />
{:else}
  <input
    class="pwd-input text-lg"
    data-automation-id={dataAut}
    type="password"
    {placeholder}
    bind:value
    on:input={handleInput}
  />
{/if}
<div
  class="absolute bottom-2 md:bottom-3 right-0 pr-3 flex items-center text-sm leading-5"
>
  <div class:show on:click={() => (show = !show)} class="px-1">
    <img src="images/show-password.svg" alt="show-password" />
  </div>
</div>

<style lang="postcss">
  .show {
    @apply rounded-2xl bg-gray-300;
  }

  .pwd-input {
    @apply flex content-center self-center text-gray-700 placeholder-gray-500 border-gray-200 pl-1 border-2 mt-5 py-2 rounded-lg w-full;
  }

  input:-webkit-autofill::first-line {
    font-size: 1.125rem;
    line-height: 1.75rem;
    --tw-text-opacity: 1;
    color: rgba(64, 64, 64, var(--tw-text-opacity));
  }
</style>
