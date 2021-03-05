<script lang="ts">
  import type ClientStorage from './types/ClientStorage';
  import type { UserMeta } from './types/ClientStorage';
  import type { Account } from './types/Api';

  import { Router, Route, setState } from './router/router';

  import Homepage from './routes/Homepage.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import ErrorMessage from './components/ErrorMessage.svelte';
  import { onMount } from 'svelte';
  import { logout } from './endpointApi';
  import type { NavigationState } from './types/Layout';

  export let storage: ClientStorage<UserMeta, 'name'>;
  export let authorized: boolean;

  let message: string | null;

  const handleAuthorization = async ({
    detail: { name, accounts },
  }: CustomEvent<{ name: string; accounts: Account[] }>) => {
    await storage.putItem({ name, accounts });
    message = null;
    setState('home');
  };

  const handleError = ({ detail }: CustomEvent<{ message: string }>) => {
    message = detail.message;
  };

  const handleStateChange = ({
    detail: { state },
  }: CustomEvent<{ state: NavigationState }>) => setState(state);

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
    {#await storage.getAll() then [userMeta]}
      <Homepage on:logout={handleLogout} {...userMeta} />
    {/await}
  </Route>
  <Route path="signIn">
    <SignIn
      on:login={handleAuthorization}
      on:stateChange={handleStateChange}
      on:error={handleError}
    />
  </Route>
  <Route path="signUp">
    <SignUp
      on:signUp={handleAuthorization}
      on:stateChange={handleStateChange}
      on:error={handleError}
    />
  </Route>
  <Route path="loading">Loading</Route>
</Router>
