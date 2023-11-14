<script lang="ts">
    import type { INft } from "$lib/contract/icontract";
    import { generateNftBackground } from "$lib/utils";

    export let nft: INft;

    let backgroundContainer: HTMLDivElement | undefined;
    $: if (backgroundContainer !== undefined)
        generateNftBackground(nft, backgroundContainer);
</script>

<div class="flex w-[146px] flex-col rounded bg-slate-300 p-2">
    <div
        class="h-32 w-32 self-center rounded"
        bind:this={backgroundContainer}
    ></div>
    <span class="overflow-hidden text-ellipsis whitespace-nowrap"
        >{nft.name}</span
    >
</div>
