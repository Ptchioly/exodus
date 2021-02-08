<main class="flex justify-center bg-white ml-2 -mt-3">
  <div class="mono">
    <span
      on:click={() => window.open('https://api.monobank.ua')}
      class="flex rounded-lg cursor-pointer"
    >
      <img src="images/mono-logo.png" alt="mono" />
    </span>
  </div>
</main>

<style>
  .mono {
    width: 2em;
  }
  span:hover {
    box-shadow: 0 0 0 2px #e7e7e7;
  }
</style>
