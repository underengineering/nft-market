<script lang="ts">
    import type { ICollection, INft } from "$lib/contract/icontract";
    import { generateNftBackground } from "$lib/utils";
    import EvenGrid from "./EvenGrid.svelte";
    import NftCard from "./NftCard.svelte";

    export let nfts: INft[];
    export let collection: ICollection;

    let backgroundContainers: (HTMLDivElement | undefined)[] = [];
    $: {
        for (let idx = 0; idx < nfts.length; idx++) {
            const backgroundContainer = backgroundContainers[idx];
            if (backgroundContainer === undefined) continue;

            const nft = nfts[idx];
            generateNftBackground(nft, backgroundContainer);
        }
    }

    let nftDialog: HTMLDialogElement | undefined;
    function onClick() {
        if (nftDialog === undefined) return;

        if (!nftDialog.open) nftDialog.showModal();
        else nftDialog.close();
    }
</script>

<dialog
    class="w-full max-w-4xl flex-col rounded bg-background-secondary p-3 shadow-xl open:flex"
    bind:this={nftDialog}
>
    <h2 class="text-center text-3xl">NFTs in this collection</h2>
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
        <span class="text-xs">{collection.id}</span>
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
