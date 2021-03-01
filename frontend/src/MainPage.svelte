<script lang="ts">
  import type ClientStorage from './types/ClientStorage';
  import type { UserMeta } from './types/ClientStorage';
  import type { Account } from './types/Api';

  import Router, { setState } from './router/Router.svelte';
  import Route from './router/Route.svelte';

  import Homepage from './routes/Homepage.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import ErrorMessage from './components/ErrorMessage.svelte';
  import { onMount } from 'svelte';
  import { logout } from './endpointApi';

  export let storage: ClientStorage<UserMeta, 'name'>;
  export let authorized: boolean;

  let message: string | null;

  const handleAuthorization = async ({
    detail,
  }: CustomEvent<{ name: string; accounts: Account[] }>) => {
    const { name, accounts } = detail;
    await storage.putItem({ name, accounts });
    message = null;
    setState('home');
  };

  const handleError = ({ detail }: CustomEvent<{ message: string }>) => {
    message = detail.message;
  };

  const handleLogout = async () => {
    await storage.clear();
    await logout();
    setState('signIn');
  };

  onMount(() => {
    authorized ? setState('home') : setState('signIn');
  });
</script>

{#if message}
  <ErrorMessage bind:message />
{/if}
<Router>
  <Route path="home">
    <Homepage on:logout={handleLogout} {storage} />
  </Route>
  <Route path="signIn">
    <SignIn
      on:login={handleAuthorization}
      on:openSignUp={() => setState('signUp')}
      on:error={handleError}
    />
  </Route>
  <Route path="signUp">
    <SignUp
      on:signUp={handleAuthorization}
      on:openSignIn={() => setState('signIn')}
      on:error={handleError}
    />
  </Route>
  <Route path="loading">Loading</Route>
</Router>
