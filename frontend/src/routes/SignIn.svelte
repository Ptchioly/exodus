<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import LoginForm from '../components/LoginForm.svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import { signIn } from '../endpointApi';
  import { isSignedIn } from '../types/guards';
  import { validatePassword } from '../utils';

  let phoneNumber: string;
  let countryCode: string = '380';
  let pwd: string;

  let isValidPwd: boolean;

  const dispatch = createEventDispatcher();

  const signInButton = {
    label: 'Sign In',
    onclick: () =>
      signIn(summaryPhone, pwd).then((resp) => {
        dispatch('login', resp);
      }),
  };
  const signUpButton = {
    prefix: 'New to Exodus?',
    label: 'Join Now',
    onclick: () => dispatch('openSignUp', {}),
  };

  $: summaryPhone = countryCode + phoneNumber;
</script>

<!-- TODO: Make template more responsive.
     This should be done by implementing mobile design first
     Also I think that bg-color should fill the whole space on small screens
-->
<LoginForm
  title="Sign in to Exodus"
  linkButton={signUpButton}
  actionButton={signInButton}
>
  <div class="flex flex-col justify-center w-full">
    <div class="phone flex justify-center w-3/4 self-center">
      <input
        type="text"
        class="sobaka-input code w-1/5"
        required
        bind:value={countryCode}
      />

      <input
        class="sobaka-input tel w-4/5"
        type="text"
        placeholder="XXXX-XXX-XXX"
        required
        bind:value={phoneNumber}
      />
    </div>
    <div class="flex items-center justify-center w-full self-center">
      <PasswordInput
        bind:value={pwd}
        placeholder={'Password'}
        bind:isValid={isValidPwd}
        validator={validatePassword}
      />
    </div>
  </div>

  <!-- <img src="images/show-password.svg" alt="show"/> -->
  <!-- <p class="my-6 text-gray-700 font-medium text-lg">Forgot your password?</p> -->
</LoginForm>

<style global lang="postcss">
  .sobaka-input {
    @apply text-lg text-gray-700 placeholder-gray-500 border-gray-200 rounded-lg border-2 py-1 px-0 pl-2 mt-8;
  }
  .sobaka-input:focus {
    @apply border-gray-400 border-2;
  }

  .sobaka-input.code {
    @apply w-1/5 mr-2 text-center pl-0;
  }

  .sobaka-input.tel {
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
