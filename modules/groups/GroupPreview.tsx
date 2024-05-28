import { Avatar, AvatarGroup, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/common/ui/colors";

type ShowcasedProviders = [
  ProviderExternal?,
  ProviderExternal?,
  ProviderExternal?,
];

const iconSizeToStyle = (sizePx: number) => ({
  width: sizePx,
  height: sizePx,
  backgroundColor: "#fff",
});

export type GroupPreviewProps = {
  providerIds: GroupExternal["providers"];
  size?: "small" | "medium";
  withSurplus?: boolean;
};

export const GroupPreview: React.FC<GroupPreviewProps> = ({
  providerIds,
  size = "small",
  withSurplus = false,
}) => {
  const [
    [firstProvider, secondProvider, thirdProvider],
    setShowcasedProviderData,
  ] = useState<ShowcasedProviders>([]);

  useEffect(() => {
    Promise.all(
      providerIds
        .slice(0, 3)
        .map((provider_id) => sybilContract.get_provider({ provider_id })),
    ).then(([first, second, third]) =>
      setShowcasedProviderData([first, second, third]),
    );
  }, [providerIds]);

  return (
    <Stack
      gap={0.5}
      direction="row"
      alignItems="center"
      width={size === "small" ? 158 : "fit-content" /* 136 */}
    >
      <AvatarGroup spacing="small" sx={{ alignItems: "center" }}>
        {firstProvider && (
          <Avatar
            src={firstProvider.icon_url}
            title={firstProvider.provider_name}
            sx={iconSizeToStyle(size === "small" ? 46 : 82)}
          >
            {firstProvider.provider_name}
          </Avatar>
        )}

        {secondProvider && (
          <Avatar
            src={secondProvider.icon_url}
            title={secondProvider.provider_name}
            sx={iconSizeToStyle(size === "small" ? 38 : 68)}
          >
            {secondProvider.provider_name}
          </Avatar>
        )}

        {thirdProvider && (
          <Avatar
            src={thirdProvider.icon_url}
            title={thirdProvider.provider_name}
            sx={iconSizeToStyle(size === "small" ? 30 : 54)}
          >
            {thirdProvider.provider_name}
          </Avatar>
        )}
      </AvatarGroup>

      {withSurplus && providerIds.length > 3 && (
        <Typography
          color={colors.NEUTRAL300}
          fontSize={16}
          fontWeight={400}
          whiteSpace="nowrap"
        >
          {`+${providerIds.length - 3} more`}
        </Typography>
      )}
    </Stack>
  );
};
