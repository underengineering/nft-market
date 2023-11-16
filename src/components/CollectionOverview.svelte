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

<div class="flex w-full flex-col gap-2">
    <h2 class="text-center text-3xl">Collections</h2>
    <EvenGrid columnSize="146px">
        {#each ownedCollections as collection}
            <CollectionCard {collection} nfts={collection.nfts} />
        {/each}
    </EvenGrid>
</div>
