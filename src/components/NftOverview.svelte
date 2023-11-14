<script lang="ts">
    import type { INft } from "$lib/contract/icontract";
    import NftCard from "./NftCard.svelte";

    export let selectedAccount: string;
    export let nfts: INft[];

    let ownedNfts: INft[];
    $: ownedNfts = nfts.filter((nft) => nft.owner === selectedAccount);
</script>

<div class="flex flex-col gap-2">
    <h2 class="text-3xl">Your NFTs</h2>
    <div class="flex w-full flex-wrap justify-around gap-2">
        {#each ownedNfts as nft}
            <NftCard {nft} />
        {/each}
    </div>
</div>
