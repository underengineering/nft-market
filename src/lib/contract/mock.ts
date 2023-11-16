/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type IAuction,
    type ICollection,
    IContract,
    type INft,
} from "./icontract";

export class MockContract extends IContract {
    set activeAddress(_value: string | undefined) {
        // Unimplemented
    }

    get activeAddress(): string | undefined {
        // Unimplemented
        return "0x0";
    }

    async getAdmin(): Promise<string> {
        return "0x0";
    }

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

    async getAuction(_collectionId: bigint): Promise<IAuction | undefined> {
        return undefined;
    }

    async getCollectionSalePrice(
        _collectionId: bigint
    ): Promise<bigint | undefined> {
        return undefined;
    }

    async getNftSalePrice(_collectionId: bigint): Promise<bigint | undefined> {
        return undefined;
    }

    async mintCommonNft(_name: string): Promise<string> {
        return "0x0";
    }

    async mintCollection(_name: string, _nftNames: string[]): Promise<string> {
        return "0x0";
    }
}
