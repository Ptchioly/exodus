<script lang="ts">
  import TailwindCss from './TailwindCss.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import Homepage from './routes/Homepage.svelte';
  import { onMount } from 'svelte';
  import { getStatement, isAuthenticated } from './endpointApi';
  import type { NavigationState } from './types/Layout';
  import type { APIResponse } from './types/Api';
  import { isSuccessResponse } from './types/guards';

  export let url = '';

  let navigationState: NavigationState = 'loading';
  let authorized: boolean | undefined;
  const currentDate = Date.now();

  onMount(async () => {
    authorized = await isAuthenticated();
    navigationState = authorized ? 'home' : 'signIn';
  });

  const handleApiResponse = async ({ detail }: CustomEvent<APIResponse>) => {
    if (isSuccessResponse(detail)) {
      navigationState = 'home';
      await getStatement(currentDate, 'previous');
      setTimeout(async () => {
        await getStatement(currentDate, 'current');
      }, 70000);
      return;
    }
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
  $: console.log(navigationState);
</script>

<TailwindCss />
<main class="font-main h-screen text-center flex content-center">
  {#if navigationState === 'home'}
    <Homepage on:logout={handleLogout} />
  {:else if navigationState === 'signIn'}
    <SignIn on:login={handleApiResponse} on:openSignUp={handleOpenSignUp} />
  {:else if navigationState === 'signUp'}
    <SignUp on:signUp={handleApiResponse} on:openSignIn={handleOpenSignIn} />
  {:else}
    Loading
  {/if}

  <!-- <h1 class="text-gray-500 font-extralight text-5xl">Hello,</h1>
  <h1 class="font-black italic tracking-wide text-indigo-600 text-5xl">SOBAKA,</h1>
  <h1 class="font-black italic tracking-wide text-5xl">SMOTRI:</h1> -->
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
