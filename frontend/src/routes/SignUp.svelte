<script lang="ts">
  import { signIn } from '../endpointApi';
  import LoginForm from '../components/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import { validatePassword } from '../utils';

  let phoneNumber: string;
  let pwd: string;
  let token: string;
  let isValidPwd: boolean;

  const dispatch = createEventDispatcher();
  const singUpButton = {
    label: 'Sign Up',
    onclick: async () => {
      if (!isValidPwd) {
        alert('Invlid password');
        return;
      }
      await signIn(phoneNumber, pwd);
    },
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
  <PasswordInput
    placeholder="Password"
    bind:value={pwd}
    bind:isValid={isValidPwd}
    validator={validatePassword}
  />
  <PasswordInput placeholder="Confirm Password" />

  <input
    class="sobaka-input mt-5"
    type="text"
    placeholder="Monobank token"
    required
    bind:value={token}
  />
  <!-- <img src="images/show-password.svg" alt="show"/> -->
</LoginForm>
