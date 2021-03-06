<script lang="ts">
  import { signUp } from '../endpointApi';
  import LoginForm from '../components/authorization/LoginForm.svelte';
  import { createEventDispatcher } from 'svelte';
  import PasswordInput from '../components/inputs/PasswordInput.svelte';
  import PhoneNumberInput from '../components/inputs/PhoneNumberInput.svelte';
  import { isSuccessResponse } from '../types/guards';
  import TokenInput from '../components/inputs/TokenInput.svelte';
  import { _ } from 'svelte-i18n';
  import BarSignin from '../components/header/BarSignin.svelte';

  import FAQ from '../components/FAQ.svelte';
  let showFAQ: boolean;
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
        : dispatch('error', {
            message: $_(`api-error.${resp.error}`),
          });
    }
    return dispatch('error', { message: $_('sign_up.error_msg_pwd_mismatch') });
  };

  $: singUpButton = {
    dataAut: 'signup-button',
    label: $_('sign_up.btn'),
    onclick: dispatchResponse,
  };

  $: signInButton = {
    label: $_('sign_up.link'),
    prefix: $_('sign_up.msg'),
    dataAut: 'link-signin-button',
    onclick: () => dispatch('stateChange', { state: 'signIn' }),
  };
</script>

{#if showFAQ}
  <FAQ on:closeFAQ={() => (showFAQ = false)} />
{/if}
<div class="self-center pt-20">
  <LoginForm
    title={$_('sign_up.title')}
    actionButton={singUpButton}
    linkButton={signInButton}
  >
    <div class="flex justify-center flex-col">
      <div class="input-wrapper items-center">
        <PhoneNumberInput {countryCode} bind:value={phoneNumber} />
      </div>

      <div class="input-wrapper">
        <PasswordInput placeholder={$_('sign_up.pwd')} bind:value={pwd} />
      </div>
      <div class="input-wrapper">
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
  <BarSignin on:openFAQ={() => (showFAQ = true)} />
</div>

<style lang="postcss">
  .input-wrapper {
    @apply flex justify-center w-3/4 self-center relative;
  }
</style>
