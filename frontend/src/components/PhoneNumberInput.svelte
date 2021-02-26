<script lang="ts">
  import type { Validator } from '../types/Layout';

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
  class="login-input code w-1/5"
  data-automation-id="country-code--input"
  readonly
  required
  bind:value={countryCode}
/>
<input
  class="login-input tel w-4/5"
  type="text"
  data-automation-id="phone-input"
  placeholder="XX-XXX-XXXX"
  required
  bind:value
  on:input={handleInput}
/>

<style lang="postcss">
  .login-input {
    @apply w-3/4 text-lg text-gray-700 placeholder-gray-500 border-gray-200 rounded-lg border-2 py-1 px-0 pl-2 mt-8;
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

  .login-input.code {
    background-color: rgba(218, 218, 218, 0.686);
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }

  input:-webkit-autofill::first-line {
    font-size: 1.125rem;
    line-height: 1.75rem;
    --tw-text-opacity: 1;
    color: rgba(64, 64, 64, var(--tw-text-opacity));
  }
</style>
