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

  let navigationState: NavigationState = 'loading';
  let authorized: boolean | undefined;
  let error: boolean = false;
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
    error = false;
    navigationState = 'signIn';
  };

  const handleOpenSignUp = () => {
    error = false;
    navigationState = 'signUp';
  };

  const handleOpenSignIn = () => {
    error = false;
    navigationState = 'signIn';
  };
  $: console.log(navigationState);
</script>

<TailwindCss />
<main class="font-main h-screen text-center flex content-center">
  {#if navigationState === 'home'}
    <Homepage on:logout={handleLogout} />
  {:else if navigationState === 'signIn'}
    <SignIn
      on:login={handleApiResponse}
      on:openSignUp={handleOpenSignUp}
      bind:error
    />
  {:else if navigationState === 'signUp'}
    <SignUp
      on:signUp={handleApiResponse}
      on:openSignIn={handleOpenSignIn}
      bind:error
    />
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
