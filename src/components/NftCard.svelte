<script lang="ts">
    import type { INft } from "$lib/contract/icontract";
    import { generateNftBackground, truncateAddress } from "$lib/utils";

    export let nft: INft;

    let backgroundContainer: HTMLDivElement | undefined;
    $: if (backgroundContainer !== undefined)
        generateNftBackground(nft, backgroundContainer);
</script>

<div class="flex min-w-[146px] flex-col gap-1 rounded bg-slate-300 p-2">
    <div
        class="h-auto w-full self-center rounded"
        bind:this={backgroundContainer}
    ></div>
    <div class="flex flex-col leading-tight">
        <span class="text-xs">{nft.id}</span>
        <span class="overflow-hidden text-ellipsis whitespace-nowrap"
            >{nft.name}</span
        >
        <span class="text-xs font-light">{truncateAddress(nft.owner)}</span>
    </div>
</div>
