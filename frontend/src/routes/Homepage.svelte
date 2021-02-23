<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import StackedBar, { forceLimitSet } from '../charts/StackedBar.svelte';
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

  let fullStatements: Record<string, ChartData[]>;

  let username: string;
  let chartStatements: ChartData[] | undefined;
  let unbudgeted: ChartData[] | undefined;
  let otherCategory: ChartData | undefined;
  let isEmpty: boolean;
  let currentMaxValue = 0;
  let isLoading = false;
  let accounts: Account[];
  let currentAccountId: string;
  $: fullStatements && parseStatements(fullStatements, currentAccountId);

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
    chartStatements = [...chartStatements, detail];
  };

  const fetchStatements = async () => {
    const response = await getStatement(accounts.map(({ id }) => id));
    if (!isSuccessResponse(response)) return Promise.reject();
    const {
      data: { statements, synced, all },
    } = response;

    fullStatements = {
      ...statements.reduce((acc, st) => {
        return {
          ...acc,
          [st.accountId]: st.statements,
        };
      }, {}),
      all,
    };
    if (!synced) {
      await waitFor(5);
      return await fetchStatements();
    }
  };

  const parseStatements = (
    fullData: Record<string, ChartData[]>,
    accountId: string,
    keepAddedUnbudgeted = false
  ) => {
    console.log('fullData', fullData);
    const statementsForAccount = fullData[accountId]; //Check if not null
    if (!statementsForAccount) return;
    const addedUnbudgeted = keepAddedUnbudgeted
      ? saveUnbudgetedState(statementsForAccount)
      : [];

    chartStatements = [
      ...statementsForAccount
        .filter((chart) => !isOtherCategory(chart))
        .filter(hasValues),
      ...addedUnbudgeted,
    ];

    [otherCategory] = statementsForAccount.filter(isOtherCategory);

    unbudgeted = statementsForAccount.filter((chart) => !hasValues(chart));

    if (keepAddedUnbudgeted) {
      unbudgeted = unbudgeted.filter(
        ({ id }) => !addedUnbudgeted.some((added) => added.id === id)
      );
    }

    // isEmpty = !synced && ![...chartStatements].length && !otherCategory;
  };
  const init = async () => {
    if (forceLimitSet) await forceLimitSet();
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
    {#if chartStatements}
      {#each chartStatements as { previous, current, title, limit }}
        <StackedBar
          {previous}
          {current}
          {title}
          {limit}
          {currentAccountId}
          maxValue={maxBarSize(chartStatements)}
        />
      {/each}
    {/if}
    {#if otherCategory}
      <div class="other-category">
        <!-- svelte-ignore missing-declaration -->
        <StackedBar
          previous={otherCategory.previous}
          current={otherCategory.current}
          title={otherCategory.title}
          limit={otherCategory.limit}
          maxValue={maxBarSize([otherCategory])}
        />
      </div>
    {/if}
  </section>
</main>
