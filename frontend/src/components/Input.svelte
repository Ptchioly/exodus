<script>
    export let value;
    export let type;
    export let placeholder;
    export let klass;
    export let dataAutomationId;
</script>

{#if type === 'password'}
    <input bind:value={value} type='password' placeholder={placeholder} class={klass} data-automation-id={dataAutomationId}/>
{:else}
    <input bind:value={value} type='text' placeholder={placeholder} class={klass} data-automation-id={dataAutomationId}/>
{/if}

