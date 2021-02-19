<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import StackedBar from '../charts/StackedBar.svelte';
  import HearedBar from '../components/HearedBar.svelte';
  import UnbudgetedCategories from '../components/UnbudgetedCategories.svelte';
  import { getStatement } from '../endpointApi';
  import type { ChartData, Statement } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import { waitFor } from '../utils';

  export let previousMonth: Statement[] | undefined;
  export let currentMonth: Statement[] | undefined;

  let username: string;
  let chartStatements: ChartData[] | undefined;
  let unbudgeted: ChartData[] | undefined;
  let otherCategory: ChartData | undefined;
  let isEmpty: boolean;
  let currentMaxValue = 0;
  let isLoading = false;

  const p2p = 16;

  const isOtherCategory = ({ id }: ChartData | Statement) => id === p2p;

  const getMaxValue = (statements: Statement[]) => {
    return statements.reduce((currentValue, statement) => {
      if (isOtherCategory(statement) && statement.moneySpent > currentMaxValue)
        return statement.moneySpent;
      return currentValue;
    }, 0);
  };

  const getStatementWithRetry = async (): Promise<void> => {
    const response = await getStatement();
    if (!isSuccessResponse(response)) return Promise.reject(response.message);
    const { statements, synced } = response.data;

    chartStatements = statements
      .filter((chart) => !isOtherCategory(chart))
      .filter(hasValues);

    [otherCategory] = statements.filter(isOtherCategory);
    unbudgeted = statements.filter((chart) => !hasValues(chart));

    isEmpty = !!chartStatements.length;

    if (!synced) {
      await waitFor(5);
      return await getStatementWithRetry();
    }
  };

  const hasValues = ({ limit, previous, current }: ChartData) =>
    previous || limit || current;

  const maxBarSize = (charts: ChartData[]): number => {
    let max = 0;

    charts.forEach((chart: ChartData) => {
      const currentMax = Math.max(chart.limit, chart.previous, chart.current);
      if (currentMax > max) max = currentMax;
    });

    return Math.ceil(max / 100) * 1.4 * 100;
  };

  const dispatch = createEventDispatcher();

  $: currentMaxValue = getMaxValue(previousMonth || []);

  const handleAddCategory = ({ detail }: CustomEvent<ChartData>) => {
    chartStatements = [...chartStatements, detail];
  };

  const init = async () => {
    username = localStorage.getItem('name');
    getStatementWithRetry();
  };

  onMount(init);
</script>

<main class="flex w-full flex-col items-center">
  <HearedBar
    on:logout={(e) => dispatch('logout', e)}
    bind:isLoading
    onUpdate={init}
    {username}
  />
  <section class="container">
    <div class="w-full flex justify-end">
      <div class="mb-15">
        {#if unbudgeted}
          <UnbudgetedCategories
            categories={unbudgeted}
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
    {#if chartStatements}
      {#each chartStatements as { previous, current, title, limit }}
        <StackedBar
          {previous}
          {current}
          {title}
          {limit}
          maxValue={maxBarSize(chartStatements)}
        />
      {/each}
    {/if}
    {#if otherCategory}
      <div class="other-category">
        <!-- svelte-ignore missing-declaration -->
        <StackedBar
          previous={otherCategory.previous}
          current={otherCategory.current}
          title={otherCategory.title}
          limit={otherCategory.limit}
          maxValue={maxBarSize([otherCategory])}
        />
      </div>
    {/if}
  </section>
</main>
