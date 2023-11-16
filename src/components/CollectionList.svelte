<script lang="ts">
    import MaterialSymbolsSearchRounded from "~icons/material-symbols/search-rounded";
    import MaterialSymbolsRefresh from "~icons/material-symbols/refresh";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import Button from "./Button.svelte";
    import contract from "$lib/contract";
    import notifications from "$lib/notifications";
    import CollectionCard from "./CollectionCard.svelte";
    import EvenGrid from "./EvenGrid.svelte";

    export let isAdmin: boolean;

    let mintDialog: HTMLDialogElement | undefined;

    let collections = contract.getCollections();
    let nfts = contract.getNfts();

    let refreshing = false;
    $: Promise.all([collections, nfts]).finally(() => (refreshing = false));

    let searchQuery = "";
    let filteredCollections = collections;
    $: filteredCollections = collections.then((collections) =>
        collections.filter((collection) =>
            collection.name.includes(searchQuery)
        )
    );

    function onOpenMintDialog() {
        if (mintDialog === undefined) return;

        if (!mintDialog.open) mintDialog.showModal();
        else mintDialog.close();
    }

    let collectionName = "";
    let nftName = "";
    let nftNames: string[] = [];
    function onAddNft(event: SubmitEvent) {
        event.preventDefault();
        if (nftName.length === 0) return;

        nftNames.push(nftName);
        nftNames = nftNames;
        nftName = "";
    }

    async function onMint(event: SubmitEvent) {
        event.preventDefault();
        if (mintDialog === undefined) return;

        try {
            const txHash = await contract.mintCollection(
                collectionName,
                nftNames
            );
            notifications.add(
                "success",
                "Collection minted successfully",
                `Tx hash: ${txHash}`
            );
        } finally {
            collectionName = "";
            mintDialog.close();
        }
    }
</script>

<dialog
    class="flex-col gap-1 rounded bg-background-secondary p-3 shadow-xl open:flex"
    bind:this={mintDialog}
>
    <h2 class="text-center text-3xl">Mint new collection</h2>
    <form class="flex flex-col gap-1" on:submit={onMint}>
        <div class="flex gap-2">
            <label for="nft-name">Name</label>
            <input
                id="nft-name"
                class="rounded"
                type="text"
                placeholder="Collection name"
                bind:value={collectionName}
            />
        </div>
        <div class="flex flex-col">
            <label for="nft-list">NFTs:</label>
            <ul id="nft-list" class="flex flex-col">
                {#each nftNames as nftName}
                    <li>{nftName}</li>
                {/each}
                <form class="flex gap-1" on:submit={onAddNft}>
                    <input
                        class="rounded"
                        type="text"
                        placeholder="NFT name"
                        bind:value={nftName}
                    />
                    <Button class="flex items-center gap-1" type="submit"
                        ><MaterialSymbolsAdd />Add</Button
                    >
                </form>
            </ul>
        </div>
        <Button
            class="flex items-center justify-center gap-1"
            type="submit"
            disabled={nftNames.length === 0}><MaterialSymbolsAdd />Mint</Button
        >
    </form>
</dialog>

<div class="flex w-full flex-col items-center gap-2">
    <div class="flex items-center gap-2">
        <MaterialSymbolsSearchRounded /><input
            class="rounded"
            type="text"
            bind:value={searchQuery}
        />
        <Button
            disabled={refreshing}
            on:click={() => {
                refreshing = true;
                nfts = contract.getNfts();
                collections = contract.getCollections();
            }}><MaterialSymbolsRefresh /></Button
        >
        {#if isAdmin}
            <Button class="flex items-center gap-1" on:click={onOpenMintDialog}
                ><MaterialSymbolsAdd />Mint new collection</Button
            >
        {/if}
    </div>
    {#await Promise.all([filteredCollections, nfts]) then [collections, nfts]}
        {#if collections.length > 0}
            <EvenGrid columnSize="146px">
                {#each collections as collection}
                    {@const collectionNfts = nfts.filter((nft) =>
                        collection.nftIds.includes(nft.id)
                    )}
                    <CollectionCard {collection} nfts={collectionNfts} />
                {/each}
            </EvenGrid>
        {:else}
            <span class="font-thin">Empty ...</span>
        {/if}
    {/await}
</div>
