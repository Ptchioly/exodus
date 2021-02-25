<script lang="ts">
  import StackedBar from '../charts/StackedBar.svelte';
  import UnbudgetedCategories from '../components/UnbudgetedCategories.svelte';
  import type { ChartData } from '../types/Api';
  import { onMount } from 'svelte';

  export let fullParsedSatements;

  export let accountId: string;
  export let isEmpty: boolean;
  export let other: ChartData;
  export let budgeted: ChartData[];
  export let unbudgeted: ChartData[];

  let maxValue = 0;
  let p2pMax = 0;

  const maxBarSize = (charts: ChartData[], max?: number): number => {
    max = max || maxValue;
    charts.forEach((chart: ChartData) => {
      const currentMax = Math.max(chart.limit, chart.previous, chart.current);
      if (currentMax > max) max = currentMax;
    });

    return Math.ceil(max / 100) * 1.05 * 100;
  };

  const handleAddCategory = ({ detail }: CustomEvent<ChartData>) => {
    fullParsedSatements = {
      ...fullParsedSatements,
      [accountId]: {
        ...fullParsedSatements[accountId],
        budgeted: [...fullParsedSatements[accountId].budgeted, detail],
      },
    };
  };

  onMount(() => {
    maxValue = maxBarSize(budgeted, maxValue);
    p2pMax = maxBarSize([other], p2pMax);
  });
</script>

<div class="w-full flex justify-end">
  <div class="mb-15">
    {#if unbudgeted && unbudgeted.length}
      <UnbudgetedCategories
        bind:categories={unbudgeted}
        on:addCategory={handleAddCategory}
      />
    {/if}
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
