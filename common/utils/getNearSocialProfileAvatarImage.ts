import { IPFS_NEAR_SOCIAL_THUMBNAIL_URL } from "@nadabot/common/constants";

const getNearSocialProfileAvatarImage = (image_ipfs_cid?: string) =>
  image_ipfs_cid
    ? `${IPFS_NEAR_SOCIAL_THUMBNAIL_URL}${image_ipfs_cid}`
    : undefined;
export default getNearSocialProfileAvatarImage;
