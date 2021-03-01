<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { pushTimedOutLimit } from '../charts/StackedBar.svelte';
  import Accounts from '../components/Accounts.svelte';
  import AlphaLabel from '../components/headerItems/AlphaLabel.svelte';
  import TelegramLink from '../components/headerItems/TelegramLink.svelte';
  import UpdateButton from '../components/headerItems/UpdateButton.svelte';
  import UserProfile from '../components/headerItems/UserProfile.svelte';
  import HearedBar from '../components/HeaderBar.svelte';
  import Settings from '../components/accountSettings/Settings.svelte';
  import { getStatement } from '../endpointApi';
  import type { Account, AccountId, ParsedStatements } from '../types/Api';
  import type ClientStorage from '../types/ClientStorage';
  import type { UserMeta } from '../types/ClientStorage';
  import { isSuccessResponse } from '../types/guards';
  import { parseStatements, waitFor } from '../utils';
  import statics from './statics';

  export let storage: ClientStorage<UserMeta, 'name'>;

  let fullParsedSatements: Record<AccountId, ParsedStatements>;

  let username: string;
  let isEmpty: boolean;
  let accounts: Account[];
  let currentAccountId: string;

  const dispatch = createEventDispatcher();

  const fetchStatements = async () => {
    const response = await getStatement(accounts.map(({ id }) => id));
    if (!isSuccessResponse(response)) return Promise.reject();
    const { statements, synced, all } = response.data;

    if (synced || !fullParsedSatements) {
      const initial = {
        all: parseStatements(all),
      };
      fullParsedSatements = statements.reduce(
        (acc, st) => ({
          ...acc,
          [st.accountId]: parseStatements(st.statements),
        }),
        initial
      );
      return;
    }

    await waitFor(5);
    return await fetchStatements();
  };

  const init = async () => {
    await pushTimedOutLimit();
    [{ name: username, accounts }] = await storage.getAll();
    currentAccountId = accounts[0]?.id;
    fetchStatements();
  };

  onMount(init);

  let showSettings: boolean;
</script>

{#if showSettings}
  <Settings showSettings on:close={() => (showSettings = false)} />
{/if}
<home class="flex w-full flex-col items-center">
  <HearedBar>
    <div slot="left" class="flex">
      <AlphaLabel label="alpha" />
    </div>
    <div slot="right" class="reight flex">
      <UpdateButton on:click={init} />
      <TelegramLink href={statics.tgBotLink} />
      <UserProfile
        {username}
        on:logout={(e) => dispatch('logout', e)}
        on:openSettings={() => (showSettings = true)}
      />
    </div>
  </HearedBar>
  <section class="w-full p-0">
    {#if fullParsedSatements}
      {#each Object.entries(fullParsedSatements) as [accountId, statement]}
        {#if accountId === currentAccountId}
          <Accounts
            {...statement}
            {accountId}
            {isEmpty}
            {accounts}
            bind:currentAccountId
          />
        {/if}
      {/each}
    {/if}
  </section>
</home>
