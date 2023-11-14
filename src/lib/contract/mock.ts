import {
    type IAuction,
    type ICollection,
    IContract,
    type INft,
    type IToken,
} from "./icontract";

export class MockContract extends IContract {
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

    async getCollections(): Promise<ICollection[]> {
        return [
            { id: 0n, name: "based collection", isClosed: false },
            {
                id: 1n,
                name: "svelte collection",
                isClosed: false,
            },
        ];
    }

    async getAuctions(nftId: bigint): Promise<IAuction[]> {
        return [];
    }

    async getTokens(address: string): Promise<IToken[]> {
        return [];
    }
}
