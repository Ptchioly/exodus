<script lang="ts">
  import { updateLimit } from '../endpointApi';

  export let title: string;
  export let current: number;
  export let previous: number;
  export let limit: number;
  export let maxValue = 4000;

  const percentage = {
    current: 0,
    previous: 0,
    limit: 0,
  }

  const props = {
    hideValue: false,
    overlap: 0,
    remainings: 0
  }
  
  let barContainer: HTMLElement;
  let limits: HTMLElement;
  let currentBar: HTMLElement;
  
  const percentOf = (value: number): number => (value * 100) / maxValue;

  const getRemainingsPercent = () => percentOf((limit - current) * (maxValue / current));
  
  const getOverlapPercent = () => {
    return limit && current > limit
      ? (maxValue / current) * (percentOf(current) - percentage.limit)
      : 0;
  };

  const isSmallEnough = (elem: HTMLElement) => {
    if (elem) {
      const barRect = barContainer.getBoundingClientRect();
      return (percentage.current * barRect.width) / 100 < 60;
    }
  };

  let timeoutId: any;
  let delay = 1500;
  let limitCallback: () => Promise<any> | null;

  const setLimit = () => {
    if (timeoutId) clearInterval(timeoutId);
    limitCallback = () => updateLimit(title, limit);
    timeoutId = setTimeout(async () => {
      await limitCallback();
      limitCallback = null;
    }, delay);
  };

  window.onbeforeunload = () => {
    limitCallback && limitCallback();
  };

  const handlePress = (e) => {
    const step = 50;

    if (e.key === 'ArrowUp' && limit + step <= maxValue) {
      limit += step;
      setLimit();

    } else if (e.key === 'ArrowDown' && limit - step >= 0) {
      limit -= step;
      setLimit();
    }
  };

  const handleDetailedView = (e) => {
    if (!barContainer || e.target.classList.contains('limit')) return;
    barContainer.classList.toggle('detailed');
  };

  const handleInitLimit = () => {
    limit = current ? Math.ceil(current * 1.1) : 50;
    setLimit();
  }

  const handleDragLimit = (e) => {
    const node = e.target;
    node.classList.add('moveable');
    const overlap = barContainer.querySelector('.bar__over');
    overlap && overlap.classList.add('moveable');

    const handleMove = (e) => {
      const limitsRect = limits.getBoundingClientRect();
      const moveToPercent = Math.round(
        ((e.clientX - limitsRect.left) * 100) / limitsRect.width
      );
      if (moveToPercent >= 0 && moveToPercent <= 100) {
        limit = Math.round((moveToPercent * maxValue) / 100);
      }
    };

    const handleEnd = (e) => {
      node.classList.remove('moveable');
      overlap && overlap.classList.remove('moveable');
      window.removeEventListener('mousemove', handleMove);
      setLimit();
    };

    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('mousemove', handleMove);
  };

  $: {
    percentage.current = percentOf(current);
    percentage.previous = percentOf(previous);
    percentage.limit = percentOf(limit);

    props.overlap = getOverlapPercent();
    props.remainings = getRemainingsPercent();
    props.hideValue = isSmallEnough(currentBar);

    // Force reload for cases where there are no new values for prev, limit, or curr fields
    maxValue = maxValue; 
  }
</script>

<div class="wrapper">

  <div class="top">
    <section class="actions">
      {#if limit <= 0}
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
          bind:value={limit}
          on:change={setLimit}
          on:keydown={handlePress}
          pattern="\d+"
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
    <section
      class="bar__container"
      class:detailed={false}
      bind:this={barContainer}
      on:mousedown={handleDetailedView}
    >
      <div class="bars">
        <div
          class="bar bar--previous"
          data-value={`₴${previous}`}
          style={`width: ${percentage.previous}%`}
        />
        {#if current > 0}
          <div
            class="bar bar--current"
            style={`width: ${percentage.current}%`}
            data-value={`₴${current}`}
            bind:this={currentBar}
            data-hiddenValue={props.hideValue}
          >
            <div
              class="bar__over"
              class:moveable={false}
              style={`width: ${limit > 0 && props.overlap}%`}
            />
            <div
              class="bar__toLimit"
              style={`width: ${props.remainings}%; margin-right: -${props.remainings}%;`}
            >
              {#if limit && limit > current + 20}
                <div>
                  <div
                    class:detailed={limit - current > 99}
                    data-value={Math.ceil(limit - current)}
                  />
                </div>
              {/if}
            </div>
          </div>
        {:else if limit > 0 && !current}
          <div class="unbar__toLimit" style="width: {percentage.limit}%">
            <div>
              <div class:detailed={limit - current > 99} data-value={limit} />
            </div>
          </div>
        {/if}
      </div>

      <div class="limits" bind:this={limits}>
        <div
          class="limit limit--red"
          on:mousedown={handleDragLimit}
          class:hidden={limit <= 0}
          class:moveable={false}
          data-value={`${limit}`}
          data-automation-id="limit-setter"
          style={`left: ${percentage.limit}%`}
        />
      </div>
    </section>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    padding: 0.75em 0;
    user-select: none;
    -webkit-user-select: none;
  }

  .top,
  .bottom {
    display: flex;
    flex-shrink: 0;
  }

  .top {
    width: 30%;
  }

  .bottom {
    width: 70%;
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

  .bar__container {
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
  }

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
