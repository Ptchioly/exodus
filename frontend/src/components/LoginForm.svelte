<script lang="ts">
  export let title: string;
  export let actionButton: {
    label: string;
    onclick: () => any;
    dataAut: string;
  };
  export let linkButton: {
    label: string;
    onclick: () => any;
    prefix: string;
    dataAut: string;
  };
</script>

<div
  class="shadow-xl max-w-xl max-h-none w-full md:max-w-sm  m-auto bg-opacity-50 rounded-3xl border-white md:border-gray-200 border-2 bg-white dark:bg-lightdark"
>
  <h1
    class="containter text-3xl text-indigo-500   font-bold big-text pt-20 lg:pt-11 pb-3 leading-9"
  >
    {title}
  </h1>

  <form class="m-auto">
    <div>
      <slot />
    </div>
    <button
      type="button"
      data-automation-id={actionButton.dataAut}
      on:click|preventDefault={actionButton.onclick}
      class="text-gray-50 bg-indigo-500 py-1 px-5 text-xl uppercase font-medium mt-10 rounded-3xl focus:outline-none hover:shadow-lg hover:bg-indigo-500 active:bg-indigo-600 active:shadow-xl"
      >{actionButton.label}</button
    >
  </form>

  <div
    on:click={linkButton.onclick}
    class="mt-9 pb-5 lg:pb-10 flex justify-center cursor-pointer dark:text-gray-300"
  >
    <p>{linkButton.prefix}</p>
    <p class="cursor-pointer ml-2" data-automation-id={linkButton.dataAut}>
      {linkButton.label}
    </p>
  </div>
</div>
<svelte:window
  on:keypress={({ key }) => {
    if (key === 'Enter') actionButton.onclick();
  }}
/>
