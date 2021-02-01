<script lang="ts">
  import { Link } from 'svelte-routing';
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
  class="max-w-none max-h-none md:max-w-sm bg-gray-signIn m-auto bg-opacity-50 lg:mt-10 lg:h-4/6"
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
      class="text-gray-50 bg-coolGreen-default py-1 px-5 text-2xl uppercase font-medium mt-10"
      >{actionButton.label}</button
    >
  </form>

  <div class="grid grid-cols-2 col-auto mt-9 pb-32 lg:pb-14">
    <p>{linkButton.prefix}</p>
    <Link to={linkButton.href}>
      {linkButton.label}
    </Link>
  </div>
</div>
