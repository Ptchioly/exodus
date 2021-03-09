<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { signIn } from '../endpointApi';

  import LoginForm from '../components/authorization/LoginForm.svelte';
  import PasswordInput from '../components/inputs/PasswordInput.svelte';
  import PhoneNumberInput from '../components/inputs/PhoneNumberInput.svelte';
  import { isSuccessResponse } from '../types/guards';
  import BarSignin from '../components/header/BarSignin.svelte';

  import FAQ from '../components/FAQ.svelte';

  let showFAQ: boolean;
  let phoneNumber: string;
  let countryCode: string = '380';
  let pwd: string;

  const dispatch = createEventDispatcher();

  const dispatchResponse = async () => {
    const response = await signIn(summaryPhone, pwd);
    isSuccessResponse(response)
      ? dispatch('login', response.data)
      : dispatch('error', { message: response.message });
  };

  const signInButton = {
    label: $_('sign_in.btn'),
    onclick: dispatchResponse,
    dataAut: 'signin-button',
  };
  const signUpButton = {
    label: $_('sign_in.link'),
    prefix: $_('sign_in.msg'),
    dataAut: 'link-signup-button',
    onclick: () => dispatch('stateChange', { state: 'signUp' }),
  };

  $: summaryPhone = countryCode + phoneNumber;
</script>

{#if showFAQ}
  <FAQ on:closeFAQ={() => (showFAQ = false)} />
{/if}
<div class='self-center mt-20'>
  <LoginForm
    title={$_('sign_in.title')}
    linkButton={signUpButton}
    actionButton={signInButton}
  >
    <div class="flex flex-col justify-center w-full">
      <div class="flex justify-center w-3/4 self-center">
        <PhoneNumberInput bind:countryCode bind:value={phoneNumber} />
      </div>
      <div class="flex justify-center w-3/4 self-center relative">
        <PasswordInput bind:value={pwd} placeholder={$_('sign_in.pwd')} />
      </div>
    </div>
  </LoginForm>
  <BarSignin on:openFAQ={() => (showFAQ = true)}/>
</div>
