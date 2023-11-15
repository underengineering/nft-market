import { get } from "svelte/store";

import abi from "./abi";
import { Contract } from "./contract/contract";
import storage from "./storage";
import { web3 } from "./web3";

const CONTRACT_ADDRESS = "0x06cc7096339e23A5E9e3F0D2fd6f58325b4663AA";
export const contract = new Contract(
    get(storage).selectedAddress,
    new web3.eth.Contract(abi, CONTRACT_ADDRESS)
);

storage.subscribe((value) => (contract.activeAddress = value.selectedAddress));

export default contract;
