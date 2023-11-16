import { get } from "svelte/store";

import abi from "./abi";
import { Contract } from "./contract/contract";
import storage from "./storage";
import { web3 } from "./web3";

const CONTRACT_ADDRESS = "0xA7786DC4f17BA66eC65264B906E1a1df21234DF2";
export const contract = new Contract(
    get(storage).selectedAddress,
    new web3.eth.Contract(abi, CONTRACT_ADDRESS)
);

storage.subscribe((value) => (contract.activeAddress = value.selectedAddress));

export default contract;
