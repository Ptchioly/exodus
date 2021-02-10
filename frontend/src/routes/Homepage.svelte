<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getUserInfo, logout } from '../endpointApi';
  import type { UserInfo } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import StackedBar from '../charts/StackedBar.svelte';

  let userInfo: UserInfo;
  const dispatch = createEventDispatcher();
  onMount(async () => {
    const resp = await getUserInfo();
    if (isSuccessResponse(resp)) userInfo = resp.data;
  });

  const handleSetLimit = async () => {};

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
        {#if userInfo}
          <UserProfile
            user={userInfo}
            on:logout={async () => {
              await logout();
              dispatch('logout', {});
            }}
          />
        {/if}
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
        on:setLimit={handleSetLimit}
      />
    {/each}
  </section>
</main>
