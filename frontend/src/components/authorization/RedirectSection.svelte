<script lang="ts">
  export let prefix: string;
  export let label: string;
  export let dataAut: string;
</script>

<div
  on:click
  class="mt-9 pb-5 lg:pb-10 flex justify-center cursor-pointer dark:text-gray-300"
>
  <p>{prefix}</p>
  <p class="cursor-pointer ml-2" data-automation-id={dataAut}>
    {label}
  </p>
</div>
