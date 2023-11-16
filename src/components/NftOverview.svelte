<script lang="ts">
    import type { INft } from "$lib/contract/icontract";
    import storage from "$lib/storage";
    import NftCard from "./NftCard.svelte";

    export let nfts: INft[];

    let ownedNfts: INft[];
    $: ownedNfts = nfts.filter((nft) => nft.owner === $storage.selectedAddress);
</script>

<div class="flex w-full flex-col gap-2">
    <h2 class="text-center text-3xl">Your NFTs</h2>
    <div id="grid" class="grid w-full justify-evenly">
        {#each ownedNfts as nft}
            <NftCard {nft} />
        {/each}
    </div>
</div>

<style lang="postcss">
    #grid {
        grid-template-columns: repeat(auto-fill, 146px);
        grid-gap: 1rem;
    }
</style>
