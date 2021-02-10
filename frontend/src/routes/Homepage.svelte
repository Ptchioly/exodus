<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getUserInfo, logout } from '../endpointApi';
  import type { UserInfo } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';

  export let previousMonth: any[];
  export let currentMonth: any[];

  let currentMaxValue = 0;

  let data1;
  let data2;


  const getMaxValue = (el: any) => {
    console.log(el);
    if (el == undefined) return;
    if (el.current && el.current > currentMaxValue) {
      currentMaxValue = el.current;
    } else if (el.limit && el.limit > currentMaxValue)  {
      currentMaxValue = el.limit;
    } else if (el.previous && el.previous > currentMaxValue) {
      currentMaxValue = el.previous;
    }
  }

  let userInfo: UserInfo;
  const dispatch = createEventDispatcher();
  onMount(async () => {
    const resp = await getUserInfo();
    if (isSuccessResponse(resp)) userInfo = resp.data;
  });

  const handleSetLimit = async () => {};

  $: if (previousMonth !== undefined) {
    data1 = previousMonth.map((el) => {
      return { category: el.category, previous: el.moneySpent, limit: 2000 };
    }).sort((a, b) => b.previous - a.previous)
    data1.forEach(getMaxValue);
  }

  $: if (currentMonth !== undefined && data1 !== undefined) {
    data2 = mergeData(data1, currentMonth).sort((a, b) => b.current - a.current);
  }

  const mergeData = (initialData, currentMonth) => {
    return initialData.reduce((accum, el) => {
      const sobaka = currentMonth.find((curr) => curr.category === el.category);
      if (sobaka === undefined) {
        el.current = 0;
        accum.push(el);
        return accum;
      }
      const merged = {
        category: el.category,
        previous: el.moneySpent,
        current: sobaka.moneySpent,
        limit: 2000,
      };
      accum.push(merged);
      return accum;
    }, []);
  };

  const data = [
    {
      name: 'Taxi',
      currMonth: 560,
      prevMonth: 815,
      limit: 760,
      id: 1,
    },
    {
      name: 'Groceries',
      currMonth: 910,
      prevMonth: 1300,
      limit: 1500,
      id: 2,
    },
    {
      name: 'KRASOTA & MEDICINA',
      currMonth: 1300,
      prevMonth: 920,
      limit: 0,
      id: 3,
    },
  ];
</script>

<main class="flex w-full flex-col items-center mx-20">
  <div class="header flex justify-between w-full px-5 mt-4 mb-40">
    <div class="user flex items-center">
      <!-- <div class="settings w-4 cursor-pointer mr-4">
        <img alt="settings" src="images/settings.svg" />
      </div> -->
      {#if userInfo}
        <UserProfile user={userInfo} />
      {/if}
    </div>
    <div class="logout ">
      <div
        class="cursor-pointer bg-coolGreen-default rounded-3xl h-8 w-18 text-sm flex px-3 justify-center items-center text-white"
        on:click={async () => {
          await logout();
          dispatch('logout', {});
        }}
      >
        LOG OUT
      </div>
    </div>
  </div>
  <section class="container">
    <!-- <RawCharts /> -->
    {#if data1 !== undefined}
      {#each data1 as bar}
        {#if (bar.current && bar.current <= 4000 ) || (bar.previous && bar.previous <= 4000 ) }
        <StackedBar
          title={bar.category}
          current={bar.previous}
          previous={bar.previous}
          limit={bar.limit}
          maxValue={Math.ceil(currentMaxValue / 100 * 1.4) * 100}
          on:setLimit={handleSetLimit}
        />
        {/if}
      {/each}
    {/if}
  </section>
</main>
