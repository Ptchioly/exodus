<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { pushTimedOutLimit } from '../charts/StackedBar.svelte';
  import HeaderBar from '../components/HearedBar.svelte';
  import Cards from '../components/Cards.svelte';
  import UnbudgetedCategories from '../components/UnbudgetedCategories.svelte';
  import { getStatement } from '../endpointApi';
  import type { ChartData, Statement, Account } from '../types/Api';
  import type ClientStorage from '../types/ClientStorage';
  import type { UserMeta } from '../types/ClientStorage';
  import { isSuccessResponse } from '../types/guards';
  import { waitFor } from '../utils';
  import Accounts from './Accounts.svelte';

  export let storage: ClientStorage<UserMeta, 'name'>;

  type AccountId = string;
  type ParsedStatements = {
    budgeted: ChartData[];
    unbudgeted: ChartData[];
    other?: ChartData;
  };

  let fullParsedSatements: Record<AccountId, ParsedStatements>;

  let username: string;
  let isEmpty: boolean;
  let isLoading = false;
  let accounts: Account[];
  let currentAccountId: string;

  const p2p = 16;

  const isOtherCategory = ({ id }: ChartData | Statement) => id === p2p;

  const hasValues = ({ limit, previous, current }: ChartData) =>
    previous || limit || current;

  const dispatch = createEventDispatcher();

  const fetchStatements = async () => {
    const response = await getStatement(accounts.map(({ id }) => id));
    if (!isSuccessResponse(response)) return Promise.reject();
    const {
      data: { statements, synced, all },
    } = response;

    if (!synced && fullParsedSatements) {
      await waitFor(5);
      return await fetchStatements();
    }

    fullParsedSatements = statements.reduce(
      (acc, st) => {
        return {
          ...acc,
          [st.accountId]: parseStatements(st.statements),
        };
      },
      {
        all: parseStatements(all),
      }
    );

    if (!synced) {
      await waitFor(5);
      return await fetchStatements();
    }
  };

  const parseStatements = (statement: ChartData[]): ParsedStatements => {
    if (!statement) return { budgeted: [], unbudgeted: [] };

    const budgeted = statement
      .filter((chart) => !isOtherCategory(chart))
      .filter(hasValues);

    const [other] = statement.filter(isOtherCategory);

    const unbudgeted = statement.filter((chart) => !hasValues(chart));

    return {
      budgeted,
      other,
      unbudgeted,
    };
  };
  const init = async () => {
    await pushTimedOutLimit();
    [{ name: username, accounts }] = await storage.getAll();
    currentAccountId = accounts[0]?.id;
    fetchStatements();
  };

  // $: if (fullParsedSatements) {
  //   Object.values(fullParsedSatements).forEach((el) => {
  //     maxValue = maxBarSize(el.budgeted, maxValue);
  //     p2pMax = maxBarSize([el.other], p2pMax);
  //   });
  // }

  onMount(init);
</script>

<main class="flex w-full flex-col items-center">
  {#if accounts}
    <HeaderBar
      on:logout={(e) => dispatch('logout', e)}
      bind:isLoading
      onUpdate={init}
      {username}
    />{/if}
  <section class="container p-0">
    {#if fullParsedSatements}
      {#each Object.entries(fullParsedSatements) as [account, { other, unbudgeted, budgeted }]}
        {#if account === currentAccountId}
          <Accounts
            accountId={account}
            {other}
            {unbudgeted}
            {budgeted}
            {isEmpty}
            {fullParsedSatements}
            {accounts}
            bind:currentAccountId
          />
        {/if}
      {/each}
    {/if}
    {#if isEmpty}
      <h1 class="w-full flex items-start text-gray-700">
        You did not spend anything for current month
      </h1>
    {/if}
  </section>
</main>
