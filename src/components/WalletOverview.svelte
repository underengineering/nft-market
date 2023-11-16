<script lang="ts">
    import MaterialSymbolsContentCopy from "~icons/material-symbols/content-copy";
    import type { IAccountInfo } from "$lib/web3";
    import { web3 } from "$lib/web3";
    import { truncateAddress, truncateStringFloat } from "$lib/utils";
    import { writable } from "svelte/store";
    import { arrow, createFloatingActions } from "svelte-floating-ui";
    import { offset } from "svelte-floating-ui/core";

    export let account: IAccountInfo;

    const arrowRef = writable<HTMLDivElement>();
    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "top",
        middleware: [arrow({ element: arrowRef }), offset(6)],
    });

    let showCopyTooltip = false;
</script>

{#if showCopyTooltip}
    <div class="absolute rounded border bg-slate-300 p-1" use:floatingContent>
        <span>Copied</span>
    </div>
{/if}

<div class="flex flex-col items-center gap-2">
    <button
        class="flex items-center gap-2 rounded-full bg-primary-200 px-2 py-1 text-primary-700"
        use:floatingRef
        on:click={() => {
            showCopyTooltip = true;
            navigator.clipboard.writeText(account.address);
            setTimeout(() => (showCopyTooltip = false), 1000);
        }}
    >
        {truncateAddress(account.address)}
        <MaterialSymbolsContentCopy />
    </button>
    <span class="text-3xl"
        >{truncateStringFloat(web3.utils.fromWei(account.balance, "ether"))} ETH</span
    >
</div>
