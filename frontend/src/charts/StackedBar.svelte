<script>
    import { onMount } from "svelte";


    export let title;
    export let current;
    export let previous;
    export let limit;

    let currentP = 0;
    let previousP = 0;
    let limitP = 0;
    let element;

    const barSize = 2000;

    const detailed = () => {
        if (!element) return;
        element.classList.toggle('detailed')
    }

    // const showDetailed = () => {
    //     if (!element || element && element.classList.contains('detailed')) return;
    //     element.classList.add('detailed')
    // }

    // const hideDetailed = () => {
    //     if (!element || element && !element.classList.contains('detailed')) return;
    //     element.classList.remove('detailed')
    // }

    const percentage = (i) => i * 100 / barSize;

    const handlePress = (e) => {
        const step = 50;
        if (e.key === 'ArrowUp' && limit + step <= barSize) {
            limit += step;
        } else if ( e.key === 'ArrowDown' && limit - step >= 0) {
            limit -= step;
        }
    }

    onMount( () => {
        setTimeout(() => {
            currentP = percentage(current);
            previousP = percentage(previous);
            limitP = percentage(limit);
        }, 20)
    })

    $: {
        limitP = percentage(limit);
    }
</script>
<div class='wrapper'>

    <div class="top">
        <section class='actions'>
            {#if limit <= 0}
            <button class='action action--addLimit' on:click={() => limit = 50}>
                <img src="/images/add.svg" alt="+">
            </button>
            {:else}
                <input type="text" bind:value={limit} on:keydown={handlePress} pattern="\d+" class='action action--setLimit'>
            {/if}
        </section>
    
        <section class='title'>
            <div class='title__name'>
                {title}
            </div>
        </section>
    </div>

    <div class="bottom">
        <section class='bar__container' class:detailed={false} bind:this={element} on:click={detailed}>
    
            <div class='bars'>
                <div class='bar bar--previous' data-value={`$${previous}`} style={`width: ${previousP}%`}></div>
                <div class='bar bar--current' style={`width: ${currentP}%`}>{`$${current}`}</div>
            </div>
    
            <div class='limits'>
                <div class='limit limit--red' data-value={`$${limit}`} class:hidden={limit <= 0} style={`left: ${limitP}%`}></div>
            </div>
    
        </section>

    </div>

</div>
<style>

    .wrapper {
        display: flex;
        flex-direction: row;
        padding: .75em 0;
        user-select: none;
    }

    .top, .bottom {
        display: flex;
        flex-shrink: 0;
    }

    .top {
        width: 30%;
    }

    .bottom {
        width: 70%
    }

    .actions {
        width: 45%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action--addLimit {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        height: 2em;
        padding-left: 1.5em;
        padding-right: 1.5em;
        border-radius: 8px;
        cursor: pointer;
    }

    .action:focus {
        outline: none;
    }

    .action:hover {
        background-color: #E7F4EC;
    }

    .action--setLimit {
        width: 4em;
        height: 2em;
        padding: none;
        border: none;
        background-color: #E7F4EC;
        text-align: center;
        border-radius: 8px;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    }

    .title {
        width: 55%;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        display: flex;
        flex-shrink: 0;
        align-items: center;
    }

    .title__name {
        /* text-transform: uppercase; */
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #333;
    }

    .bar__container {
        width: 100%;
        height: 2em;
        background-color: #E7F4EC;
        border-radius: 8px;
        margin-left: 1em;
    }

    .bars {
        display: flex;
        flex-direction: column;
        flex-shrink: 20;
    }

    .bar {
        height: 2em;
        min-width: 5em;
        border-radius: 8px;
        transition: margin .2s, width .5s ease;
    }

    .detailed > .bars > .bar--previous {
        margin-top: .5em;
        margin-left: -.5em;
    }

    .detailed > .bars > .bar--current {
        margin-top: -1.5em;
        margin-left: -1em;
    }

    .detailed > .limits > .limit--red {
        margin-left: -1em;
    }

    .detailed > .bars > .bar--previous::after {
        content: 'previous: ' attr(data-value);
        position: absolute;
        font-weight: bold;
        margin-top: -1em;
        font-family: 'Courier New', Courier, monospace;
    }

    .bar--previous {
        width: 50%;
        background-color: #A6D6D1;
    }

    .bar--current {
        width: 30%;
        background-color: #2F9E9E;
        margin-top: -2em;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        padding-right: 1em;
        box-sizing: border-box;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
        color: #A6D6D1;
        transition: margin .2s, width .7s;
    }

    .limits {
        margin-top: -2em;
        position: relative;
    }

    .limit--red {
        width: 2px;
        height: 2em;
        background-color: #EC0808;
        position: relative;
        left: calc(30% - 2px);
        border-radius: 2px;
        top: -2px;
        border: 1px solid #EC0808;
        border-top: 2px solid #EC0808;
        border-bottom: 2px  solid #EC0808;
        transition: margin .2s, left .4s;
    }

    .limit.hidden {
        display: none;
    }

    @media(max-width: 50em) {

        .wrapper {
            flex-direction: column;
            padding-right: 1em;
        }

        .top, .bottom {
            width: 100%;
        }

        .top {
            padding-top: 1em;
            padding-bottom: .5em;
            justify-content: space-between;
        }

        .top > .title {
            order: 1;
            padding-left: 1em;
        }
        .top > .actions {
            order: 2;
            justify-content: flex-end;
        }
    }

</style>