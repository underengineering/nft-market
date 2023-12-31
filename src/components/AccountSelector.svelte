<script lang="ts">
    import MaterialSymbolsExpandMore from "~icons/material-symbols/expand-more";
    import MaterialSymbolsExpandLess from "~icons/material-symbols/expand-less";
    import { truncateAddress, truncateStringFloat } from "$lib/utils";
    import { web3, type IAccountInfo } from "$lib/web3";
    import storage from "$lib/storage";
    import contract from "$lib/contract";

    export let accounts: IAccountInfo[];

    let accountIdx: number;
    $: accountIdx = accounts.findIndex(
        (account) => account.address === $storage.selectedAddress
    );

    const admin = contract.getAdmin();

    let expanded = false;
    function onAccountSelected(account: string) {
        $storage.selectedAddress = account;
        expanded = false;
    }
</script>

<div class="relative flex justify-center">
    <button
        class="flex items-center gap-1 rounded p-1 font-bold hover:bg-slate-300"
        on:click={() => (expanded = !expanded)}
    >
        Account {accountIdx + 1}
        {#if expanded}
            <MaterialSymbolsExpandLess />
        {:else}
            <MaterialSymbolsExpandMore />
        {/if}</button
    >
    {#if expanded}
        <div
            class=" absolute mt-10 flex flex-col gap-2 rounded bg-slate-300 p-1 shadow"
        >
            {#each accounts as account, idx}
                {@const isSelected =
                    account.address == $storage.selectedAddress}
                <button
                    class="flex justify-between gap-8 rounded border-primary-500 p-1 {isSelected
                        ? 'border-l-4 bg-primary-200'
                        : 'bg-slate-300'} hover:bg-slate-200"
                    on:click={() => onAccountSelected(account.address)}
                >
                    <div class="flex flex-col items-start">
                        <span class="font-semibold">Account {idx + 1}</span>
                        <span class="font-thin"
                            >{truncateAddress(account.address)}</span
                        >
                    </div>
                    <div class="flex flex-col items-end">
                        <span class="whitespace-nowrap"
                            >{truncateStringFloat(
                                web3.utils.fromWei(account.balance, "ether")
                            )} ETH</span
                        >
                        {#await admin then admin}
                            {#if account.address === admin}
                                <span>ADMIN</span>
                            {/if}
                        {/await}
                    </div>
                </button>
            {/each}
        </div>
    {/if}
</div>
