import { Stack, Typography } from "@mui/material";

import { ProviderCard } from "@nadabot/components/provider/ProviderCard";
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
    skipProviderId: providerInfo!.id,
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
          <ProviderCard
            key={provider.id}
            providerInfo={provider}
            adminView={isAdmin && isAdminPage}
          />
        ))}
      </Stack>
    </Stack>
  );
}
