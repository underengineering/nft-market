<script lang="ts">
    import MaterialSymbolsSearchRounded from "~icons/material-symbols/search-rounded";
    import NftCard from "./NftCard.svelte";
    import Button from "./Button.svelte";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import contract from "$lib/contract";
    import notifications from "$lib/notifications";
    import EvenGrid from "./EvenGrid.svelte";

    export let isAdmin: boolean;

    let mintDialog: HTMLDialogElement | undefined;

    const nfts = contract.getNfts();

    let searchQuery = "";
    let filteredNfts = nfts;
    $: filteredNfts = nfts.then((nfts) =>
        nfts.filter((nft) => nft.name.includes(searchQuery))
    );

    function onOpenMintDialog() {
        if (mintDialog === undefined) return;

        if (!mintDialog.open) mintDialog.showModal();
        else mintDialog.close();
    }

    let nftName = "";
    async function onMint() {
        if (mintDialog === undefined) return;

        try {
            const txHash = await contract.mintCommonNft(nftName);
            notifications.add("info", "Transaction sent", `Tx hash: ${txHash}`);
        } finally {
            nftName = "";
            mintDialog.close();
        }
    }
</script>

<dialog
    class="flex-col gap-1 rounded bg-background-secondary p-3 shadow-xl open:flex"
    bind:this={mintDialog}
>
    <h2 class="text-center text-3xl">Mint new NFT</h2>
    <form class="flex flex-col gap-1">
        <div class="flex gap-2">
            <label for="nft-name">Name</label>
            <input
                id="nft-name"
                class="rounded"
                type="text"
                bind:value={nftName}
            />
        </div>
        <Button class="flex items-center justify-center gap-1" on:click={onMint}
            ><MaterialSymbolsAdd />Mint</Button
        >
    </form>
</dialog>

<div class="flex w-full flex-col items-center gap-2">
    <div class="flex w-full justify-center gap-2">
        <div class="flex items-center gap-2">
            <MaterialSymbolsSearchRounded /><input
                class="rounded"
                type="text"
                bind:value={searchQuery}
            />
        </div>
        {#if isAdmin}
            <Button class="flex items-center gap-1" on:click={onOpenMintDialog}
                ><MaterialSymbolsAdd />Mint new NFT</Button
            >
        {/if}
    </div>
    <EvenGrid columnSize="146px">
        {#await filteredNfts then nfts}
            {#each nfts as nft}
                <NftCard {nft} />
            {/each}
        {/await}
    </EvenGrid>
</div>