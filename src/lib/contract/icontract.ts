export interface INftSaleData {
    isOnSale: boolean;
    price: bigint;
}

export interface INft {
    id: bigint;
    owner: string;
    name: string;
    isCollectible: boolean;
    collectionId?: bigint;

    saleData: INftSaleData;
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
    abstract set activeAddress(value: string | undefined);
    abstract get activeAddress(): string | undefined;

    abstract getAdmin(): Promise<string>;

    abstract getCollections(): Promise<ICollection[]>;
    abstract getNfts(): Promise<INft[]>;
    abstract getAuction(collectionId: bigint): Promise<IAuction | undefined>;

    abstract mintCommonNft(name: string): Promise<string>;
    abstract mintCollection(name: string, nftNames: string[]): Promise<string>;

    abstract placeNftOnSell(id: bigint, price: bigint): Promise<string>;
    abstract buyNft(id: bigint, price: bigint): Promise<string>;

    abstract startAuction(
        id: bigint,
        startPrice: bigint,
        maxPrice: bigint
    ): Promise<string>;
    abstract joinAuction(id: bigint, amount: bigint): Promise<string>;
    abstract finishAuction(id: bigint): Promise<string>;
}
