<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getUserInfo, logout } from '../endpointApi';
  import type { UserInfo } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  const dispatch = createEventDispatcher();
  import RawCharts from '../charts/RawCharts.svelte';
  import StackedBar from '../charts/StackedBar.svelte';
  let userInfo: UserInfo;
  onMount(async () => {
    const resp = await getUserInfo();
    if (isSuccessResponse(resp)) userInfo = resp.data;
  });

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
    <div class="user flex">
      <div class="settings w-4 cursor-pointer mr-4">
        <img alt="settings" src="images/settings.svg" />
      </div>
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
    {#each data as bar}
      <StackedBar
        title={bar.name}
        current={bar.currMonth}
        previous={bar.prevMonth}
        limit={bar.limit}
      />
    {/each}
  </section>
</main>
