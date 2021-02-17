<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import {
    getStatement,
    getUserInfo,
    logout,
    updateLimit,
  } from '../endpointApi';
  import type {
    APIResponse,
    ChartData,
    Statement,
    UserInfo,
  } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';
  import Settings from '../components/Settings.svelte';

  export let previousMonth: Statement[] | undefined;
  export let currentMonth: Statement[] | undefined;

  let data: ChartData[];
  let otherCategory: ChartData | undefined;
  let isEmpty: boolean;
  let currentMaxValue = 0;
  let showSettings = false;

  const getMaxValue = (el: any) => {
    el.forEach((el) => {
      if (el.id !== 15 && el.moneySpent > currentMaxValue)
        currentMaxValue = el.moneySpent;
    });
  };

  const getStatementWithRetry = async (
    variant: 'previous' | 'current'
  ): Promise<APIResponse> => {
    const response = await getStatement(variant);
    if (isSuccessResponse(response)) return response;
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await getStatement(variant);
        resolve(response);
      }, 75000);
    });
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
      data = mergedData.filter((category) => category.id !== 15); //Id#15 - Category "Other";
      otherCategory = mergedData.filter((category) => category.id === 15).pop();

      isEmpty = !data.length;
    }
  }

  let username = localStorage.getItem('username');

  onMount(async () => {
    // let tokenCheck = localStorage.getItem('hookCheck');
    // if (Date.now() - +tokenCheck > 3600000) {
    //   await getUserInfo();
    //   tokenCheck = Date.now().toString();
    // }
    const curResp = await getStatementWithRetry('current');
    if (isSuccessResponse(curResp)) currentMonth = curResp.data;
    const prevResp = await getStatementWithRetry('previous');
    if (isSuccessResponse(prevResp)) previousMonth = prevResp.data;
    getMaxValue(previousMonth);
  });

  const mergeData = (
    currentMonth: Statement[],
    previousMonth: Statement[] | undefined
  ): ChartData[] => {
    const current = currentMonth.map(({ category, moneySpent, limit, id }) => ({
      id,
      title: category,
      current: moneySpent,
      previous:
        (previousMonth &&
          previousMonth.find((st) => st.category === category)?.moneySpent) ||
        0,
      limit: limit || 0,
    }));

    const previous = previousMonth
      ? previousMonth
          .filter(
            ({ id }) =>
              !currentMonth.find(({ id: currentId }) => id == currentId)
          )
          .map(({ category, moneySpent, limit, id }) => ({
            id,
            title: category,
            current: 0,
            previous: moneySpent,
            limit: limit || 0,
          }))
      : [];

    return [...current, ...previous];
  };

  const sorted = (d) =>
    d.sort(
      (a, b) =>
        b.limit - a.limit || b.current - a.current || b.previous - a.previous
    );
</script>

{#if showSettings}
  <Settings bind:showSettings />
{/if}
{#if username}
  <main class="flex w-full flex-col items-center">
    <div class="header flex justify-end w-full px-5 mt-4 md:mb-40 mb-10">
      <div class="flex w-1/8 ">
        <div
          class="h-8 w-8 flex cursor-pointer shadow-md rounded-2xl"
          on:click={() => location.reload()}
        >
          <img src="images/refresh.png" alt="refresh page" />
        </div>
        <div
          class="h-8 w-8 flex cursor-pointer shadow-md rounded-2xl ml-6"
          data-automation-id="telegram-link"
          on:click={() => window.open('https://t.me/exodus_MonobankBudgetBot')}
        >
          <img src="images/tg.png" alt="telegram" />
        </div>
        <div class="user flex items-center" />
        <div class="logout ml-6 user flex items-center">
          <UserProfile
            bind:showSettings
            user={username}
            on:logout={async () => {
              await logout();
              dispatch('logout', {});
            }}
          />
        </div>
      </div>
    </div>
    <section class="container">
      {#if isEmpty}
        <h1 class="w-full flex items-start text-gray-700">
          You did not spend anything for current month
        </h1>
      {/if}
      <!-- <RawCharts /> -->
      {#if data}
        {#each sorted(data) as { previous, current, title, limit }}
          <StackedBar
            {previous}
            {current}
            {title}
            {limit}
            on:setLimit={handleSetLimit(title)}
            maxValue={maxBarSize(data)}
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
            on:setLimit={handleSetLimit(otherCategory.title)}
            maxValue={maxBarSize([otherCategory])}
          />
        </div>
      {/if}
    </section>
  </main>
{/if}
