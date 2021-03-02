<script lang="ts">
  import StackedBar from '../charts/StackedBar.svelte';
  import UnbudgetedCategories from './UnbudgetedCategories.svelte';
  import type { ChartData, Total } from '../types/Api';
  import { onMount } from 'svelte';
  import { _ } from "svelte-i18n";
  import TotalSpendings from './TotalSpendings.svelte';

  export let accountId: string;
  export let isEmpty: boolean;
  export let other: ChartData;
  export let budgeted: ChartData[];
  export let unbudgeted: ChartData[];
  export let total: Total;

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

<div class="flex flex-col">
  <div>
    <div class="my-7 sm:mb-20 md:mb-12 flex flex-col md:h-20 justify-start items-start">
      <TotalSpendings {total} />
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
    {$_(`homepage.no_spendings_msg`)}
  </h1>
{/if}
{#if budgeted}
  {#each budgeted as { current, previous, limit, id }}
    <StackedBar
      {current}
      {previous}
      title={$_(`categories.${id}`)}
      bind:limit
      account={accountId}
      {maxValue}
      on:updateMaxValue={({ detail }) => {
        maxValue = maxBarSize(budgeted, detail.limit);
      }}
    />
  {/each}
{/if}
{#if other}
  <div class="other-category mb-20">
    <StackedBar
      current={other.current}
      previous={other.previous}
      title={$_(`categories.${other.id}`)}
      bind:limit={other.limit}
      maxValue={p2pMax}
      account={accountId}
      on:updateMaxValue={({ detail }) => {
        p2pMax = maxBarSize([other], detail.limit);
      }}
    />
  </div>
{/if}
