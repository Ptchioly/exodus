<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import LoginForm from '../components/LoginForm.svelte';
  import { signIn } from '../endpointApi';

  let phoneNumber: string;
  let pwd: string;
  let monoToken: string;
  const dispatch = createEventDispatcher();

  const signInButton = {
    label: 'Sign In',
    onclick: () =>
      signIn(phoneNumber, pwd).then((success) => {
        dispatch('login', { success });
      }),
  };
  const signUpButton = {
    prefix: 'New to Exodus?',
    label: 'Join Now',
    href: '/signUp',
  };
</script>

<!-- TODO: Make template more responsive.
     This should be done by implementing mobile design first
     Also I think that bg-color should fill the whole space on small screens
-->
<LoginForm
  title="Sign in to Exodus"
  linkButton={signUpButton}
  actionButton={signInButton}
>
  <input
    class="sobaka-input"
    type="text"
    placeholder="Phone number"
    required
    bind:value={phoneNumber}
  />
  <input
    class="sobaka-input mt-5"
    type="password"
    placeholder="Password"
    required
    bind:value={pwd}
  />
  <!-- <input
    class="sobaka-input mt-5"
    type="password"
    placeholder="Monobank token"
    required
    bind:value={monoToken}
  /> -->
  <!-- <img src="images/show-password.svg" alt="show"/> -->
  <!-- <p class="my-6 text-gray-700 font-medium text-lg">Forgot your password?</p> -->
</LoginForm>

<style global lang="postcss">
  .sobaka-input {
    @apply w-3/4 text-sm text-black placeholder-gray-500 border-gray-200 py-4 pl-5 rounded-lg border-2;
  }
  .sobaka-input:focus {
    @apply border-gray-400 border-2;
  }
</style>
