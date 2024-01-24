import naxios from "@wpdas/naxios";

import { NETWORK, SOCIAL_DB_CONTRACT_ID } from "./constants";

const naxiosInstance = new naxios({
  contractId: SOCIAL_DB_CONTRACT_ID,
  network: NETWORK,
});

const socialDbContractApi = naxiosInstance.contractApi();

interface NEARSocialUserProfileInput {
  keys: string[];
}

export interface NEARSocialUserProfile {
  name?: string;
  linktree?: {
    twitter?: string;
    github?: string;
    telegram?: string;
    website?: string;
  };
  image?: {
    ipfs_cid?: string;
  };
  description?: string;
  backgroundImage?: {
    url?: string;
  };
  tags?: Record<string, string>;
  horizon_tnc?: string;
}

type NEARSocialGetResponse = {
  [key: string]: {
    profile?: NEARSocialUserProfile;
  };
};

/**
 * Get User Profile Info from NEAR Social DB
 * @returns
 */
export const get_user_profile = async (input: { accountId: string }) => {
  const response = await socialDbContractApi.view<
    NEARSocialUserProfileInput,
    NEARSocialGetResponse
  >("get", {
    args: {
      keys: [`${input.accountId}/profile/**`],
    },
  });

  return response[input.accountId]?.profile;
};
