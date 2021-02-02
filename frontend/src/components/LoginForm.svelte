<script lang="ts">
  export let title: string;

  export let actionButton: {
    label: string;
    onclick: () => any;
  };
  export let linkButton: {
    href: string;
    label: string;
    prefix: string;
  };
</script>

<div
  class="md:shadow-xl max-w-none max-h-none md:max-w-sm  m-auto bg-opacity-50 lg:h-4/6 rounded-3xl border-white md:border-gray-200 border-2 bg-white"
>
  <h1
    class="containter text-3xl text-coolGreen-default font-bold big-text pt-20 lg:pt-11 pb-7 leading-9"
  >
    {title}
  </h1>

  <form class="m-auto">
    <div id="aaa">
      <slot />
    </div>
    <button
      type="button"
      on:click|preventDefault={actionButton.onclick}
      class="text-gray-50 bg-coolGreen-default py-1 px-5 text-xl uppercase font-medium mt-10 rounded-3xl"
      >{actionButton.label}</button
    >
  </form>

  <div class="grid grid-cols-2 col-auto mt-9 pb-5 lg:pb-10">
    <p>{linkButton.prefix}</p>
    <!-- <Link to={linkButton.href}> -->
    <a href={linkButton.href}>{linkButton.label}</a>
    <!-- </Link> -->
  </div>
</div>
