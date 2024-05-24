import { Stack, Typography } from "@mui/material";

import useIsAdminPage from "@nadabot/common/lib/useIsAdminPage";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import { useUser } from "@nadabot/common/store/useUser";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { StampCard } from "@nadabot/features/stamps/StampCard";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";

export type StampsNextUpProps = {
  providerInfo: ProviderExternal;
};

export const StampsNextUp: React.FC<StampsNextUpProps> = ({ providerInfo }) => {
  const { active, deactivated } = useFilteredProviders({
    skipProviderId: providerInfo!.id,
  });

  const { maxWidth805 } = useBreakPoints();
  const { isAdmin } = useUser();
  const isAdminPage = useIsAdminPage();

  const providers = isAdmin && isAdminPage ? deactivated : active;

  return providers.length === 0 ? null : (
    <Stack mt={4}>
      <Typography fontSize={20} fontWeight={600} mb={2}>
        Next Up:
      </Typography>

      <Stack
        direction="row"
        justifyContent={maxWidth805 ? "center" : "start"}
        gap={2}
        flexWrap="wrap"
      >
        {providers.slice(0, 3).map((provider) => (
          <StampCard
            key={provider.id}
            providerInfo={provider}
            adminView={isAdmin && isAdminPage}
          />
        ))}
      </Stack>
    </Stack>
  );
};
