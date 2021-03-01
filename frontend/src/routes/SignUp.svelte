<script lang="ts">
  import { signUp } from '../endpointApi';
  import LoginForm from '../components/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';
  import PasswordInput from '../components/inputs/PasswordInput.svelte';
  import PhoneNumberInput from '../components/inputs/PhoneNumberInput.svelte';
  import { isSuccessResponse } from '../types/guards';
  import statics from './statics';
  import TokenInput from '../components/inputs/TokenInput.svelte';

  const { label, link } = statics.signUp;

  let phoneNumber: string;
  let pwd: string;
  let token: string;
  let confirmPwd: string;
  let pwdCheck: boolean;
  let countryCode: string = '380';

  const checkPwd = (pwd, confirmPwd) => {
    return pwd === confirmPwd;
  };

  const dispatch = createEventDispatcher();

  const dispatchResponse = async () => {
    pwdCheck = checkPwd(pwd, confirmPwd);
    if (pwdCheck) {
      const resp = await signUp(countryCode + phoneNumber, pwd, token);
      return isSuccessResponse(resp)
        ? dispatch('signUp', resp.data)
        : dispatch('error', { message: resp.message });
    }
    return dispatch('error', { message: 'Passwords do not match' });
  };

  const singUpButton = {
    dataAut: 'signup-button',
    label,
    onclick: dispatchResponse,
  };

  const signInButton = {
    ...link,
    dataAut: 'link-signin-button',
    onclick: () => dispatch('openSignIn', {}),
  };
</script>

<LoginForm
  title="Sign Up"
  actionButton={singUpButton}
  linkButton={signInButton}
>
  <div class="flex justify-center flex-col">
    <div class="phone flex items-center justify-center w-3/4 self-center">
      <PhoneNumberInput {countryCode} bind:value={phoneNumber} />
    </div>

    <div class="flex justify-center w-3/4 self-center relative">
      <PasswordInput placeholder="Password" bind:value={pwd} />
    </div>
    <div class="flex justify-center w-3/4 self-center relative">
      <PasswordInput
        placeholder="Confirm Password"
        bind:value={confirmPwd}
        dataAut="confirm-pwd-input"
      />
    </div>

    <div class="flex items-center w-full justify-center">
      <TokenInput bind:token />
    </div>
  </div>
</LoginForm>

<style lang="postcss">
  .password-input {
    @apply flex items-center justify-center w-full relative;
  }
</style>
