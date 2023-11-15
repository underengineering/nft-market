import {
    type IAuction,
    type ICollection,
    IContract,
    type INft,
} from "./icontract";

export class MockContract extends IContract {
    async getCollections(): Promise<ICollection[]> {
        return [
            {
                id: 0n,
                name: "based collection",
                isOpen: false,
                nftIds: [],
            },
            {
                id: 1n,
                name: "svelte collection",
                isOpen: false,
                nftIds: [],
            },
        ];
    }

    async getNfts(): Promise<INft[]> {
        return [
            {
                id: 0n,
                owner: "0x0",
                name: "svelte is based",
                isCollectible: false,
            },
            {
                id: 1n,
                owner: "0x1",
                name: "svelte is based",
                isCollectible: false,
            },
            {
                id: 2n,
                owner: "0x2",
                name: "svelte is based",
                isCollectible: false,
            },
            {
                id: 3n,
                owner: "0x3",
                name: "svelte is based",
                isCollectible: false,
            },
            {
                id: 4n,
                owner: "0x3",
                name: "svelte is based 1 collectible",
                isCollectible: true,
                collectionId: 0n,
            },
            {
                id: 4n,
                owner: "0x3",
                name: "svelte is based 2 collectible",
                isCollectible: true,
                collectionId: 0n,
            },
            {
                id: 4n,
                owner: "0x3",
                name: "svelte is based 3 collectible",
                isCollectible: true,
                collectionId: 0n,
            },
        ];
    }

    async getAuctions(nftId: bigint): Promise<IAuction[]> {
        return [];
    }

    async getCollectionSalePrice(
        collectionId: bigint
    ): Promise<bigint | undefined> {
        return undefined;
    }

    async getNftSalePrice(collectionId: bigint): Promise<bigint | undefined> {
        return undefined;
    }
}
