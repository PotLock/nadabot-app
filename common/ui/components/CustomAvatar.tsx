import { Avatar, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";

import getNearSocialProfileAvatarImage from "@nadabot/common/lib/getNearSocialProfileAvatarImage";
import { get_user_profile } from "@nadabot/common/services/contracts/social";

import colors from "../colors";

type Props = {
  accountId?: string;
  size?: number;
  fontSize?: number;
  sx?: SxProps<Theme>;
};

export default function CustomAvatar({ accountId, size, fontSize, sx }: Props) {
  const [profileImage, setProfileImage] = useState<string>();

  useEffect(() => {
    (async () => {
      if (accountId) {
        const profileInfo = await get_user_profile({ accountId });
        const avatarUrl = getNearSocialProfileAvatarImage(
          profileInfo?.image?.ipfs_cid,
        );
        setProfileImage(avatarUrl);
      }
    })();
  }, [accountId]);

  if (!accountId) {
    return;
  }

  if (profileImage) {
    return (
      <Avatar
        alt={accountId}
        src={profileImage}
        sx={{ width: size || 16, height: size || 16, ...sx }}
      />
    );
  }

  return (
    <Avatar
      sx={{
        background: colors.PRIMARY,
        width: size || 16,
        height: size || 16,
        fontSize: fontSize || 12,
        ...sx,
      }}
    >
      {accountId[0]}
    </Avatar>
  );
}
