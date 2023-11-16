<script lang="ts">
    import type { INft } from "$lib/contract/icontract";
    import {
        fromWei,
        generateNftBackground,
        truncateAddress,
    } from "$lib/utils";
    import Button from "./Button.svelte";
    import MaterialSymbolsSell from "~icons/material-symbols/sell";
    import EthInput from "./EthInput.svelte";
    import contract from "$lib/contract";
    import notifications from "$lib/notifications";
    import { writable } from "svelte/store";
    import { arrow, createFloatingActions } from "svelte-floating-ui";
    import { offset } from "svelte-floating-ui/core";
    import storage from "$lib/storage";

    export let nft: INft;

    let backgroundContainer: HTMLDivElement | undefined;
    $: if (backgroundContainer !== undefined)
        generateNftBackground(nft, backgroundContainer);

    let nftDialog: HTMLDialogElement | undefined;
    function onClick() {
        if (nftDialog === undefined) return;

        if (!nftDialog.open) nftDialog.showModal();
        else nftDialog.close();
    }

    let showPriceTooltip = false;
    const arrowRef = writable<HTMLDivElement>();
    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "top",
        middleware: [arrow({ element: arrowRef }), offset(6)],
    });

    let price: bigint;
    async function onSell(event: SubmitEvent) {
        event.preventDefault();
        if (nftDialog === undefined) return;

        try {
            const txHash = await contract.placeNftOnSell(nft.id, price);
            notifications.add("info", "Transaction sent", `Tx hash: ${txHash}`);
        } finally {
            price = 0n;
            nftDialog.close();
        }
    }

    async function onBuy() {
        if (nftDialog === undefined || nft.saleData.price === undefined) return;

        try {
            const txHash = await contract.buyNft(nft.id, nft.saleData.price);
            notifications.add("info", "Transaction sent", `Tx hash: ${txHash}`);
        } finally {
            nftDialog.close();
        }
    }
</script>

<dialog
    class="flex-col gap-1 rounded bg-background-secondary p-3 shadow-xl open:flex"
    bind:this={nftDialog}
>
    <h2 class="text-center text-3xl">{nft.name}</h2>
    <span>Id: {nft.id}</span>
    <span>Owner: {nft.owner}</span>
    {#if nft.collectionId !== undefined}
        <span>From collection: {nft.collectionId}</span>
    {/if}
    {#if nft.saleData.isOnSale}
        <span>Price: {fromWei(nft.saleData.price)}</span>
        {#if nft.owner !== $storage.selectedAddress}
            <Button
                class="flex items-center justify-center gap-1"
                on:click={onBuy}><MaterialSymbolsSell />Buy</Button
            >
        {/if}
    {:else}
        <form class="flex items-center gap-1" on:submit={onSell}>
            <EthInput placeholder="Price" bind:amount={price} />
            <Button class="flex items-center gap-1" type="submit"
                ><MaterialSymbolsSell />Sell</Button
            >
        </form>
    {/if}
</dialog>

{#if showPriceTooltip}
    <div class="absolute rounded border bg-slate-300 p-1" use:floatingContent>
        <span>{fromWei(nft.saleData.price)}</span>
    </div>
{/if}
<button
    class="flex min-w-[146px] flex-col gap-1 rounded bg-slate-300 p-2"
    on:click={onClick}
>
    <div
        class="h-auto w-full self-center rounded"
        bind:this={backgroundContainer}
    ></div>
    <div class="flex flex-col items-start overflow-hidden leading-tight">
        <div class="flex w-full justify-between">
            <span class="text-xs">{nft.id}</span>
            {#if nft.saleData.isOnSale}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    on:mouseenter={() => (showPriceTooltip = true)}
                    on:mouseleave={() => (showPriceTooltip = false)}
                    use:floatingRef
                >
                    <MaterialSymbolsSell />
                </div>
            {/if}
        </div>
        <span class="overflow-hidden text-ellipsis whitespace-nowrap"
            >{nft.name}</span
        >
        <span class="text-xs font-light">{truncateAddress(nft.owner)}</span>
    </div></button
>
