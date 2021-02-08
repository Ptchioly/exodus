<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let title: string;
  export let current: number;
  export let previous: number;
  export let limit: number;
  const barSize = 2000;

  let currentP = 0;
  let previousP = 0;
  let limitP = 0;
  let overlap: number;

  let bar: HTMLElement;
  let limits: HTMLElement;

  const dispatch = createEventDispatcher();

  const detailed = (e) => {
    if (!bar || e.target.classList.contains('limit')) return;
    bar.classList.toggle('detailed');
  };

  const countOverlap = () => {
    return limit && current > limit
      ? ((currentP - limitP) * bar.offsetWidth) / 100
      : 0;
  };

  const percentOf = (i) => (i * 100) / barSize;

  const handlePress = (e) => {
    const step = 50;
    if (e.key === 'ArrowUp' && limit + step <= barSize) {
      limit += step;
    } else if (e.key === 'ArrowDown' && limit - step >= 0) {
      limit -= step;
    }
  };

  const setLimitOnMouseUp = (limit: number) => (): void => {
    dispatch('setLimit', { limit });
  };

  const move = (e) => {
    const node = e.target;
    node.classList.add('moveable');
    const overlap = bar.querySelector('.bar__over');
    overlap.classList.add('moveable');

    const handleMove = (e) => {
      const limitsRect = limits.getBoundingClientRect();
      const movePercent = Math.round(
        ((e.clientX - limitsRect.left) * 100) / limitsRect.width
      );
      if (movePercent >= 0 && movePercent <= 100) {
        limit = Math.round((movePercent * barSize) / 100);
      }
    };

    const handleEnd = (e) => {
      node.classList.remove('moveable');
      overlap.classList.remove('moveable');
      window.removeEventListener('mousemove', handleMove);
    };

    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('mouseup', setLimitOnMouseUp(limit));
    window.addEventListener('mousemove', handleMove);
  };

  window.addEventListener('resize', () => (overlap = countOverlap()));

  onMount(() => {
    setTimeout(() => {
      currentP = percentOf(current);
      previousP = percentOf(previous);
      limitP = percentOf(limit);
    }, 20);
  });

  $: {
    limitP = percentOf(limit);
    overlap = countOverlap();
  }
</script>

<div class="wrapper">
  <div class="top">
    <section class="actions">
      {#if limit <= 0}
        <button class="action action--addLimit" on:click={() => (limit = 50)}>
          <img src="/images/add.svg" alt="+" />
        </button>
      {:else}
        <input
          type="text"
          bind:value={limit}
          on:keydown={handlePress}
          pattern="\d+"
          class="action action--setLimit"
        />
      {/if}
    </section>

    <section class="title">
      <div class="title__name">
        {title}
      </div>
    </section>
  </div>

  <div class="bottom">
    <section
      class="bar__container"
      class:detailed={false}
      bind:this={bar}
      on:mousedown={detailed}
    >
      <div class="bars">
        <div
          class="bar bar--previous"
          data-value={`$${previous}`}
          style={`width: ${previousP}%`}
        />
        <div
          class="bar bar--current"
          style={`width: ${currentP}%`}
          data-value={`$${current}`}
        >
          <div
            class="bar__over"
            class:moveable={false}
            style={`width: ${overlap}px`}
          />
        </div>
      </div>

      <div class="limits" bind:this={limits}>
        <div
          class="limit limit--red"
          on:mousedown={move}
          class:hidden={limit <= 0}
          class:moveable={false}
          data-value={`${limit}`}
          style={`left: ${limitP}%`}
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
    width: 45%;
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
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
  }

  .title {
    width: 55%;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    display: flex;
    flex-shrink: 0;
    align-items: center;
  }

  .title__name {
    /* text-transform: uppercase; */
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
    min-width: 5em;
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

  .detailed > .bars > .bar--previous {
    margin-top: 0.5em;
    margin-left: -0.5em;
  }

  .detailed > .bars > .bar--current {
    margin-top: -1.5em;
    margin-left: -1em;
  }

  .detailed > .limits:hover > .limit--red,
  .detailed > .limits > .limit--red {
    width: 2px;
    margin-left: -1em;
  }

  .detailed > .bars > .bar--previous::after {
    content: 'previous: ' attr(data-value);
    position: absolute;
    font-weight: bold;
    margin-top: -1em;
    font-family: 'Courier New', Courier, monospace;
  }

  .bar--previous {
    width: 50%;
    background-color: #a6d6d1;
  }

  .bar--current {
    width: 30%;
    background-color: #2f9e9e;
    margin-top: -2em;
    display: flex;
    box-sizing: border-box;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    color: #a6d6d1;
    transition: margin 0.2s, width 0.7s;
  }

  .bar--current::after {
    content: attr(data-value);
    position: absolute;
    height: 2em;
    display: flex;
    align-items: center;
    padding-right: 0.75em;
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
    top: -1px;
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
    transition: margin 0.2s, left 0.001s, width 0.2s;
    width: 1em;
  }

  .limit.moveable::after {
    content: attr(data-value);
    position: absolute;
    color: #ec0808;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 0.8em;
    margin-top: -1em;
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
