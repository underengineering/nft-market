import { get } from "svelte/store";

import abi from "./abi";
import { Contract } from "./contract/contract";
import storage from "./storage";
import { web3 } from "./web3";

const CONTRACT_ADDRESS = "0x46718A5600D452dAF65D0d342855b7073DaE50a5";
export const contract = new Contract(
    get(storage).selectedAddress,
    new web3.eth.Contract(abi, CONTRACT_ADDRESS)
);

storage.subscribe((value) => (contract.activeAddress = value.selectedAddress));

export default contract;
