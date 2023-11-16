<script lang="ts">
    import { fromWei } from "$lib/utils";
    import { arrow, createFloatingActions } from "svelte-floating-ui";
    import { offset } from "svelte-floating-ui/core";
    import { writable } from "svelte/store";

    let value = "";
    let showTooltip = false;

    const arrowRef = writable<HTMLDivElement>();
    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "top",
        middleware: [arrow({ element: arrowRef }), offset(6)],
    });

    export let amount = 0n;
    let amountDisplay: string;
    $: {
        try {
            if (value.length > 0) {
                amount = BigInt(value);
                amountDisplay = fromWei(amount);
            } else {
                amount = 0n;
                amountDisplay = "0 wei";
            }
        } catch (err) {
            amount = 0n;
            amountDisplay = "invalid";
        }
    }
</script>

<div class="relative">
    {#if showTooltip}
        <div
            class="absolute rounded border bg-slate-300 p-1"
            use:floatingContent
        >
            <span>{amountDisplay}</span>
            <div id="arrow" class="bg-slate-300" bind:this={$arrowRef} />
        </div>
    {/if}
    <input
        id="input"
        class="rounded"
        type="text"
        placeholder="Price"
        use:floatingRef
        bind:value
        on:focus={() => (showTooltip = true)}
        on:blur={() => (showTooltip = false)}
    />
</div>

<style>
    #arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
    }
</style>
