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
<style>

  .login-input.code {
    background-color: rgba(218, 218, 218, 0.686);
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
}
</style>