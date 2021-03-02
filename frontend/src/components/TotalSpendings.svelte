<script lang="ts">
    import type { Total } from "../types/Api";

    export let total: Total;
</script>

<div class="total-spendings flex content-center justify-around bg-indigo-200 rounded-2xl mb-2 text-sm">
    <div class="flex justify-center items-center pl-3">
      Total spendings:
    </div>
    <div class="ml-3 flex">
      <div class="bg-indigo-500 cell" style="width:6rem">
        <div>{total.current}</div>
      </div>
      <div class="bg-indigo-400 cell" style="width:6rem">
        <div>{total.previous}</div>
      </div>
    </div>
  </div>

  <style lang="postcss">
      .cell {
          @apply flex m-1.5 p-0.5 justify-center text-white rounded-2xl
      }
  </style>