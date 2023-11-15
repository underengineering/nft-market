<script lang="ts">
    import AccountSelector from "$components/AccountSelector.svelte";
    import CollectionOverview from "$components/CollectionOverview.svelte";
    import NftOverview from "$components/NftOverview.svelte";
    import TabList from "$components/TabList.svelte";
    import WalletOverview from "$components/WalletOverview.svelte";
    import type { ICollection, INft } from "$lib/contract/icontract";
    import storage from "$lib/storage";
    import {
        contract,
        getAccountsWithBalance,
        type IAccountInfo,
    } from "$lib/web3";

    const accounts = getAccountsWithBalance();
    let selectedAccount: Promise<IAccountInfo>;
    $: {
        selectedAccount = accounts.then((accounts) => {
            // Fix inconsistent address
            let selectedAddress = $storage.selectedAddress;
            let selectedAccount = accounts.find(
                (account) => account.address === selectedAddress
            );
            if (selectedAccount === undefined) {
                selectedAccount = accounts[0];
                $storage.selectedAddress = selectedAccount.address;
            }

            return selectedAccount;
        });
    }

    let nfts: Promise<INft[]>;
    $: nfts = selectedAccount.then(() => contract.getNfts());

    let collections: Promise<ICollection[]>;
    $: collections = selectedAccount.then(() => contract.getCollections());

    const tabs = ["My account", "Auctions", "NFTs"] as const;
    let activeTab = tabs[0];
</script>

<div class="flex h-full justify-center py-2">
    <div class="flex w-full max-w-3xl flex-col items-center gap-2">
        {#await Promise.all( [accounts, selectedAccount] ) then [accounts, selectedAccount]}
            <div
                class="flex w-full items-center justify-center rounded bg-background-secondary p-2 shadow"
            >
                <AccountSelector
                    {accounts}
                    selectedAccount={selectedAccount.address}
                />
            </div>
        {/await}
        {#await selectedAccount then selectedAccount}
            <div
                class="flex h-full w-full flex-col items-center gap-4 rounded bg-background-secondary p-2 shadow"
            >
                <WalletOverview account={selectedAccount} />
                <TabList {tabs} bind:activeTab />
                {#if activeTab === "My account"}
                    {#await nfts then nfts}
                        <NftOverview
                            selectedAccount={selectedAccount.address}
                            {nfts}
                        />
                        {#await collections then collections}
                            <CollectionOverview {collections} {nfts} />
                        {/await}
                    {/await}
                {/if}
            </div>
        {/await}
    </div>
</div>
