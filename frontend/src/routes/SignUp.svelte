<script lang="ts">
  import { signIn } from '../endpointApi';
  import LoginForm from '../components/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';

  let phoneNumber;
  let pwd;

  const dispatch = createEventDispatcher();
  const singUpButton = {
    label: 'Sign Up',
    onclick: () => signIn(phoneNumber, pwd),
  };

  const signInButton = {
    prefix: 'Have an account?',
    label: 'Sign In',
    onclick: () => dispatch('openSignIn', {}),
  };
</script>

<LoginForm
  title="Sign Up"
  actionButton={singUpButton}
  linkButton={signInButton}
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
  <input
    class="sobaka-input mt-5"
    type="password"
    placeholder="Confirm Password"
    required
  />
  <!-- <img src="images/show-password.svg" alt="show"/> -->
</LoginForm>

<style global lang="postcss">
  .sobaka-input {
    @apply w-3/4 text-sm text-black placeholder-gray-500 border border-gray-200 py-4 pl-5;
  }
</style>
