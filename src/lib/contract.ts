import { PUBLIC_CONTRACT_ADDRESS } from "$env/static/public";
import { get } from "svelte/store";

import abi from "./abi";
import { Contract } from "./contract/contract";
import storage from "./storage";
import { web3 } from "./web3";

export const contract = new Contract(
    get(storage).selectedAddress,
    new web3.eth.Contract(abi, PUBLIC_CONTRACT_ADDRESS)
);

storage.subscribe((value) => (contract.activeAddress = value.selectedAddress));

export default contract;
