import type abi from "$lib/abi";
import { guardWeb3 } from "$lib/utils";
import type { Contract as Web3Contract } from "web3";

import {
    type IAuction,
    type ICollection,
    IContract,
    type INft,
} from "./icontract";

export class Contract extends IContract {
    constructor(
        private _activeAddress: string | undefined,
        private readonly contract: Web3Contract<typeof abi>
    ) {
        super();
    }

    set activeAddress(value: string | undefined) {
        this._activeAddress = value;
    }

    get activeAddress(): string | undefined {
        return this._activeAddress;
    }

    async getAdmin(): Promise<string> {
        return this.contract.methods
            .owner()
            .call({ from: this._activeAddress });
    }

    async getCollections(): Promise<ICollection[]> {
        const collections = await guardWeb3(() =>
            this.contract.methods
                .getCollections()
                .call({ from: this._activeAddress })
        );
        return collections.map((collection, idx) => ({
            ...collection,
            id: BigInt(idx),
            nftIds: collection.nftIds as bigint[],
        }));
    }

    async getNfts(): Promise<INft[]> {
        const nfts = await guardWeb3(() =>
            this.contract.methods.getNfts().call({ from: this._activeAddress })
        );
        return nfts.map((nft, idx) => ({
            ...nft,
            id: BigInt(idx),
            collectionId: nft.isCollectible
                ? (nft.collectionId as bigint)
                : undefined,
        }));
    }

    async getAuction(collectionId: bigint): Promise<IAuction | undefined> {
        const auction = await guardWeb3(() =>
            this.contract.methods
                .getAuction(collectionId)
                .call({ from: this._activeAddress })
        );
        if (!auction.isValid) return undefined;

        return {
            ...auction,
            startPrice: auction.startPrice as bigint,
            maxPrice: auction.maxPrice as bigint,
            bids: auction.bids.map((bid) => ({
                ...bid,
                amount: bid.amount as bigint,
            })),
        };
    }

    async getCollectionSalePrice(
        collectionId: bigint
    ): Promise<bigint | undefined> {
        const entry = await guardWeb3(() =>
            this.contract.methods
                .collectionSaleData(collectionId as unknown as string)
                .call()
        );
        if (!entry.isValid) return undefined;

        return entry.price as bigint;
    }

    async getNftSalePrice(nftId: bigint): Promise<bigint | undefined> {
        const entry = await guardWeb3(() =>
            this.contract.methods
                .collectionSaleData(nftId as unknown as string)
                .call({ from: this._activeAddress })
        );
        if (!entry.isValid) return undefined;

        return entry.price as bigint;
    }

    async mintCommonNft(name: string): Promise<string> {
        const tx = await guardWeb3(() =>
            this.contract.methods
                .mintCommonNft(name)
                .send({ from: this._activeAddress })
        );
        return tx.transactionHash;
    }

    async mintCollection(name: string, nftNames: string[]): Promise<string> {
        const tx = await guardWeb3(() =>
            this.contract.methods
                .mintCollection(name, nftNames)
                .send({ from: this._activeAddress })
        );
        return tx.transactionHash;
    }
}
