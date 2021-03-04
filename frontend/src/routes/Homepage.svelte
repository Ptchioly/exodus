<script lang="ts">
  import Accounts from '../components/Accounts.svelte';
  import CardsPanel from '../components/cards/CardsPanel.svelte';
  import Bar from '../components/header/Bar.svelte';
  import Settings from '../components/accountSettings/Settings.svelte';

  import { onMount } from 'svelte';
  import { pushTimedOutLimit } from '../charts/StackedBar.svelte';
  import { getStatement } from '../endpointApi';
  import type {
    Account,
    AccountId,
    ParsedStatements,
    Total,
  } from '../types/Api';
  import type ClientStorage from '../types/ClientStorage';
  import type { UserMeta } from '../types/ClientStorage';
  import { isSuccessResponse } from '../types/guards';
  import { parseStatements, waitFor } from '../utils';
  import FAQ from '../components/FAQ.svelte';

  export let storage: ClientStorage<UserMeta, 'name'>;

  let fullParsedSatements: Record<AccountId, ParsedStatements>;

  let username: string;
  let isEmpty: boolean;
  let accounts: Account[];
  let currentAccountId: string;
  let showSettings: boolean;
  let showFAQ: boolean;

  const p2p = 17;

  //TODO: refactor
  const fetchStatements = async () => {
    const response = await getStatement(accounts.map(({ id }) => id));

    if (!isSuccessResponse(response)) return Promise.reject();
    const { statements, synced, all, total } = response.data;
    if (!fullParsedSatements || synced) {
      const initial = {
        all: parseStatements(all, total),
      };

      fullParsedSatements = statements.reduce(
        (acc, st) => ({
          ...acc,
          [st.accountId]: parseStatements(st.statements, st.total),
        }),
        initial
      );
      if (synced) return;
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
</script>

{#if showSettings}
  <Settings on:close={() => (showSettings = false)} on:logout />
{/if}
{#if showFAQ}
  <FAQ on:closeFAQ={() => (showFAQ = false)} />
{/if}
<home class="flex w-full flex-col items-center">
  <Bar
    {username}
    on:logout
    on:settings={() => (showSettings = true)}
    on:update={init}
    on:openFAQ={() => (showFAQ = true)}
  />
  <section class="w-full p-0">
    {#if accounts}
      <CardsPanel {accounts} bind:currentAccountId />
    {/if}
    {#if fullParsedSatements}
      {#each Object.entries(fullParsedSatements) as [accountId, statement]}
        {#if accountId === currentAccountId}
          <Accounts {...statement} {accountId} {isEmpty} />
        {/if}
      {/each}
    {/if}
  </section>
</home>
