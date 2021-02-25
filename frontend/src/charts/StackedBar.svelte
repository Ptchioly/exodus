<script context="module" lang="ts">
  let setLimitCallback: () => Promise<void> | null = null;

  export const pushTimedOutLimit = async () => {
    // console.log('pushTimedOutLimit => setLimitCallback', setLimitCallback);
    if (setLimitCallback) {
      await setLimitCallback();
      setLimitCallback = null;
      // console.log('pushTimedOutLimit => setLimitCallback', setLimitCallback);
    }
  };
</script>

<script lang="ts">
  // import { onMount } from 'svelte';
  import Bars from './Bars.svelte';
  import type { LabelPosition, StackedBars } from '../types/charts';
  import { createEventDispatcher } from 'svelte';
  import { staticValues } from './configs';
  import { onDestroy } from 'svelte';
  import { updateLimit } from '../endpointApi';
  export let title: string;
  export let current: number;
  export let previous: number;
  export let limit: number;
  export let maxValue = 4000;
  export let account: string;

  const dispatch = createEventDispatcher();

  let apiRequest: StackedBars;
  let inputLimit: HTMLElement;

  const handleInitLimit = () => {
    limit = current ? Math.ceil(current * 1.1) : 50;
    props.activeInput = true;
    window.setTimeout(() => {
      inputLimit.focus();
    }, 1);
    handleChange();
  };

  const generateChartData = (maxValue, limit): StackedBars => {
    const currentBar = {
      value: current,
      limits: ['current'],
      background: staticValues.currentBgColor,
      labelPosition: 'in-left' as LabelPosition,
      label: staticValues.valueString,
      detailedLabel: staticValues.valueString,
    };

    const previousBar = {
      ...currentBar,
      value: previous,
      limits: ['previous'],
      background: staticValues.previousBgColor,
    };

    const previousLimit = {
      name: 'previous',
      value: limit,
      color: staticValues.limitColor,
      visible: 'static' as 'static' | 'hover',
      overlapStyle: 'stripes' as '' | 'stripes',
    };

    const currentLimit = {
      ...previousLimit,
      name: 'current',
      draggable: true,
    };

    return {
      maxValue,
      conf: {
        background: staticValues.mainBgColor,
        detailedSpace: staticValues.detailedSpace,
      },
      bars: [previousBar, currentBar],
      limits: [previousLimit, currentLimit],
    };
  };

  const props = {
    activeInput: limit > 0,
  };

  $: apiRequest = generateChartData(maxValue, limit);

  const updateInput = ({ detail }) => {
    limit = +detail.limit.value;
    dispatch('updateMaxValue', { limit });
  };

  let timeoutId: any;
  let delay = 1500;

  const handleChange = () => {
    if (isNaN(+limit) || limit.toString().length === 0) limit = 0;
    if (limit <= 0) props.activeInput = false;
    if (typeof +limit === 'number' && +limit >= 0) setLimit();
    if (limit > maxValue) dispatch('updateMaxValue', { limit });
  };

  const setLimit = () => {
    if (timeoutId) clearInterval(timeoutId);
    setLimitCallback = async () => {
      if (account === 'all') return; // deny set limit for all cards (temporary solution)
      if (timeoutId) clearInterval(timeoutId);
      await updateLimit(title, limit, account);
    };
    timeoutId = setTimeout(pushTimedOutLimit, delay);
  };

  // sets event every time after setLimitCallback has been initialized
  $: window.onbeforeunload = (e) => {
    pushTimedOutLimit();
  };

  const handlePress = (e) => {
    const step = 50;

    if (e.key === 'ArrowUp') {
      if (limit + step <= maxValue) {
        dispatch('updateMaxValue', { limit });
      }

      limit += step;
      handleChange();
    } else if (e.key === 'ArrowDown' && limit - step >= 0) {
      limit -= step;
      handleChange();
    }
  };

  $: {
    // Force reload for cases where there are no new values for prev, limit, or curr fields
    maxValue = maxValue;
  }

  onDestroy(pushTimedOutLimit);
</script>

<div class="wrapper-s">
  <div class="top">
    <section class="actions">
      {#if !props.activeInput}
        <button
          data-automation-id="limit-button"
          class="action action--addLimit"
          on:click={handleInitLimit}
        >
          <img src="/images/add.svg" alt="+" />
        </button>
      {:else}
        <input
          type="text"
          bind:this={inputLimit}
          bind:value={limit}
          on:keydown={handlePress}
          on:change={handleChange}
          data-automation-id="limit-input"
          class="action action--setLimit"
        />
      {/if}
    </section>

    <section class="title">
      <div class="title__name">{title}</div>
    </section>
  </div>

  <div class="bottom">
    <Bars
      bars={apiRequest}
      on:bindLimitValue={updateInput}
      on:updateLimit={handleChange}
    />
  </div>
</div>

<style>
  .wrapper-s {
    display: flex;
    flex-direction: row;
    padding: 0.25em 0;
    user-select: none;
    -webkit-user-select: none;
    justify-content: space-between;
    overflow: hidden;
  }

  .top,
  .bottom {
    display: flex;
  }

  .top {
    width: 30%;
    padding-right: 1em;
    box-sizing: border-box;
    flex-shrink: 100;
  }

  .bottom {
    width: 66%;
    font-size: 0.8em;
    display: flex;
    flex-shrink: 0;
  }

  .actions {
    width: 5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action--addLimit {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    height: 2em;
    padding-left: 1.5em;
    padding-right: 1.5em;
    border-radius: 8px;
    cursor: pointer;
  }

  .action:focus {
    outline: none;
  }

  .action:hover {
    background-color: #e7f4ec;
  }

  .action--setLimit {
    width: 4em;
    height: 2em;
    padding: none;
    border: none;
    background-color: #e7f4ec;
    text-align: center;
    border-radius: 8px;
    font-size: 0.75em;
  }

  .title {
    width: calc(100% - 5em);
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    display: flex;
    flex-shrink: 0;
    align-items: center;
  }

  .title__name {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333;
  }

  @media (max-width: 50em) {
    .wrapper-s {
      flex-direction: column;
      padding-right: 1em;
    }

    .top,
    .bottom {
      width: 100%;
    }

    .top {
      padding-top: 1em;
      padding-bottom: 0.5em;
      justify-content: space-between;
    }

    .top > .title {
      order: 1;
      /* padding-left: 1em; */
    }
    .top > .actions {
      order: 2;
      justify-content: flex-end;
    }
  }
</style>
