<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getStatement, getUserInfo, logout } from '../endpointApi';
  import type { UserInfo } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';

  export let previousMonth: any[];
  export let currentMonth: any[];

  let currentMaxValue = 0;

  const getMaxValue = (el: any) => {
    console.log(el);
    if (el == undefined) return;
    if (el.current && el.current > currentMaxValue) {
      currentMaxValue = el.current;
    } else if (el.limit && el.limit > currentMaxValue) {
      currentMaxValue = el.limit;
    } else if (el.previous && el.previous > currentMaxValue) {
      currentMaxValue = el.previous;
    }
  };

  let currentDate = Date.now();
  let userInfo: UserInfo;
  const dispatch = createEventDispatcher();
  let data;

  onMount(async () => {
    const resp = await getUserInfo();
    if (isSuccessResponse(resp)) userInfo = resp.data;
    previousMonth = await getStatement(currentDate, 'previous');
    currentMonth = await getStatement(currentDate, 'current');
    const sobaka = previousMonth.filter((el) => el.category !== 'Другое');
    data = mergeData(sobaka, currentMonth).sort((a, b) =>
      a.current && b.current ? b.current - a.current : b.previous - a.previous
    );
    data.forEach(getMaxValue);
    console.log('onMount => userInfo', userInfo);
  });

  const handleSetLimit = async () => {};

  const mergeData = (previousMonth, currentMonth) => {
    return previousMonth.reduce((accum, oldData) => {
      const newData = currentMonth.find(
        (curr) => curr.category === oldData.category
      );
      if (newData === undefined) {
        oldData.current = 0;
        accum.push({
          category: oldData.category,
          previous: oldData.moneySpent,
          current: 0,
          limit: 2000,
        });
        return accum;
      }
      const merged = {
        category: oldData.category,
        previous: oldData.moneySpent,
        current: newData.moneySpent,
        limit: 2000,
      };
      accum.push(merged);
      return accum;
    }, []);
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
      <!-- <RawCharts /> -->
      {#if data !== undefined}
        {#each data as bar}
          <StackedBar
            title={bar.category}
            current={bar.previous}
            previous={bar.previous}
            limit={bar.limit}
            maxValue={Math.ceil((currentMaxValue / 100) * 1.4) * 100}
            on:setLimit={handleSetLimit}
          />
        {/each}
      {/if}
    </section>
  </main>
{/if}
