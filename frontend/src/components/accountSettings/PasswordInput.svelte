<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Input from '../inputs/Input.svelte';

  export let inputValue: string;
  export let show: boolean;
  export let dataAut: string;
  export let label: string;
  export let margin: string;
</script>

<div class="relative">
  {#if show}
    <Input
      type="text"
      bind:value={inputValue}
      placeholder={$_('settings.change_pwd.curr_pwd_holder')}
      dataAutomationId={dataAut}
      className={`${label} ${margin}`}
    />
  {:else}
    <Input
      type="password"
      bind:value={inputValue}
      placeholder={$_('settings.change_pwd.curr_pwd_holder')}
      dataAutomationId={dataAut}
      className={`${label} ${margin}`}
    />
  {/if}
  <div class={`eye-icon leading-5 ${margin}`}>
    <div class:show on:click={() => (show = !show)} class="px-1 rounded-md">
      <img src="images/show-password.svg" alt="show-password" />
    </div>
  </div>
</div>

<style lang="postcss">
  div.show {
    background-color: #ccc;
  }

  .eye-icon {
    @apply absolute inset-y-0 right-4 pr-3 flex items-center text-sm leading-5;
  }
</style>
