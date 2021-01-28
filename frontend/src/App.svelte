<script lang="ts">
  import MyBar from "./MyBar.svelte";
  import Pank from "./Pank.svelte";

  // import Chart from "./Chart.svelte";
  // import MyChart from "./MyChart.svelte";
</script>

<main>
  <h1>Hello!</h1>
  <!-- <Chart /> -->
  <MyBar />
  <Pank />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
