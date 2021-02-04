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
  class="sobaka-input code w-1/5"
  data-automation-id="country-code--input"
  required
  bind:value={countryCode}
/>
<input
  class="sobaka-input tel w-4/5"
  type="text"
  data-automation-id="phone-input"
  placeholder="XXXX-XXX-XXX"
  required
  bind:value
  on:input={handleInput}
/>
