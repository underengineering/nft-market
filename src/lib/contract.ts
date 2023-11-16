import { get } from "svelte/store";

import abi from "./abi";
import { Contract } from "./contract/contract";
import storage from "./storage";
import { web3 } from "./web3";

const CONTRACT_ADDRESS = "0xcD20068C97816ee025bD5709bd4b9718B1C77F4F";
export const contract = new Contract(
    get(storage).selectedAddress,
    new web3.eth.Contract(abi, CONTRACT_ADDRESS)
);

storage.subscribe((value) => (contract.activeAddress = value.selectedAddress));

export default contract;
