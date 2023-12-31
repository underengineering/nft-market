import Web3 from "web3";

import type { MetaMaskInpageProvider } from "@metamask/providers";

import { guardWeb3 } from "./utils";

type TWindowInjected = Window &
    typeof globalThis & { ethereum: MetaMaskInpageProvider };
const provider = (window as TWindowInjected).ethereum;
export const web3 = new Web3({ provider });

export type IAccountInfo = {
    address: string;
    balance: bigint;
};

export async function getAccountsWithBalance(): Promise<IAccountInfo[]> {
    const accounts = await web3.eth.getAccounts();
    const accountsWithBalance = accounts.map(async (account) => {
        const balance = await guardWeb3(() => web3.eth.getBalance(account));
        return { address: account, balance };
    });

    return await Promise.all(accountsWithBalance);
}

/*
 * https://eips.ethereum.org/EIPS/eip-1102#eth_requestaccounts
 * Browsers MUST include at least one account if the eth_requestAccounts promise is resolved.
 * Browsers MUST reject the promise with an informative error if no accounts are available.
 */
export async function requestAccounts() {
    return await provider.request<string[]>({ method: "eth_requestAccounts" });
}
