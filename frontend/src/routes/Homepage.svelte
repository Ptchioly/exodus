<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import StackedBar, { pushTimedOutLimit } from '../charts/StackedBar.svelte';
  import HeaderBar from '../components/HearedBar.svelte';
  import UnbudgetedCategories from '../components/UnbudgetedCategories.svelte';
  import { getStatement } from '../endpointApi';
  import type { ChartData, Statement, Account } from '../types/Api';
  import type ClientStorage from '../types/ClientStorage';
  import type { UserMeta } from '../types/ClientStorage';
  import { isSuccessResponse } from '../types/guards';
  import { waitFor } from '../utils';

  export let previousMonth: Statement[] | undefined;
  export let currentMonth: Statement[] | undefined;
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
  let currentMaxValue = 0;
  let isLoading = false;
  let accounts: Account[];
  let currentAccountId: string;

  const p2p = 16;

  const isOtherCategory = ({ id }: ChartData | Statement) => id === p2p;

  const saveUnbudgetedState = (statements: ChartData[]) =>
    statements
      ? statements.filter(({ previous, current }) => !(previous || current))
      : [];

  const getMaxValue = (statements: Statement[]) => {
    return statements.reduce((currentValue, statement) => {
      if (isOtherCategory(statement) && statement.moneySpent > currentMaxValue)
        return statement.moneySpent;
      return currentValue;
    }, 0);
  };

  const hasValues = ({ limit, previous, current }: ChartData) =>
    previous || limit || current;

  const maxBarSize = (charts: ChartData[]): number => {
    let max = 0;

    charts.forEach((chart: ChartData) => {
      const currentMax = Math.max(chart.limit, chart.previous, chart.current);
      if (currentMax > max) max = currentMax;
    });

    return Math.ceil(max / 100) * 1.4 * 100;
  };

  const dispatch = createEventDispatcher();

  $: currentMaxValue = getMaxValue(previousMonth || []);

  const handleAddCategory = ({ detail }: CustomEvent<ChartData>) => {
    fullParsedSatements = {
      ...fullParsedSatements,
      [currentAccountId]: {
        ...fullParsedSatements[currentAccountId],
        budgeted: [...fullParsedSatements[currentAccountId].budgeted, detail],
      },
    };
  };

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

  onMount(init);
</script>

<main class="flex w-full flex-col items-center">
  {#if accounts}
    <HeaderBar
      on:logout={(e) => dispatch('logout', e)}
      on:changeCard={({ detail: { accountId } }) => {
        currentAccountId = accountId;
      }}
      bind:isLoading
      onUpdate={init}
      {username}
      {accounts}
    />{/if}
  <section class="container">
    {#if fullParsedSatements}
      {#each Object.entries(fullParsedSatements) as [account, { other, unbudgeted, budgeted }]}
        {#if account === currentAccountId}
          <div class="w-full flex justify-end">
            <div class="mb-15">
              {#if unbudgeted && unbudgeted.length}
                <UnbudgetedCategories
                  bind:categories={unbudgeted}
                  on:addCategory={handleAddCategory}
                />
              {/if}
            </div>
          </div>
          {#if isEmpty}
            <h1 class="w-full flex items-start text-gray-700">
              You did not spend anything for current month
            </h1>
          {/if}
          {#if budgeted}
            {#each budgeted as category}
              <StackedBar
                {...category}
                bind:limit={category.limit}
                {account}
                maxValue={maxBarSize(budgeted)}
              />
            {/each}
          {/if}
          {#if other}
            <div class="other-category">
              <StackedBar
                {...other}
                bind:limit={other.limit}
                maxValue={maxBarSize([other])}
                {account}
              />
            </div>
          {/if}
        {/if}
      {/each}
    {/if}
  </section>
</main>
