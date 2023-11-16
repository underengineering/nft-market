<script lang="ts">
    import type { INft } from "$lib/contract/icontract";
    import storage from "$lib/storage";
    import EvenGrid from "./EvenGrid.svelte";
    import NftCard from "./NftCard.svelte";

    export let nfts: INft[];

    let ownedNfts: INft[];
    $: ownedNfts = nfts.filter((nft) => nft.owner === $storage.selectedAddress);
</script>

<div class="flex w-full flex-col items-center gap-2">
    <h2 class="text-3xl">Your NFTs</h2>
    {#if ownedNfts.length > 0}
        <EvenGrid columnSize="146px">
            {#each ownedNfts as nft}
                <NftCard {nft} />
            {/each}
        </EvenGrid>
    {:else}
        <span class="font-thin">Empty ...</span>
    {/if}
</div>
