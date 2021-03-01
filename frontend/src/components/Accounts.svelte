<script lang="ts">
  import StackedBar from '../charts/StackedBar.svelte';
  import UnbudgetedCategories from './UnbudgetedCategories.svelte';
  import type { ChartData, Account } from '../types/Api';
  import { onMount } from 'svelte';
  import Cards from './cards/CardsPanel.svelte';

  export let accountId: string;
  export let isEmpty: boolean;
  export let other: ChartData;
  export let budgeted: ChartData[];
  export let unbudgeted: ChartData[];
  export let accounts: Account[];
  export let currentAccountId: string;

  let maxValue = 0;
  let p2pMax = 0;

  const maxBarSize = (charts: ChartData[], max?: number): number => {
    max = !isNaN(+max) || max.toString().length > 0 ? max : maxValue;
    charts.forEach((chart: ChartData) => {
      const currentMax = Math.max(chart.limit, chart.previous, chart.current);
      if (currentMax > max) max = currentMax;
    });

    return Math.ceil(max / 100) * 1.05 * 100;
  };

  const handleAddCategory = ({ detail }: CustomEvent<ChartData>) => {
    budgeted = [...budgeted, detail];
  };

  onMount(() => {
    maxValue = maxBarSize(budgeted, maxValue);
    p2pMax = maxBarSize([other], p2pMax);
  });
</script>

<div class="flex flex-col mb-5">
  <div class="flex justify-center">
    <Cards {accounts} bind:currentAccountId />
  </div>
  <div>
    <div class="mb-8 mt-8 flex justify-end">
      {#if unbudgeted && unbudgeted.length}
        <UnbudgetedCategories
          bind:categories={unbudgeted}
          on:addCategory={handleAddCategory}
        />
      {/if}
    </div>
  </div>
</div>
{#if isEmpty}
  <h1 class="w-full flex items-start text-gray-700">
    You did not spend anything for current month
  </h1>
{/if}
{#if budgeted}
  {#each budgeted as category}
    <StackedBar
      {...category}
      bind:limit={category.limit}
      account={accountId}
      {maxValue}
      on:updateMaxValue={({ detail }) => {
        maxValue = maxBarSize(budgeted, detail.limit);
      }}
    />
  {/each}
{/if}
{#if other}
  <div class="other-category">
    <StackedBar
      {...other}
      bind:limit={other.limit}
      maxValue={p2pMax}
      account={accountId}
      on:updateMaxValue={({ detail }) => {
        p2pMax = maxBarSize([other], detail.limit);
      }}
    />
  </div>
{/if}
