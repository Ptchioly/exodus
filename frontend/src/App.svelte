<script lang="ts">
  import TailwindCss from "./TailwindCss.svelte";
  import TailChart from "./charts/TailChart.svelte";
</script>

<TailwindCss />
<main>
  <h1 class="text-gray-500 font-extralight text-5xl">Hello,</h1>
  <h1 class="font-black italic tracking-wide text-indigo-600 text-5xl">
    SOBAKA,
  </h1>
  <h1 class="font-black italic tracking-wide text-5xl">SMOTRI:</h1>
  <br />
  <TailChart />
</main>

<style global lang="postcss">
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
