<script lang="ts">
  import Bars from './Bars.svelte';
  import type { StackedBars } from '../types/charts';
  import { createEventDispatcher } from 'svelte';
  import { generateChartData } from './utils';
  export let title: string;
  export let current: number;
  export let previous: number;
  export let limit: number;
  export let maxValue: number;

  const dispatch = createEventDispatcher();

  let apiRequest: StackedBars;
  let inputLimit: HTMLElement;

  const handleInitLimit = () => {
    limit = current ? Math.ceil(current * 1.05) : 50;
    props.activeInput = true;
    window.setTimeout(() => {
      inputLimit.focus();
    }, 1);
    handleChange();
  };

  const props = {
    activeInput: limit > 0,
  };

  $: apiRequest = generateChartData(maxValue, limit, previous, current);

  const updateInput = ({ detail }) => {
    limit = +detail.limit.value;
    dispatch('updateMaxValue', { limit });
  };

  const handleChange = () => {
    if (isNaN(+limit) || limit.toString().length === 0) limit = 0;
    if (+limit <= 0) {
      props.activeInput = false;
      limit = 0;
    }
    if (typeof +limit === 'number' && +limit >= 0) dispatch('limit', { limit });
    dispatch('updateMaxValue', { limit });
  };

  const handlePress = (e) => {
    const step = 50;

    if (e.key === 'ArrowUp') {
      if (limit + step <= maxValue) {
      }

      limit = +limit + step;
      handleChange();
    } else if (e.key === 'ArrowDown' && limit - step >= 0) {
      limit = +limit - step;
      handleChange();
    } else if (/[0-9]/.test(e.key) || e.key === 'Backspace') {
      setTimeout(() => dispatch('updateMaxValue', { limit }), 100);
    }
  };
</script>

<div class="wrapper-s">
  <div class="top">
    <section class="actions">
      {#if !props.activeInput}
        <button
          data-automation-id="limit-button"
          class="action action--addLimit dark:hover:bg-darker"
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
          class="action action--setLimit dark:bg-darker dark:text-gray-300 bg-barBg"
        />
      {/if}
    </section>

    <section class="title">
      <div
        data-automation-id="category-title-budgeted"
        class="title__name dark:text-gray-400"
      >
        {title}
      </div>
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
    justify-content: space-between;
    overflow: hidden;
  }

  .top,
  .bottom {
    display: flex;
  }

  .top {
    width: 30%;
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
    width: 4em;
    display: flex;
    align-items: center;
  }

  .action--addLimit {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    height: 1.8em;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 8px;
    cursor: pointer;
  }

  .action:focus {
    outline: none;
  }

  .action:hover {
    /* background-color: #e7f4ec; */
  }

  .action--setLimit {
    width: 4em;
    height: 2em;
    padding: none;
    border: none;
    box-sizing: border-box;
    /* background-color: #e7f4ec; */
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
