<script lang="ts">
  import MonoLogo from './MonoLogo.svelte';

  export let placeholder: string;
  export let token: string;
</script>

<div class="w-3/4 flex mt-5 h-10">
  <input
    class="text-lg w-full text-gray-700 placeholder-gray-500 border-gray-200 rounded-lg border-2 px-2"
    type="text"
    placeholder={placeholder}
    required
    data-automation-id="xtoken-input"
    bind:value={token}
  />
  <div class="items-center w-1/6">
    <MonoLogo />
  </div>
</div>
