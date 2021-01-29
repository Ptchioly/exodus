<script lang="ts">
  import data from "../data";

  const barElements = [25, 40, 90];
</script>

{#each data as { name, currMonth, prevMonth, limit, id } (id)}
  <div class="category">
    <span class="cat-name" title={name}>{name}</span>
    <div class="cat-bar">
      <!-- <div class="bar-elements"> -->
      {#each barElements as barEl}
        <div class="bar" style="left: {barEl}%" />
      {/each}
      <!-- </div> -->
    </div>
    <div class="cat-limit">
      <span class="limit-value">{limit}</span>
    </div>
  </div>
{/each}

<style>
  .category {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    margin: 0.5rem;
  }

  .cat-name {
    flex: 1 1 10%;
    font-size: 1.6rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }

  .cat-limit {
    flex: 0 0 10%;
    margin-left: 1rem;
  }

  .limit-value {
    padding: 5px 15px 5px 15px;
    border-color: mediumaquamarine;
    border-width: 1.2px;
  }

  .cat-bar {
    flex: 1 1 75%;
    padding: 0.5rem;
    height: 2.7rem;
    background-color: lightgrey;
    opacity: 0.6;
    position: relative;
  }

  /* .bar-elements {
    overflow: hidden;
  } */

  .bar {
    height: 1.9rem;
    display: inline-block;
    position: absolute;
    /* temp */
    width: 25%;
    background-color: lightsalmon;
    border: 2px solid maroon;
  }
</style>
