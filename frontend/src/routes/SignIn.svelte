<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { signIn } from '../endpointApi';
  import statics from './statics';

  import LoginForm from '../components/LoginForm.svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import PhoneNumberInput from '../components/PhoneNumberInput.svelte';
  import { isSuccessResponse } from '../types/guards';

  let phoneNumber: string;
  let countryCode: string = '380';
  let pwd: string;

  const {
    signIn: { label, link },
  } = statics;

  const dispatch = createEventDispatcher();

  const dispatchResponse = async () => {
    const response = await signIn(summaryPhone, pwd);
    isSuccessResponse(response)
      ? dispatch('login', response.data)
      : dispatch('error', { message: response.message });
  };

  const signInButton = {
    label,
    onclick: dispatchResponse,
    dataAut: 'signin-button',
  };
  const signUpButton = {
    ...link,
    onclick: () => dispatch('openSignUp', {}),
    dataAut: 'link-signup-button',
  };

  $: summaryPhone = countryCode + phoneNumber;
</script>

<LoginForm
  title="Sign in to Exodus"
  linkButton={signUpButton}
  actionButton={signInButton}
>
  <div class="flex flex-col justify-center w-full">
    <div class="phone flex justify-center w-3/4 self-center">
      <PhoneNumberInput bind:countryCode bind:value={phoneNumber} />
    </div>
    <div class="flex items-center justify-center w-full self-center">
      <PasswordInput bind:value={pwd} placeholder={'Password'} />
    </div>
  </div>
</LoginForm>
