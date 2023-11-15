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
    constructor(private readonly contract: Web3Contract<typeof abi>) {
        super();
    }

    async getCollections(): Promise<ICollection[]> {
        return await guardWeb3(() =>
            this.contract.methods.getCollections().call()
        );
    }

    async getNfts(): Promise<INft[]> {
        const nfts = await guardWeb3(() =>
            this.contract.methods.getNfts().call()
        );
        return nfts.map((nft, idx) => ({
            ...nft,
            id: BigInt(idx),
            collectionId: nft.isCollectible
                ? (nft.collectionId as bigint)
                : undefined,
        }));
    }

    async getAuctions(collectionId: bigint): Promise<IAuction | undefined> {
        const auction = await guardWeb3(() =>
            this.contract.methods.getAuction(collectionId).call()
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
                .call()
        );
        if (!entry.isValid) return undefined;

        return entry.price as bigint;
    }
}
