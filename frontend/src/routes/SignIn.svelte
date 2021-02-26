<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import LoginForm from '../components/LoginForm.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import PhoneNumberInput from '../components/PhoneNumberInput.svelte';
  import { signIn } from '../endpointApi';
  import { isSuccessResponse } from '../types/guards';

  export let error: boolean = false;
  let errorMessage: string;
  let phoneNumber: string;
  let countryCode: string = '380';
  let pwd: string;

  const dispatch = createEventDispatcher();

  const signInButton = {
    label: 'Sign In',
    onclick: async () => {
      const reponse = await signIn(summaryPhone, pwd);
      if (!isSuccessResponse(reponse)) {
        errorMessage = reponse.message;
        error = true;
      }
      dispatch('login', reponse);
    },
    dataAut: 'signin-button',
  };
  const signUpButton = {
    prefix: 'New to Exodus?',
    label: 'Join Now',
    onclick: () => dispatch('openSignUp', {}),
    dataAut: 'link-signup-button',
  };

  $: summaryPhone = countryCode + phoneNumber;
</script>

{#if error}
  <ErrorMessage bind:visible={error} bind:errorMessage />
{/if}

<LoginForm
  title="Sign in to Exodus"
  linkButton={signUpButton}
  actionButton={signInButton}
>
  <div class="flex flex-col justify-center w-full">
    <div class="flex justify-center w-3/4 self-center">
      <PhoneNumberInput bind:countryCode bind:value={phoneNumber} />
    </div>
    <div class="flex justify-center w-3/4 self-center relative">
      <PasswordInput bind:value={pwd} placeholder={'Password'} />
    </div>
  </div>
</LoginForm>

<style global lang="postcss">
  .login-input {
    @apply text-lg text-gray-700 placeholder-gray-500 border-gray-200 rounded-lg border-2 py-1 pl-3 mt-8;
  }
  .login-input.tel:focus {
    @apply border-gray-400 border-2;
  }

  .login-input.code {
    @apply w-1/5 mr-2 text-center pl-0;
  }

  .login-input.tel {
    @apply w-4/5;
  }

  /* for autocomplete */
  input:-webkit-autofill::first-line {
    font-size: 1.125rem;
    line-height: 1.75rem;
    --tw-text-opacity: 1;
    color: rgba(64, 64, 64, var(--tw-text-opacity));
  }
</style>
