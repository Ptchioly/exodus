<script context="module" lang="ts">
  export let forceLimitSet: () => Promise<void> | null = null;
</script>

<script lang="ts">
  // import { onMount } from 'svelte';
  import { updateLimit } from "../endpointApi";
  import Bars from "./Bars.svelte";
  import type { LabelPosition, StackedBars } from "../types/charts";
  import { createEventDispatcher } from "svelte";
  import { staticValues } from "./configs";

  export let title: string;
  export let current: number;
  export let previous: number;
  export let limit: number;
  export let maxValue = 4000;

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

  const generateChartData = (maxValue): StackedBars => {
    const currentBar = {
      value: current,
      limits: ["current"],
      background: staticValues.currentBgColor,
      labelPosition: "in-left" as LabelPosition,
      label: staticValues.valueString,
      detailedLabel: staticValues.valueString,
    };

    const previousBar = {
      ...currentBar,
      value: previous,
      limits: ["previous"],
      background: staticValues.previousBgColor,
    };

    const previousLimit = {
      name: "previous",
      value: limit,
      color: staticValues.limitColor,
      visible: "static" as "static" | "hover",
      overlapStyle: "stripes" as "" | "stripes",
    };

    const currentLimit = {
      ...previousLimit,
      name: "current",
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

  $: apiRequest = generateChartData(maxValue);

  const updateInput = ({ detail }) => {
    limit = +detail.limit.value;
    dispatch("updateMaxValue", { limit });
  };

  let timeoutId: any;
  let delay = 1500;

  const handleChange = () => {
    if (isNaN(+limit) || limit.toString().length === 0) limit = 0;
    if (limit <= 0) props.activeInput = false;
    if (typeof +limit === "number" && +limit >= 0) setLimit();
  };

  const setLimit = () => {
    if (timeoutId) clearInterval(timeoutId);
    forceLimitSet = () => updateLimit(title, limit);
    timeoutId = setTimeout(async () => {
      await forceLimitSet();
      forceLimitSet = null;
    }, delay);
  };

  $: window.onbeforeunload = (e) => {
    forceLimitSet();
  };

  const handlePress = (e) => {
    const step = 50;

    if (e.key === "ArrowUp" && limit + step <= maxValue) {
      limit += step;
      handleChange();
    } else if (e.key === "ArrowDown" && limit - step >= 0) {
      limit -= step;
      handleChange();
    }
  };
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
    padding: 0.75em 0;
    user-select: none;
    -webkit-user-select: none;
    justify-content: space-between;
  }

  .top,
  .bottom {
    display: flex;
  }

  .top {
    width: 30%;
  }

  .bottom {
    width: 60%;
    font-size: 0.8em;
    display: flex;
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
    font-family: "Roboto", sans-serif;
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

  /* .bar__container {
    width: 100%;
    height: 2em;
    background-color: #e7f4ec;
    border-radius: 8px;
    margin-left: 1em;
  }

  .bars {
    display: flex;
    flex-direction: column;
    flex-shrink: 20;
  }

  .bar {
    height: 2em;
    max-width: 100%;
    border-radius: 8px;
    transition: margin 0.2s, width 0.5s ease;
    display: flex;
    flex-direction: row-reverse;
  }

  .bar__over {
    height: 2em;
    background-color: #ec080899;
    border-radius: 0 8px 8px 0;
    transition: width 0.4s;
  }

  .bar__over.moveable {
    transition: width 0s;
  }

  .bar__toLimit,
  .unbar__toLimit {
    display: flex;
    align-items: center;
  }

  .bar__toLimit > div,
  .unbar__toLimit > div {
    width: 100%;
    height: 1em;
    margin: 4px;
    display: flex;
    align-items: center;
    border-left: 1px solid #2f9e9e;
    border-right: 1px solid #2f9e9e;
  }

  .bar__toLimit > div > div,
  .unbar__toLimit > div > div {
    width: 100%;
    height: 0px;
    border-top: 1px dashed #2f9e9e;
  }

  .bar__toLimit > div > div.detailed::before,
  .unbar__toLimit > div > div.detailed::before {
    content: attr(data-value);
    font-size: 0.5em;
    color: #2f9e9e;
    margin-left: -1.1em;
    margin-top: -0.8em;
    position: absolute;
    background-color: #2f9e9e;
    border-radius: 0.3em;
    color: white;
    padding: 1px 3px;
  }

  .unbar__toLimit {
    margin-top: -2em;
    height: 2em;
  }

  .detailed > .bars > .bar--previous {
    margin-top: 0.5em;
    margin-left: -0.5em;
  }

  .detailed > .bars > .bar--current,
  .detailed > .bars > .unbar__toLimit {
    margin-top: -1.5em;
    margin-left: -1em;
    transition: margin 0.2s, width 0.5s ease;
  }

  .detailed > .limits:hover > .limit--red,
  .detailed > .limits > .limit--red {
    width: 2px;
    margin-left: -1em;
  }

  .detailed > .bars > .bar--previous::after {
    content: attr(data-value);
    position: absolute;
    margin-top: -1.1em;
    font-size: 0.85em;
  }

  .bar--previous {
    background-color: #a6d6d1;
  }

  .bar--current {
    background-color: #2f9e9e;
    margin-top: -2em;
    display: flex;
    box-sizing: border-box;
    color: #d4e7e5;
    transition: margin 0.2s, width 0.7s;
  }

  .bar--current::after {
    content: attr(data-value);
    position: absolute;
    height: 2.3em;
    display: flex;
    align-items: center;
    padding-right: 0.75em;
    font-size: 0.85em;
  }

  .bar--current[data-hiddenValue='true']::after {
    content: attr(data-value);
    position: absolute;
    height: 2em;
    display: flex;
    align-items: center;
    padding-right: 0.75em;
    visibility: hidden;
  }

  .bottom:hover
    > .bar__container
    > .bars
    > .bar--current[data-hiddenValue='true']::after {
    visibility: visible;
    height: 2.33em;
    padding: 0 0.75em;
    background-color: #20aeae;
    color: #eee;
    border-radius: 8px;
    margin: -0.35em 0em 0 0;
    border-bottom-right-radius: 0;
    transition: all 0.2s;
    z-index: 100;
  }

  .limits {
    margin-top: -2em;
    position: relative;
  }

  .limit--red {
    width: 2px;
    height: 2em;
    background-color: #ec0808;
    position: relative;
    border-radius: 2px;
    border: 1px solid #ec0808;
    border-top: 1px solid #ec0808;
    border-bottom: 1px solid #ec0808;
    transition: margin 0.2s, left 0.4s, width 0.2s;
    cursor: move;
  }

  .limit--red:hover {
    width: 1em;
  }

  .limit.hidden {
    display: none;
  }

  .limits:hover > .limit {
    width: 1em;
  }

  .limit.moveable {
    cursor: default;
    transition: margin 0.2s, left 0s, width 0.2s;
    width: 1em;
  }

  .limit.moveable::after {
    content: attr(data-value);
    position: absolute;
    color: #ec0808;

    font-weight: bold;
    font-size: 0.75em;
    margin-top: -1.2em;
    margin-left: -8px;
  } */

  @media (max-width: 50em) {
    .wrapper {
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
      padding-left: 1em;
    }
    .top > .actions {
      order: 2;
      justify-content: flex-end;
    }
  }
</style>
