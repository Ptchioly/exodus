<script lang="ts">
  import TailwindCss from './TailwindCss.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import Homepage from './routes/Homepage.svelte';
  import { onMount } from 'svelte';
  import { getStatement, getUserInfo, isAuthenticated } from './endpointApi';
  import type { NavigationState } from './types/Layout';
  import type { APIResponse } from './types/Api';
  import { isSuccessResponse } from './types/guards';
  import Loading from './routes/Loading.svelte';

  let navigationState: NavigationState = 'loading';
  let authorized: boolean | undefined;
  let error: boolean = false;
  const currentDate = Date.now();
  let previous;
  let current;

  onMount(async () => {
    authorized = await isAuthenticated();
    navigationState = authorized ? 'home' : 'signIn';
  });

  const handleSignIn = async ({ detail }: CustomEvent<APIResponse>) => {
    if (isSuccessResponse(detail)) {
      await getUserInfo();
      previous = await getStatement(currentDate, 'previous');
      navigationState = 'waiting';
      setTimeout(async () => {
        current = await getStatement(currentDate, 'current');
        navigationState = 'home';
      }, 70000);
    }
  };

  const handleApiResponse = async ({ detail }: CustomEvent<APIResponse>) => {
    if (isSuccessResponse(detail)) navigationState = 'home';
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
      on:signUp={handleSignIn}
      on:openSignIn={handleOpenSignIn}
      bind:error
    />
  {:else if navigationState === 'waiting'}
    <Loading />
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
