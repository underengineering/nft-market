import { get } from "svelte/store";

import abi from "./abi";
import { Contract } from "./contract/contract";
import storage from "./storage";
import { web3 } from "./web3";

const CONTRACT_ADDRESS = "0xFC6B3330357F84F3bb94318934C9c56b39D51a51";
export const contract = new Contract(
    get(storage).selectedAddress,
    new web3.eth.Contract(abi, CONTRACT_ADDRESS)
);

storage.subscribe((value) => (contract.activeAddress = value.selectedAddress));

export default contract;
