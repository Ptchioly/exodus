<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { getStatement, getUserInfo, logout } from '../endpointApi';
  import type {
    APIResponse,
    ChartData,
    Statement,
    StatementHandler,
  } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';
  import UnbudgetedCategories from '../components/UnbudgetedCategories.svelte';
  import HearedBar from '../components/HearedBar.svelte';
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

  const isOtherCategory = ({ id }: ChartData | Statement) =>
    id === p2p;

  const getMaxValue = (statements: Statement[]) => {
    return statements.reduce((currentValue, statement) => {
      if (isOtherCategory(statement) && statement.moneySpent > currentMaxValue)
        return statement.moneySpent;
      return currentValue;
    }, 0);
  };

  const hasValues = ({ limit, previous, current }: ChartData) =>
    previous || limit || current;

  const getStatementWithRetry = async (): Promise<void> => {
    const response = await getStatement();
    console.log('getStatementWithRetry => response', response);
    if (!isSuccessResponse(response)) return Promise.reject(response.message);
    const { current, previous } = response.data;

    currentMonth = current;
    if (!previous) {
      await waitFor(5);
      return await getStatementWithRetry();
    }
    previousMonth = previous;
  };

  const maxBarSize = (charts: ChartData[]): number => {
    let max = 0;

    charts.forEach((chart: ChartData) => {
      const currentMax = Math.max(chart.limit, chart.previous, chart.current);
      if (currentMax > max) max = currentMax;
    });

    return Math.ceil(max / 100) * 1.4 * 100;
  };

  const dispatch = createEventDispatcher();

  $: {
    if (currentMonth) {
      const mergedData = mergeData(currentMonth, previousMonth);

      chartStatements = mergedData
        .filter((chart) => !isOtherCategory(chart))
        .filter(hasValues);

      otherCategory = mergedData.filter(isOtherCategory).pop();
      unbudgeted = mergedData.filter((chart) => !hasValues(chart));

      isEmpty = !mergedData.length;
    }
  }

  $: currentMaxValue = getMaxValue(previousMonth || []);

  const fetchUserName = async () => {
    const userInfo = await getUserInfo();
    if (!isSuccessResponse(userInfo)) return Promise.reject(userInfo.message);
    return userInfo.data.name;
  };

  const equalId = (searchId: number) => ({ id }: Statement): boolean =>
    id === searchId;

  const limitPrioriry = (prev: ChartData, next: ChartData) =>
    next.current - prev.current || next.previous - prev.previous;

  const processStatement = (
    forCurrent: StatementHandler,
    forPrevious: StatementHandler
  ) => (statement: Statement): ChartData => {
    const { id, limit, category } = statement;
    return {
      previous: forPrevious(statement),
      current: forCurrent(statement),
      limit: limit || 0,
      title: category,
      id,
    };
  };

  const mergeData = (
    currentMonth: Statement[],
    previousMonth: Statement[] | undefined
  ): ChartData[] => {
    const current = currentMonth.map(
      processStatement(
        (current) => current.moneySpent,
        (previous) =>
          (previousMonth &&
            previousMonth.find(equalId(previous.id))?.moneySpent) ||
          0
      )
    );

    const previous = previousMonth
      ? previousMonth
          .filter(({ id }) => !currentMonth.find(equalId(id)))
          .map(
            processStatement(
              (_) => 0,
              (previous) => previous.moneySpent
            )
          )
      : [];

    return [...current, ...previous].sort(limitPrioriry);
  };

  const handleAddCategory = ({ detail }: CustomEvent<ChartData>) => {
    chartStatements = [...chartStatements, detail];
  };

  const init = async () => {
    // let tokenCheck = localStorage.getItem('hookCheck');
    // if (Date.now() - +tokenCheck > 3600000) {
    //   await getUserInfo();
    //   tokenCheck = Date.now().toString();
    // }
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
