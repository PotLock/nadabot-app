import { PotLockSybilContractInterface } from "./near-contract-interface";
import { wallet } from "./near-wallet";

const contract = new PotLockSybilContractInterface(wallet);

export { contract, wallet };
