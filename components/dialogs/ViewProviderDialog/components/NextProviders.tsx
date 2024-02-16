import { Stack, Typography } from "@mui/material";

import ContractInfo from "@nadabot/components/ContractInfo";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import useIsAdminPage from "@nadabot/hooks/useIsAdminPage";
import { ProviderExternal } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

type Props = {
  providerInfo: ProviderExternal;
};

export default function NextProviders({ providerInfo }: Props) {
  const { active, deactivated } = useFilteredProviders({
    skipProviderId: providerInfo!.provider_id,
  });

  const { maxWidth805 } = useBreakPoints();
  const { isAdmin } = useUser();
  const isAdminPage = useIsAdminPage();

  const providers = isAdmin && isAdminPage ? deactivated : active;

  if (providers.length === 0) {
    return;
  }

  return (
    <Stack mt={4}>
      <Typography fontSize={20} fontWeight={600} mb={2}>
        Next Up:
      </Typography>
      <Stack
        direction="row"
        justifyContent={maxWidth805 ? "center" : "space-between"}
        gap={2}
        flexWrap="wrap"
      >
        {providers.slice(0, 3).map((provider) => (
          <ContractInfo
            key={provider.provider_id}
            providerInfo={provider}
            adminView={isAdmin && isAdminPage}
          />
        ))}
      </Stack>
    </Stack>
  );
}
