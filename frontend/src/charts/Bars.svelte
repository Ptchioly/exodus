<script lang="ts">
    import type { StackedBars, Bar, Limit } from "../types/charts";
    import { createEventDispatcher } from "svelte";

    export let bars: StackedBars;

    let limits: HTMLElement;
    let wrapper: HTMLElement;
    let currentBar: HTMLElement;

    const dispatch = createEventDispatcher();

    const percentOf = (v: number): number => (v * 100) / bars.maxValue;
    let isDetailed = false;

    const isSmallEnough = (rect: HTMLElement, value: number, small = 60): boolean => {
        if (rect) {
            const barRect = rect.getBoundingClientRect();
            return (percentOf(value) * barRect.width) / 100 < small;
        }
    };

    const styledOverlap = (c: string, b: string, style: string) => {
        if (style == "stripes")
            return `background: repeating-linear-gradient(45deg, ${c}, ${c} 10px, ${b} 10px, ${b} 20px);`;
        return `background: ${c}`;
    };

    const styledZIndex = (isOverlap: boolean, index: number) =>
        isOverlap ? `z-index: ${100 - index}` : "";

    const styledBarWidth = (bar: Bar, limit: Limit) =>
        limit.value > bar.value
            ? percentOf(limit.value - bar.value)
            : limit.value < bar.value
            ? percentOf(bar.value - limit.value)
            : 0;

    const styledBarLeft = (bar: Bar, limit: Limit) =>
        limit.value > bar.value ? percentOf(bar.value) : percentOf(limit.value);

    const move = (limit: Limit) => (e) => {
        const node = e.target;
        node.classList.add("moveable");
        wrapper.classList.add("moveable");
        e.stopPropagation();

        const handleMove = (e) => {
            const limitsRect = limits.getBoundingClientRect();
            const movePercent = Math.round(
                ((e.clientX - limitsRect.left) * 100) / limitsRect.width
            );
            if (movePercent >= 0 && movePercent <= 100) {
                limit.value = Math.round((movePercent * bars.maxValue) / 100);
                dispatch("bindLimitValue", { limit });
                bars = bars;
            }
        };

        const handleEnd = (e) => {
            node.classList.remove("moveable");
            wrapper.classList.remove("moveable");
            window.removeEventListener("mousemove", handleMove);
            dispatch("updateLimit", { limit });
        };

        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("mousemove", handleMove);
    };
</script>

<div
    class="wrapper"
    bind:this={wrapper}
    class:moveable={false}
    on:mousedown={() => (isDetailed = !isDetailed)}
    style='height: {isDetailed ? (bars.bars.length * 4) * (bars.conf.detailedSpace / 100) : 4}em'
>
    <section class="bar-placeholder">
        <div
            class="bar--placeholder"
            style="background: {bars.conf.background}; height: {isDetailed ? (bars.bars.length * 2) * (bars.conf.detailedSpace / 100) + 2 : 2}em"
        />
    </section>

    <section class="bars">
        {#each bars.bars as bar, i}
            <div
                class="bar--wrapper"
                class:detailed={isDetailed}
                style="top: {isDetailed ? i * bars.conf.detailedSpace : 0}%; z-index: {i*1};"
                data-index={i + 1}
                class:upperLayer={i === bars.bars.length - 1}
            >
                <div class="bar" style="width: {percentOf(bar.value)}%">
                    <div
                        class="bar--value"
                        bind:this={currentBar}
                        class:hiddenValue={isSmallEnough(limits, bar.value)}
                        style="background: {bar.background}"
                        data-label={bar.labelPosition}
                    >
                        <span class="label"
                            >{bar.label
                                ? bar.label.replace("${value}", `${bar.value}`)
                                : ""}</span
                        >
                        <span class="label--detailed"
                            >{bar.detailedLabel
                                ? bar.detailedLabel.replace(
                                      "${value}",
                                      `${bar.value}`
                                  )
                                : ""}</span
                        >
                    </div>
                </div>
                <div class="limits" bind:this={limits}>
                    {#each bars.limits as limit, limitIndex}
                        {#if bar.limits && bar.limits.indexOf(limit.name) > -1}
                            <div
                                class="limit"
                                class:hidden={limit.value <= 0}
                                data-overlap={limit.value < bar.value}
                                data-name={limit.name}
                                data-automation-id="limit-hover"
                                style="{styledZIndex(
                                    limit.value < bar.value,
                                    limitIndex
                                )}; left: {styledBarLeft(
                                    bar,
                                    limit
                                )}%; border-color: {limit.color}; width: {styledBarWidth(
                                    bar,
                                    limit
                                )}%"
                            >
                                <div
                                    class="limit-core"
                                    style={limit.value < bar.value
                                        ? styledOverlap(
                                              limit.color,
                                              bar.background,
                                              limit.overlapStyle
                                          )
                                        : ""}
                                >
                                    {#if limit.value > bar.value}
                                        <div
                                            class="remaining-wrap {limit.visible}"
                                            style="border-color: {bar.background};"
                                        >
                                            <div
                                                class="remaining"
                                                class:headless={isSmallEnough(limits, limit.value - bar.value, 40)}
                                                data-value="${limit.value - bar.value}"
                                                style="border-color: {bar.background};"
                                            />
                                        </div>
                                    {/if}
                                </div>
                                {#if limit.draggable}
                                    <div
                                        class="limit-handle draggable"
                                        data-automation-id="limit-setter"
                                        style="background: {limit.color};"
                                        data-value={+limit.value}
                                        on:mousedown={move(limit)}
                                    />
                                {:else}
                                    <div
                                        class="limit-handle"
                                        style="background: {limit.color};"
                                        data-value={+limit.value}
                                    />
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
    </section>
</div>

<style>
    .wrapper {
        position: relative;
        width: 100%;
        user-select: none;
        transition: height .3s;
    }

    .bar-placeholder {
        position: relative;
        top: 0;
        max-width: 100%;
        height: 2em;
        padding: 1em 0;
    }

    .bar--placeholder {
        height: 2em;
        border-radius: 0.5em;
        background-color: #edf8f4;
        transition: height .3s;
    }

    .bars {
        position: absolute;
        top: 0;
        height: 4em;
        width: 100%;
        display: flex;
        box-sizing: border-box;
    }

    .bar--wrapper {
        position: absolute;
        height: 100%;
        width: 100%;
        transition: top 0.3s;
    }

    .bar {
        height: 100%;
        position: absolute;
        top: 0;
    }

    .bar--value {
        width: 100%;
        height: 2em;
        margin: 1em 0;
        border-radius: 0.5em;
        transition: width .3s;
    }

    .limits {
        height: 100%;
        width: 100%;
        visibility: hidden;
    }

    .bar--wrapper.upperLayer > .limits,
    .bar--wrapper.detailed > .limits {
        visibility: visible;
    }

    .bar--wrapper:not(.upperLayer) > .bar > .bar--value > .label {
        visibility: hidden;
    }

    .bar--wrapper > .limits > .limit[data-overlap="false"] {
        box-sizing: content-box;
    }

    .limit {
        position: absolute;
        top: 0.75em;
        width: 0;
        border-right: 3px solid transparent;
        height: calc(100% - 1.5em);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        transition: width 0.3s; /** left: .3s **/
    }

    .wrapper.moveable .limit {
        transition: all 0s;
    }

    .limit[data-overlap="true"] {
        border-right: none;
        border-left: 3px solid transparent;
    }

    .limit-core {
        width: 100%;
        height: 2em;
    }

    .limit[data-overlap="true"] > .limit-core {
        border-radius: 0 0.5em 0.5em 0;
    }

    .limit.hidden {
        display: none;
    }

    .limit-handle {
        position: absolute;
        right: -0.55em;
        border-radius: 2px;
        width: 0;
        height: 100%;
        transition: all 0.1s;
        cursor: move;
    }

    .limit-handle.moveable::after {
        content: attr(data-value);
        font-family: monospace;
        font-size: .8em;
        font-weight: bold;
        top: -1.2em;
        position: absolute;
        z-index: 300;
        left: -0.1em;
    }
    .limit[data-overlap="true"] > .limit-handle {
        left: -0.6em;
    }

    .limits > .limit > .limit-handle[data-value="0"] {
        visibility: hidden;
    }

    .limits > .limit:hover > .limit-handle.draggable,
    .limit-handle.moveable {
        width: 1em;
    }

    .remaining-wrap {
        display: flex;
        height: 1em;
        margin: 0.5em 0.2em;
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;
        visibility: hidden;
        z-index: 100;
    }

    .remaining {
        height: 0px;
        width: 100%;
        border-top: 2px dashed transparent;
        margin-top: calc(0.5em - 1px);
        display: flex;
        justify-content: center;
    }

    .remaining:not(.headless)::after {
        content: attr(data-value);
        position: absolute;
        height: 2em;
        display: flex;
        align-items: center;
        font-weight: bold;
        top: -0.2em;
        font-family: monospace;
        font-size: 0.8em;
    }

    .limit[data-overlap="false"]:hover > .limit-core > .remaining-wrap.hover,
    .bar--wrapper.upperLayer .remaining-wrap.static,
    .bar--wrapper.detailed .remaining-wrap.static {
        visibility: visible;
    }

    .label,
    .label--detailed {
        /* height: 2em; */
        display: flex;
        padding: 0 0.5em;
        align-items: center;
        font-family: monospace;
        /* line-height: 2em; */
        font-weight: bold;
        z-index: 200;
    }

    .bar--value.hiddenValue > .label,
    .bar--value.hiddenValue > .label--detailed,
    .label--detailed,
    .bar--wrapper.detailed > .bar > .bar--value > .label {
        display: none;
    }

    .bar--wrapper.detailed
        > .bar
        > .bar--value:not(.hiddenValue)
        > .label--detailed {
        display: block;
    }

    .bar--value {
        display: flex;
        align-items: center;
    }

    .bar--wrapper:not(.detailed)
        > .bar
        > .bar--value.hiddenValue:hover
        > .label,
    .bar--wrapper.detailed
        > .bar
        > .bar--value.hiddenValue:hover
        > .label--detailed {
        white-space: nowrap;
        display: inline;
        background-color: inherit;
        border-radius: 0.5em 0.5em 0.5em 0;
        top: -1em;
        position: relative;
        /* opacity: .8; */
    }
    .bar--value[data-label*="out-bottom"] > .label,
    .bar--value[data-label*="out-bottom"] > .label--detailed {
        margin-top: 3.4em;
    }

    .bar--value[data-label*="out-top"] > .label,
    .bar--value[data-label*="out-top"] > .label--detailed {
        margin-top: -3.4em;
    }

    .bar--value[data-label$="-left"] {
        justify-content: flex-start;
    }

    .bar--value[data-label$="-right"] {
        justify-content: flex-end;
    }

    .bar--value[data-label$="-center"] {
        justify-content: center;
    }
</style>
