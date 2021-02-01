<script lang="ts">
  import { signIn } from '../endpointApi';
  import { Link } from 'svelte-routing';
  import LoginForm from '../components/LoginForm.svelte';

  let phoneNumber;
  let pwd;

  const singUpButton = {
    label: 'Sign Up',
    onclick: () => signIn(phoneNumber, pwd),
  };

  const signInButton = {
    prefix: 'Have an account?',
    label: 'Sign In',
    href: '/signIn',
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
    bind:value={pwd}
  />
  <!-- <img src="images/show-password.svg" alt="show"/> -->
</LoginForm>

<style global lang="postcss">
</style>
