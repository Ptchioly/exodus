<script lang="ts">
  import type { Total } from '../types/Api';
  import { _ } from 'svelte-i18n';

  export let total: Total;
</script>

<div
  class="total-spendings flex content-center justify-around bg-indigo-200 rounded-2xl mb-2 text-sm dark:bg-darker"
>
  <div class="flex justify-center items-center pl-3 dark:text-gray-400">
    {$_('homepage.total_spendings')}:
  </div>
  <div class="ml-3 flex">
    <div class="bg-indigo-500 cell" style="width:6rem">
      <div data-automation-id="total-current">{Math.round(total.current)}</div>
    </div>
    <div class="bg-indigo-400 cell" style="width:6rem">
      <div data-automation-id="total-previous">
        {Math.round(total.previous)}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .cell {
    @apply flex m-1.5 p-0.5 justify-center text-white rounded-2xl;
  }
</style>
