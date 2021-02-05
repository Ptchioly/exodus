<script lang="ts">
  import { signUp } from '../endpointApi';
  import LoginForm from '../components/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import MonoLogo from '../components/MonoLogo.svelte';

  let phoneNumber: string;
  let pwd: string;
  let token: string;
  let confirmPwd: string;
  let pwdCheck: boolean;

  const dispatch = createEventDispatcher();

  const checkPwd = (pwd, confirmPwd) => {
    return pwd === confirmPwd;
  };

  const singUpButton = {
    label: 'Sign Up',
    onclick: async () => {
      pwdCheck = checkPwd(pwd, confirmPwd);
      if (pwdCheck) {
        const resp = await signUp(phoneNumber, pwd, token);

        return dispatch('signUp', resp);
      }
      alert('Passwords do not match');
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
  <div class="flex justify-center flex-col">
    <div class="items-center">
      <input
        class="sobaka-input"
        type="text"
        placeholder="Phone number"
        required
        bind:value={phoneNumber}
      />
    </div>

    <div class="flex items-center justify-center w-full relative">
      <PasswordInput placeholder="Password" bind:value={pwd} />
    </div>
    <div class="flex items-center justify-center w-full relative">
      <PasswordInput placeholder="Confirm Password" bind:value={confirmPwd} />
    </div>

    <div class="flex items-center w-full justify-center">
      <div class="w-3/4 flex mt-5 h-10">
        <input
          class="text-lg w-full text-gray-700 placeholder-gray-500 border-gray-200 rounded-lg border-2 px-2"
          type="text"
          placeholder="Monobank token"
          required
          bind:value={token}
        />
        <div class="items-center"><MonoLogo /></div>
      </div>
    </div>
  </div>
</LoginForm>
