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
    class="login-input mt-5"
    data-automation-id="pwd-input"
    type="text"
    {placeholder}
    bind:value
    on:input={handleInput}
  />
{:else}
  <input
    class="login-input mt-5"
    type="password"
    data-automation-id={dataAut}
    {placeholder}
    bind:value
    on:input={handleInput}
  />
{/if}
<div
  class="pt-8 absolute float-right ml-48 md:ml-56 cursor-pointer"
  on:click={() => (show = !show)}
>
  <div class:show>
    <img src="images/show-password.svg" alt="show-password" />
  </div>
</div>

<style lang="postcss">
  .show {
    @apply rounded-2xl bg-gray-300 px-1;
  }
</style>
