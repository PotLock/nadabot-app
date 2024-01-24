import { Network } from "@wpdas/naxios";
import { utils } from "near-api-js";

// NETWORK
export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK ||
  "testnet") as Network;

// SYBIL CONTRACT
export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME as string;

// SOCIAL DB CONTRACT
export const SOCIAL_DB_CONTRACT_ID = process.env
  .NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID as string;

// 0.5 NEAR
export const HALF_YOCTO_NEAR = utils.format.parseNearAmount("0.5")!;
// 300 Gas (full)
export const FULL_TGAS = "300000000000000";
// 30 Gas
export const THIRTY_TGAS = "30000000000000";
// 20 Gas
export const TWENTY_TGAS = "20000000000000";
// 10 Gas
export const TEN_TGAS = "10000000000000";
// 0 Gas
export const NO_DEPOSIT_TGAS = "0";

// IPFS GATEWAY TO RENDER NEAR SOCIAL PROFILE IMAGE
export const IPFS_NEAR_SOCIAL_THUMBNAIL_URL =
  "https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/";
