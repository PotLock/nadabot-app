import { CircularProgress, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import CustomButton from "@nadabot/components/ui/CustomButton";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { add_stamp } from "@nadabot/services/contracts/sybil.nadabot";
import { ProviderExternalWithIsHuman } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import { BellIcon } from "@nadabot/theme/icons";
import truncate from "@nadabot/utils/truncate";

type ItemProps = {
  providerInfo: ProviderExternalWithIsHuman;
  showBottomBorder?: boolean;
};

function Item({ providerInfo, showBottomBorder }: ItemProps) {
  const { maxWidth430, maxWidth1144 } = useBreakPoints();
  const [loading, isLoading] = useState(false);

  const verifyHandler = useCallback(async () => {
    isLoading(true);
    try {
      await add_stamp(providerInfo.provider_id);
    } catch (error) {
      console.error(error);
    }
    isLoading(false);
  }, [providerInfo.provider_id]);

  return (
    <Stack
      direction="row"
      justifyContent={maxWidth430 ? "center" : "space-between"}
      width="100%"
      borderTop="1px solid #F0F0F0"
      borderBottom={showBottomBorder ? "1px solid #F0F0F0" : undefined}
      py={1}
    >
      <Stack direction={maxWidth430 ? "column" : "row"} alignItems="center">
        <Typography
          fontSize={12}
          fontWeight={600}
          lineHeight="normal"
          mr={maxWidth430 ? 0 : 2}
        >
          {maxWidth1144 ? providerInfo.name : truncate(providerInfo.name, 15)}
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={500}
          lineHeight="20px"
          sx={{ textDecoration: "underline" }}
          mr={maxWidth430 ? 0 : 2}
          color={colors.NEUTRAL500}
        >
          {maxWidth1144
            ? providerInfo.contract_id
            : truncate(providerInfo.contract_id, 18)}
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={500}
          lineHeight="20px"
          sx={{ textDecoration: "underline" }}
          color={colors.NEUTRAL500}
        >
          {`${providerInfo.method_name}()`}
        </Typography>
        {loading ? (
          <Stack
            ml={maxWidth430 ? 0 : 2}
            width="60px"
            alignItems="center"
            py={0.75}
          >
            <CircularProgress size={16} sx={{ color: colors.BLUE }} />
          </Stack>
        ) : (
          <CustomButton
            sx={{
              width: 60,
              height: 24,
              pt: 1.5,
              ml: maxWidth430 ? 0 : 2,
              fontSize: 12,
              background: colors.PRIMARY,
              color: colors.WHITE,
              ":hover": { background: "#515151" },
            }}
            onClick={verifyHandler}
          >
            Verify
          </CustomButton>
        )}
      </Stack>
    </Stack>
  );
}

type PendingVerificationProps = {
  providers: ProviderExternalWithIsHuman[];
};

export default function PendingVerification({
  providers,
}: PendingVerificationProps) {
  const { maxWidth430 } = useBreakPoints();

  return (
    <Stack
      mb={2}
      width="96%"
      alignItems={maxWidth430 ? "center" : "flex-start"}
    >
      <Stack direction="row" alignItems="center" mb={2}>
        <BellIcon
          sx={{
            width: 14,
            mr: 2,
            display: maxWidth430 ? "none" : "block",
          }}
        />
        <Typography fontSize={18} fontWeight={700} lineHeight="normal">
          Pending Verification
        </Typography>
      </Stack>

      <Stack>
        {/* List - Max 3 items */}
        {providers.slice(0, 3).map((provider, index) => (
          <Item
            key={provider.provider_id}
            providerInfo={provider}
            showBottomBorder={providers.length - 1 === index}
          />
        ))}
      </Stack>
    </Stack>
  );
}