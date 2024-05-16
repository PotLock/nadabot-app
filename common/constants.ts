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

// 1 NEAR
export const ONE_NEAR = utils.format.parseNearAmount("1")!;
// 0.5 NEAR
export const HALF_NEAR = utils.format.parseNearAmount("0.5")!;
// 0.1 NEAR
export const ONE_TENTH_NEAR = utils.format.parseNearAmount("0.1")!;
// 0.01 NEAR
export const ONE_HUNDREDTH_NEAR = utils.format.parseNearAmount("0.01")!;
// 0.02 NEAR
export const TWO_HUNDREDTHS_NEAR = utils.format.parseNearAmount("0.02")!;
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

// Input Validation
// https://github.com/PotLock/core/tree/main/contracts/sybil#constants--input-validation
export const MAX_PROVIDER_NAME_LENGTH = 64;
export const MAX_PROVIDER_DESCRIPTION_LENGTH = 256;
export const MAX_PROVIDER_EXTERNAL_URL_LENGTH = 256;
export const MAX_PROVIDER_ICON_URL_LENGTH = 256;
export const MAX_GAS = 100; //100_000_000_000_000;
export const DEFAULT_ACCOUNT_ID_ARG_NAME = "account_id";

export const Routes = {
  HOME: "/",
  HOME_WITH_FILTERED_CHECKS: (
    filterType: "newly-created" | "active" | "deactivated" | "flagged",
  ) => `/?filterType=${filterType}`,
  ADD_STAMP: "/stamp/create",
  ACCOUNT_INFO: (accountId: string) => `/account-info?accountId=${accountId}`,
  ADMIN_HOME: "/admin",
};
