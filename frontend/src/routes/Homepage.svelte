<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import UserProfile from '../components/UserProfile.svelte';
  import { getUserInfo, logout } from '../endpointApi';
  import type { UserInfo } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  const dispatch = createEventDispatcher();
  let userInfo: UserInfo;
  onMount(async () => {
    const resp = await getUserInfo();
    if (isSuccessResponse(resp)) userInfo = resp.data;
  });
</script>

<main class="flex justify-center w-full">
  <div class="header flex justify-between w-full px-5 mt-4">
    {#if userInfo}
      <div class="user flex">
        <div class="settings w-4 cursor-pointer mr-4">
          <img alt="settings" src="images/settings.svg" />
        </div>
        <UserProfile user={userInfo} />
      </div>
    {/if}
    <div>YO MOTHERFUCKER</div>
    <div>TI PTCHIOLA</div>
    <div class="logout">
      <div
        class="cursor-pointer bg-coolGreen-default rounded-3xl h-10  flex px-5 justify-center items-center text-white"
        on:click={async () => {
          await logout();
          dispatch('logout', {});
        }}
      >
        LOG OUT
      </div>
    </div>
  </div>
</main>
