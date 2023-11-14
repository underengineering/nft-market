import Web3 from "web3";

import type { MetaMaskInpageProvider } from "@metamask/providers";

import { MockContract } from "./contract/mock";

type TWindowInjected = Window &
    typeof globalThis & { ethereum: MetaMaskInpageProvider };
const provider = (window as TWindowInjected).ethereum;
export const web3 = new Web3({ provider });
export const contract = new MockContract(web3);

export type IAccountInfo = {
    address: string;
    balance: bigint;
};

export function getAccountsWithBalance(): Promise<IAccountInfo[]> {
    return web3.eth.getAccounts().then((accounts) => {
        const accountsWithBalance = accounts.map(async (account) => {
            const balance = await web3.eth.getBalance(account);
            return { address: account, balance };
        });

        return Promise.all(accountsWithBalance);
    });
}

/*
 * https://eips.ethereum.org/EIPS/eip-1102#eth_requestaccounts
 * Browsers MUST include at least one account if the eth_requestAccounts promise is resolved.
 * Browsers MUST reject the promise with an informative error if no accounts are available.
 */
export async function requestAccounts() {
    return await provider.request<string[]>({ method: "eth_requestAccounts" });
}
