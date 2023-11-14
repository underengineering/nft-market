<script lang="ts">
    import type { ICollection, INft } from "$lib/contract/icontract";
    import CollectionCard from "./CollectionCard.svelte";

    export let collections: ICollection[];
    export let nfts: INft[];

    type TCollectionWithNfts = ICollection & { id: bigint; nfts: INft[] };

    let ownedCollections: TCollectionWithNfts[];
    $: ownedCollections = collections.map((collection) => ({
        ...collection,
        nfts: nfts.filter(
            (nft) => nft.isCollectible && nft.collectionId === collection.id
        ),
    }));
</script>

<div class="flex flex-col gap-2">
    <h2 class="text-3xl">Collections</h2>
    <div class="flex w-full flex-wrap justify-around gap-2">
        {#each ownedCollections as collection}
            <CollectionCard {collection} nfts={collection.nfts} />
        {/each}
    </div>
</div>
