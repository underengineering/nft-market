<script lang="ts">
    import MaterialSymbolsAccountBalance from "~icons/material-symbols/account-balance";
    import contract from "$lib/contract";
    import type { IAuction, ICollection, INft } from "$lib/contract/icontract";
    import { fromWei, generateNftBackground } from "$lib/utils";
    import EvenGrid from "./EvenGrid.svelte";
    import NftCard from "./NftCard.svelte";
    import storage from "$lib/storage";
    import Button from "./Button.svelte";
    import EthInput from "./EthInput.svelte";
    import notifications from "$lib/notifications";

    export let collection: ICollection;
    export let nfts: INft[];

    let auction: Promise<IAuction | undefined>;
    $: auction = contract.getAuction(collection.id);

    let backgroundContainers: (HTMLDivElement | undefined)[] = [];
    $: {
        for (let idx = 0; idx < nfts.length; idx++) {
            const backgroundContainer = backgroundContainers[idx];
            if (backgroundContainer === undefined) continue;

            const nft = nfts[idx];
            generateNftBackground(nft, backgroundContainer);
        }
    }

    let collectionDialog: HTMLDialogElement | undefined;
    function onClick() {
        if (collectionDialog === undefined) return;

        if (!collectionDialog.open) collectionDialog.showModal();
        else collectionDialog.close();
    }

    let startPrice = 0n;
    let maxPrice = 0n;
    async function onStartAuction(event: SubmitEvent) {
        event.preventDefault();
        if (collectionDialog === undefined) return;

        try {
            const txHash = await contract.startAuction(
                collection.id,
                startPrice,
                maxPrice
            );
            notifications.add(
                "success",
                "Started auction successfully",
                `Tx hash: ${txHash}`
            );
        } finally {
            collectionDialog.close();
        }
    }

    let bidPrice = 0n;
    async function onJoinAuction(event: SubmitEvent) {
        event.preventDefault();
        if (collectionDialog === undefined) return;

        try {
            const txHash = await contract.joinAuction(collection.id, bidPrice);
            notifications.add(
                "success",
                "Joined auction successfully",
                `Tx hash: ${txHash}`
            );
        } finally {
            collectionDialog.close();
        }
    }

    async function onFinishAuction() {
        if (collectionDialog === undefined) return;

        try {
            const txHash = await contract.finishAuction(collection.id);
            notifications.add(
                "success",
                "Auction finished successfully",
                `Tx hash: ${txHash}`
            );
        } finally {
            collectionDialog.close();
        }
    }
</script>

<dialog
    class="w-full max-w-4xl flex-col rounded bg-background-secondary p-3 shadow-xl open:flex"
    bind:this={collectionDialog}
>
    <h2 class="text-center text-3xl">{collection.name}</h2>
    <span>Open: {collection.isOpen ? "yes" : "no"}</span>
    {#if !collection.isOpen}
        {@const owner = nfts[0]?.owner}
        <span>Owner: {owner}</span>
        {#await auction then auction}
            {#if auction === undefined && owner === $storage.selectedAddress}
                <form class="flex flex-col gap-1" on:submit={onStartAuction}>
                    <EthInput
                        placeholder="Start price"
                        bind:amount={startPrice}
                    />
                    <EthInput placeholder="Max price" bind:amount={maxPrice} />
                    <Button class="flex items-center justify-center gap-1"
                        ><MaterialSymbolsAccountBalance />Start auction</Button
                    >
                </form>
            {:else if auction !== undefined && owner !== $storage.selectedAddress}
                <span>Start bid price: {fromWei(auction.startPrice)}</span>
                <span>Max bid price: {fromWei(auction.maxPrice)}</span>
                <form class="flex flex-col gap-1" on:submit={onJoinAuction}>
                    <EthInput placeholder="Bid price" bind:amount={bidPrice} />
                    <Button class="flex items-center justify-center gap-1"
                        >Join auction</Button
                    >
                </form>
            {:else if auction !== undefined && owner === $storage.selectedAddress}
                <Button
                    class="flex items-center justify-center gap-1"
                    on:click={onFinishAuction}>Finish auction</Button
                >
            {/if}
        {/await}
    {/if}
    <span>NFTs in this collection:</span>
    <EvenGrid columnSize="146px">
        {#each nfts as nft}
            <NftCard {nft} />
        {/each}
    </EvenGrid>
</dialog>
<div class="flex max-w-[146px] flex-col gap-1 rounded bg-slate-300 p-2">
    <button class="nft-card-container relative h-32 w-32" on:click={onClick}>
        {#each nfts.slice(0, 3) as nft, idx}
            <div
                class="nft-card absolute left-0 top-0 h-32 w-32 self-center rounded transition-transform"
                style="--card-off: {(idx - 1) * 6}px; --card-rotation: {(idx -
                    1) *
                    2}deg"
                bind:this={backgroundContainers[idx]}
            ></div>
        {/each}
    </button>
    <div class="flex flex-col leading-tight">
        <div class="flex w-full justify-between">
            <span class="text-xs">{collection.id}</span>
            {#await auction then auction}
                {#if auction}
                    <MaterialSymbolsAccountBalance />
                {/if}
            {/await}
        </div>
        <span class="overflow-hidden text-ellipsis whitespace-nowrap"
            >{collection.name}</span
        >
    </div>
</div>

<style>
    .nft-card {
        --card-rotation1: calc(var(--card-rotation));
        --card-offset: 0px;
    }

    .nft-card-container:hover > .nft-card {
        --card-rotation1: calc(var(--card-rotation) * 3);
        --card-offset: var(--card-off);
    }

    .nft-card {
        transform: translate(-64px, 64px) rotate(var(--card-rotation1))
            translate(
                calc(64px + var(--card-offset)),
                calc(-64px - var(--card-offset) / 2)
            );
    }
</style>
