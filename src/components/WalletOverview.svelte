<script lang="ts">
    import MaterialSymbolsContentCopy from "~icons/material-symbols/content-copy";
    import type { IAccountInfo } from "$lib/web3";
    import { web3 } from "$lib/web3";
    import { truncateAddress } from "$lib/utils";

    export let account: IAccountInfo;
</script>

<div class="flex flex-col items-center gap-2">
    <button
        class="flex items-center gap-2 rounded-full bg-primary-200 px-2 py-1 text-primary-700"
        on:click={() => navigator.clipboard.writeText(account.address)}
    >
        {truncateAddress(account.address)}
        <MaterialSymbolsContentCopy />
    </button>
    <span class="text-3xl"
        >{web3.utils.fromWei(account.balance, "ether")} ETH</span
    >
</div>
