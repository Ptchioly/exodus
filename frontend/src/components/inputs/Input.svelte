<script>
  export let value;
  export let type;
  export let placeholder;
  export let className;
  export let dataAutomationId;
</script>

{#if type === 'password'}
  <input
    bind:value
    type="password"
    {placeholder}
    class={className}
    data-automation-id={dataAutomationId}
  />
{:else}
  <input
    bind:value
    type="text"
    {placeholder}
    class={className}
    data-automation-id={dataAutomationId}
  />
{/if}
