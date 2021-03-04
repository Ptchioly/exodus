<script lang="ts">
  import type { Validator } from '../../types/Layout';

  export let value: string;
  export let isValid: boolean = false;
  export let countryCode: string;
  export let validator: Validator | undefined;

  const handleInput = () => {
    isValid = validator ? validator(value) : true;
  };
</script>

<input
  type="text"
  class="login-input code w-1/5 dark:bg-dark dark:border-darker focus:dark:border-darker text-gray-700 dark:text-gray-300 border-gray-200"
  data-automation-id="country-code--input"
  readonly
  required
  bind:value={countryCode}
/>
<input
  class="login-input tel w-4/5 dark:bg-dark dark:border-darker focus:dark:border-darker text-gray-700 dark:text-gray-300 border-gray-200"
  type="text"
  data-automation-id="phone-input"
  placeholder="XX-XXX-XXXX"
  required
  bind:value
  on:input={handleInput}
/>

<style lang="postcss">
  .login-input {
    @apply w-3/4 text-lg placeholder-gray-500 rounded-lg border-2 py-1 px-0 pl-2 mt-8;
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

  input:-webkit-autofill::first-line {
    font-size: 1.125rem;
    line-height: 1.75rem;
    --tw-text-opacity: 1;
    color: rgba(64, 64, 64, var(--tw-text-opacity));
  }
</style>
