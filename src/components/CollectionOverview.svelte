<script lang="ts">
    import type { ICollection, INft } from "$lib/contract/icontract";
    import CollectionCard from "./CollectionCard.svelte";
    import EvenGrid from "./EvenGrid.svelte";

    export let collections: ICollection[];
    export let nfts: INft[];

    type TCollectionWithNfts = ICollection & { nfts: INft[] };

    let ownedCollections: TCollectionWithNfts[];
    $: ownedCollections = collections.map((collection) => ({
        ...collection,
        nfts: nfts.filter((nft) => nft.collectionId === collection.id),
    }));
</script>

<div class="flex w-full flex-col items-center gap-2">
    <h2 class="text-center text-3xl">Collections</h2>
    {#if ownedCollections.length > 0}
        <EvenGrid columnSize="146px">
            {#each ownedCollections as collection}
                <CollectionCard {collection} nfts={collection.nfts} />
            {/each}
        </EvenGrid>
    {:else}
        <span class="text-center font-light">Empty ...</span>
    {/if}
</div>
