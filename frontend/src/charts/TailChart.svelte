<script lang="ts">
  const data = [
    {
      name: "Taxi",
      currMonth: 560,
      prevMonth: 815,
      limit: 760,
      id: 1,
    },
    {
      name: "Groceries",
      currMonth: 910,
      prevMonth: 1300,
      limit: 1500,
      id: 2,
    },
  ];
</script>

<div class="m-auto w-3/5">
  {#each data as { name, currMonth, prevMonth, limit }, i}
    <div class="flex flex-col md:flex-row justify-between">
      <span class="inline-flex w-1/12">{name}</span>
      <div class="inline-flex w-5/6">
        <div class="inline-flex ">
          <span>{currMonth}</span>
        </div>
        <div class="inline-flex">
          <span>{prevMonth}</span>
        </div>
        <div class="inline-flex">
          <span>{limit}</span>
        </div>
      </div>
      <div class="inline-flex w-1/12">
        <span>{limit}</span>
      </div>
    </div>
  {/each}
</div>

<style local lang="postcss">
</style>
