<script lang="ts">
  import TailwindCss from './TailwindCss.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import Homepage from './routes/Homepage.svelte';
  import { onMount } from 'svelte';
  import { getUserInfo, isAuthenticated } from './endpointApi';
  import type { NavigationState } from './types/Layout';
  import type { APIResponse } from './types/Api';
  import { isSuccessResponse } from './types/guards';

  let navigationState: NavigationState = 'loading';
  let authorized: boolean | undefined;
  let error: boolean = false;

  onMount(async () => {
    authorized = await isAuthenticated();
    navigationState = authorized ? 'home' : 'signIn';
  });

  const handleApiResponse = async ({
    detail,
  }: CustomEvent<APIResponse<{ name: string }>>) => {
    if (isSuccessResponse(detail)) {
      localStorage.setItem('name', detail.data.name);
      navigationState = 'home';
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
</script>

<TailwindCss />
<main class="font-main h-screen md:mx-20 text-center flex content-center p-0">
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

<style global lang="postcss">
  html {
    background-color: aliceblue;
  }
  @media only screen and (max-width: 600px) {
    html {
      font-size: 12px;
    }
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
