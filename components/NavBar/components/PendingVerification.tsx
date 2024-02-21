import { CircularProgress, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import CustomButton from "@nadabot/components/ui/CustomButton";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useSpinner from "@nadabot/hooks/useSpinner";
import { add_stamp } from "@nadabot/services/contracts/sybil.nadabot";
import { ProviderExternalWithIsHuman } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import addMultipleStamps from "@nadabot/services/web3/addMultipleStamps";
import colors from "@nadabot/theme/colors";
import { BellIcon } from "@nadabot/theme/icons";
import truncate from "@nadabot/utils/truncate";

type ItemProps = {
  providerInfo: ProviderExternalWithIsHuman;
  showBottomBorder?: boolean;
  buttonWithWhiteBg?: boolean;
};

function Item({
  providerInfo,
  showBottomBorder,
  buttonWithWhiteBg,
}: ItemProps) {
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
      <Stack
        direction={maxWidth430 ? "column" : "row"}
        alignItems="center"
        justifyContent="space-between"
        width="100%"
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
            {truncate(`${providerInfo.method_name}`, 13)}()
          </Typography>
        </Stack>

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
              background: buttonWithWhiteBg ? colors.WHITE : colors.PRIMARY,
              color: buttonWithWhiteBg ? colors.PRIMARY : colors.WHITE,
              ":hover": {
                background: buttonWithWhiteBg ? undefined : "#515151",
              },
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
  const { showSpinner, hideSpinner } = useSpinner();

  const verifyAllHandler = useCallback(async () => {
    showSpinner();
    await addMultipleStamps(providers);
    hideSpinner();
  }, [providers, showSpinner, hideSpinner]);

  return (
    <Stack
      mb={2}
      width="96%"
      alignItems={maxWidth430 ? "center" : "flex-start"}
    >
      <Stack
        direction="row"
        alignItems="center"
        mb={2}
        width="100%"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center">
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

        {/* If there are more than 1 item, show "Verify All" */}
        {providers.length > 1 && (
          <CustomButton
            sx={{
              width: 60,
              height: 24,
              pt: 1.5,
              px: 0,
              ml: maxWidth430 ? 0 : 2,
              fontSize: 12,
              background: colors.PRIMARY,
              color: colors.WHITE,
              ":hover": { background: "#515151" },
            }}
            onClick={verifyAllHandler}
          >
            Verify All
          </CustomButton>
        )}
      </Stack>

      <Stack width="100%">
        {/* List - Max 8 items */}
        {providers.slice(0, 8).map((provider, index) => (
          <Item
            key={provider.provider_id}
            providerInfo={provider}
            showBottomBorder={providers.length - 1 === index}
            buttonWithWhiteBg={providers.length > 1}
          />
        ))}
      </Stack>
    </Stack>
  );
}
