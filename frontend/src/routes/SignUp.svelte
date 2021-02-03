<script lang="ts">
  import { signUp } from '../endpointApi';
  import LoginForm from '../components/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import { validatePassword } from '../utils';

  let phoneNumber: string;
  let pwd: string;
  let token: string;
  let confirmPwd: string;
  let pwdCheck: boolean;
  let isValidPwd: boolean;

  const dispatch = createEventDispatcher();

  const checkPwd = (pwd, confirmPwd) => {
    return pwd === confirmPwd;
  };

  const singUpButton = {
    label: 'Sign Up',
    onclick: () => {
      pwdCheck = checkPwd(pwd, confirmPwd);
      pwdCheck
        ? signUp(phoneNumber, pwd, token)
        : alert('Passwords do not match');
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
  <div class="flex items-center justify-center w-full relative">
    <PasswordInput
      placeholder="Password"
      bind:value={pwd}
      validator={validatePassword}
      bind:isValid={isValidPwd}
    />
  </div>
  <div class="flex items-center justify-center w-full relative">
    <PasswordInput
      placeholder="Confirm Password"
      validator={validatePassword}
      bind:isValid={isValidPwd}
      bind:value={confirmPwd}
    />
  </div>

  <input
    class="sobaka-input mt-5"
    type="text"
    placeholder="Monobank token"
    required
    bind:value={token}
  />
</LoginForm>
