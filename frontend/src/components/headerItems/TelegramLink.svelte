<script lang="ts">
  export let href: string;
</script>

<div
  class="h-8 w-8 flex cursor-pointer shadow-md rounded-2xl mx-2"
  data-automation-id="telegram-link"
  on:click={() => window.open(href)}
>
  <img src="images/tg.png" alt="telegram" />
</div>
