<script lang="ts">
  export let dataAut: string;
  export let label: string;
</script>

<form class="m-auto">
  <div>
    <slot />
  </div>
  <button
    on:click|preventDefault
    type="button"
    data-automation-id={dataAut}
    class="text-gray-50 bg-indigo-500 py-1 px-5 text-xl uppercase font-medium mt-10 rounded-3xl focus:outline-none hover:shadow-lg hover:bg-indigo-500 active:bg-indigo-600 active:shadow-xl"
  >
    {label}
  </button>
</form>
