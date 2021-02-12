<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getStatement, getUserInfo, logout } from '../endpointApi';
  import type {
    APIResponse,
    ChartData,
    Statement,
    UserInfo,
  } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';

  export let previousMonth: Statement[] | undefined;
  export let currentMonth: Statement[] | undefined;

  let data: ChartData[];
  let currentDate = Date.now();
  let isEmpty: boolean;
  let currentMaxValue = 0;

  const getMaxValue = (el: any) => {
    el.forEach((el) => {
      if (el.id !== 15 && el.moneySpent > currentMaxValue)
        currentMaxValue = el.moneySpent;
    });
  };

  const getStatementWithRetry = async (
    variant: 'previous' | 'current'
  ): Promise<APIResponse> => {
    const response = await getStatement(currentDate, variant);
    if (isSuccessResponse(response)) return response;
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await getStatement(currentDate, variant);
        resolve(response);
      }, 75000);
    });
  };

  const dispatch = createEventDispatcher();
  $: {
    if (currentMonth) {
      data = mergeData(currentMonth, previousMonth);
      isEmpty = !data.length;
    }
  }

  let userInfo: UserInfo;

  onMount(async () => {
    const resp = await getUserInfo();
    if (isSuccessResponse(resp)) userInfo = resp.data;
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
    const current = currentMonth
      .filter((c) => c.id !== 15)
      .map(({ category, moneySpent, limit }) => ({
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
          .filter((c) => c.id !== 15)
          .map(({ category, moneySpent, limit }) => ({
            title: category,
            current: 0,
            previous: moneySpent,
            limit: limit || 0,
          }))
      : [];

    return [...current, ...previous].filter((c) => c.id !== 15);
  };
</script>

{#if userInfo}
  <main class="flex w-full flex-col items-center mx-20">
    <div class="header flex justify-end w-full px-5 mt-4 mb-40">
      <div class="flex w-1/8">
        <div
          class="telega h-8 w-8 flex cursor-pointer shadow-md rounded-2xl"
          on:click={() => window.open('https://t.me/exodus_MonobankBudgetBot')}
        >
          <img src="images/tg.png" />
        </div>
        <div class="user flex items-center" />
        <div class="logout ml-6 user flex items-center">
          <UserProfile
            user={userInfo}
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
          You does not have waste for current mounth
        </h1>
      {/if}
      <!-- <RawCharts /> -->
      {#if data}
        {#each data as { previous, current, title, limit }}
          <StackedBar {previous} {current} {title} {limit} />
        {/each}
      {/if}
    </section>
  </main>
{/if}
