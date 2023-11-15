import type Web3 from "web3";

export interface INft {
    id: bigint;
    owner: string;
    name: string;
    isCollectible: boolean;
    collectionId?: bigint;
}

export interface ICollection {
    id: bigint;
    name: string;
    isOpen: boolean;
    nftIds: bigint[];
}

export interface IBid {
    bidder: string;
    amount: bigint;
}

export interface IAuction {
    startPrice: bigint;
    maxPrice: bigint;
    bids: IBid[];
}

export abstract class IContract {
    constructor(private readonly web3: Web3) {}

    abstract getCollections(): Promise<ICollection[]>;
    abstract getNfts(): Promise<INft[]>;
    abstract getAuctions(nftId: bigint): Promise<IAuction[]>;

    abstract getCollectionSalePrice(
        collectionId: bigint
    ): Promise<bigint | undefined>;
    abstract getNftSalePrice(nftId: bigint): Promise<bigint | undefined>;
}
