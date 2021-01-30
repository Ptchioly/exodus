<script lang="ts">
  // import TailwindCss from "./TailwindCss.svelte";
  import RawCharts from "./charts/RawCharts.svelte";
</script>

<img src="https://i.kym-cdn.com/entries/icons/square/000/002/242/New_duane.gif" alt="Duane!" />

<!-- <TailwindCss /> -->
<main>
  <!-- <h1 class="text-gray-500 font-extralight text-5xl">Hello,</h1>
  <h1 class="font-black italic tracking-wide text-indigo-600 text-5xl">SOBAKA,</h1>
  <h1 class="font-black italic tracking-wide text-5xl">SMOTRI:</h1> -->
  <section class="container">
    <RawCharts />
  </section>
</main>

<style global lang="postcss">
  .container {
    max-width: 900px;
    padding: 0 15px;
    margin: 0 auto;
  }
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
