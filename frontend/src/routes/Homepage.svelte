<script lang="ts">
  import Accounts, { pushTimedOutLimit } from '../components/Accounts.svelte';
  import CardsPanel from '../components/cards/CardsPanel.svelte';
  import Bar from '../components/header/Bar.svelte';
  import Settings from '../components/accountSettings/Settings.svelte';
  import FAQ from '../components/FAQ.svelte';

  import { onMount } from 'svelte';
  import { getStatement } from '../endpointApi';
  import type { Account, AccountId, ParsedStatements } from '../types/Api';
  import { isSuccessResponse } from '../types/guards';
  import { parseStatements, waitFor } from '../utils';

  export let username: string;
  export let accounts: Account[];

  let fullParsedSatements: Record<AccountId, ParsedStatements>;

  let currentAccountId: string;
  let showSettings: boolean;
  let showFAQ: boolean;

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
<home class="flex w-full flex-col items-center dark:bg-dark">
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
          <Accounts {...statement} {accountId} />
        {/if}
      {/each}
    {/if}
  </section>
</home>
