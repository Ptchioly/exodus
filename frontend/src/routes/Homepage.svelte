<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getStatement, getUserInfo, logout } from '../endpointApi';
  import type { UserInfo } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';

  let previousMonth: any[];
  let currentMonth: any[];
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
    data = mergeData(sobaka, currentMonth);
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
    {#if data !== undefined}
      {#each data as bar}
        <StackedBar
          title={bar.category}
          current={bar.current}
          previous={bar.previous}
          limit={bar.limit}
          on:setLimit={handleSetLimit}
        />
      {/each}
    {/if}
  </section>
</main>
