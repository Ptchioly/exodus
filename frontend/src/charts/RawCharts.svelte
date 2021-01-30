<script lang="ts">
  import data from "../data";

  const barStacks = [6, 9, 7];
  const barLines = [25, 40, 90];
</script>

<h1>CSS IS <span style="font-style: italic">HELL</span></h1>

{#each data as { name, currMonth, prevMonth, limit, id } (id)}
  <article class="category">
    <div class="box-limit">
      <span class="limit">{limit}</span>
    </div>
    <div class="box-name">
      <span class="name" title={name}>{name}</span>
    </div>
    <div class="box-bar">
      <div class="bar-stacks" style="background-color: gray">
        {#each barStacks as stackWidth}
          <div class="stack" style="flex-basis: {stackWidth}%" />
        {/each}
      </div>
      {#each barLines as linePosition}
        <div class="bar-line" style="left: {linePosition}%" />
      {/each}
    </div>
  </article>
{/each}

<style>
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .category {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: 1.1rem;
  }

  .box-limit {
    flex: 0 0 10%;
    margin-right: 2%;
  }

  .limit {
    border: 0.1rem solid aqua;
    padding: 0.2rem 0.8rem;
  }

  .box-name {
    flex: 1 1 10%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }

  .name {
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
  }

  .box-bar {
    flex: 1 1 80%;
    padding: 0.4rem;
    height: 2.4rem;
    background-color: lightgrey;
    opacity: 0.6;
    position: relative;
  }

  .bar-stacks {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
  }

  .stack {
    /* temp */
    height: 100%;
    flex-grow: 0;
    flex-shrink: 1;
    background-color: lightskyblue;
    border: 1px solid blue;
  }

  .bar-line {
    background-color: red;
    height: 80%;
    top: 10%;
    position: absolute;
    width: 0.25%;
  }
</style>
