import type Web3 from "web3";

export interface INft {
    id: bigint;
    owner: string;
    name: string;
    isCollectible: boolean;
    collectionId?: bigint;
}

export interface IToken {
    nft: INft;
    amount: bigint;
}

export interface ICollection {
    id: bigint;
    name: string;
    isClosed: boolean;
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

    abstract getNfts(): Promise<INft[]>;
    abstract getCollections(): Promise<ICollection[]>;
    abstract getAuctions(nftId: bigint): Promise<IAuction[]>;

    abstract getTokens(address: string): Promise<IToken[]>;
}
