<script lang="ts">
  import TailwindCss from './TailwindCss.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import Homepage from './routes/Homepage.svelte';
  import { onMount } from 'svelte';
  import { isAuthenticated } from './endpointApi';
  import type { NavigationState } from './types.ts/Layout';

  export let url = '';

  let navigationState: NavigationState = 'loading';
  let authorized: boolean | undefined;

  onMount(async () => {
    authorized = await isAuthenticated();
    navigationState = authorized ? 'home' : 'signIn';
  });

  const handleLogin = ({
    detail: { success },
  }: CustomEvent<{ success: boolean }>) => {
    if (success) {
      navigationState = 'home';
      return;
    }
    alert('Ti ne ptchiola');
  };

  const handleLogout = () => {
    navigationState = 'signIn';
  };

  const handleOpenSignUp = () => {
    navigationState = 'signUp';
  };

  const handleOpenSignIn = () => {
    navigationState = 'signIn';
  };
</script>

<TailwindCss />
<main class="font-main h-screen text-center flex content-center">
  {#if navigationState === 'home'}
    <Homepage on:logout={handleLogout} />
  {:else if navigationState === 'signIn'}
    <SignIn on:login={handleLogin} on:openSignUp={handleOpenSignUp} />
  {:else if navigationState === 'signUp'}
    <SignUp on:openSignIn={handleOpenSignIn} />
  {:else}
    Loading
  {/if}
</main>

<svelte:head>
  <link rel="icon" type="image/png" href="images/favicon.png" />
</svelte:head>

<!-- Probably should be placed in html tag with tailwind and using 'rem' instead of 'px' -->
<style global lang="postcss">
  main {
    background-color: aliceblue;
  }
  @media only screen and (min-width: 600px) {
    html {
      font-size: 12px;
    }
  }
  @media only screen and (min-width: 768px) {
    html {
      font-size: 16px;
    }
  }
  @media only screen and (min-width: 992px) {
    html {
      font-size: 18px;
    }
  }

  @media only screen and (min-width: 1200px) {
    html {
      font-size: 20px;
    }
  }
  /* @media only screen and (min-width: 1600px) {
    html {
      font-size: 24px;
    }
  } */

  :global(*:focus) {
    outline: none;
  }
</style>
