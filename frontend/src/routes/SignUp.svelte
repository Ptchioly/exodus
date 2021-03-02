<script lang="ts">
  import { signUp } from '../endpointApi';
  import LoginForm from '../components/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';
  import PasswordInput from '../components/inputs/PasswordInput.svelte';
  import PhoneNumberInput from '../components/inputs/PhoneNumberInput.svelte';
  import { isSuccessResponse } from '../types/guards';
  import TokenInput from '../components/inputs/TokenInput.svelte';
  import { _ } from 'svelte-i18n';

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
    return dispatch('error', { message: $_('sign_up.error_msg_pwd_mismatch') });
  };

  const singUpButton = {
    dataAut: 'signup-button',
    label: $_('sign_up.btn'),
    onclick: dispatchResponse,
  };

  const signInButton = {
    label: $_('sign_up.link'),
    prefix: $_('sign_up.msg'),
    dataAut: 'link-signin-button',
    onclick: () => dispatch('openSignIn', {}),
  };
</script>

<LoginForm
  title={$_('sign_up.title')}
  actionButton={singUpButton}
  linkButton={signInButton}
>
  <div class="flex justify-center flex-col">
    <div class="phone flex items-center justify-center w-3/4 self-center">
      <PhoneNumberInput {countryCode} bind:value={phoneNumber} />
    </div>

    <div class="flex justify-center w-3/4 self-center relative">
      <PasswordInput placeholder={$_('sign_up.pwd')} bind:value={pwd} />
    </div>
    <div class="flex justify-center w-3/4 self-center relative">
      <PasswordInput
        placeholder={$_('sign_up.conf_pwd')}
        bind:value={confirmPwd}
        dataAut="confirm-pwd-input"
      />
    </div>

    <div class="flex items-center w-full justify-center">
      <TokenInput bind:token placeholder={$_('sign_up.bank_token')} />
    </div>
  </div>
</LoginForm>

<style lang="postcss">
  .password-input {
    @apply flex items-center justify-center w-full relative;
  }
</style>
