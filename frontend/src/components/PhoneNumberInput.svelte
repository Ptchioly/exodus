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
  required
  bind:value={countryCode}
/>
<input
  class="sobaka-input tel w-4/5"
  type="text"
  placeholder="XXXX-XXX-XXX"
  required
  bind:value
  on:input={handleInput}
/>
