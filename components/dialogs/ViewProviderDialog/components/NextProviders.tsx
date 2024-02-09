import { Stack, Typography } from "@mui/material";

import ContractInfo from "@nadabot/components/ContractInfo";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import { ProviderExternal } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

type Props = {
  providerInfo: ProviderExternal;
};

export default function NextProviders({ providerInfo }: Props) {
  const { active, deactivated } = useFilteredProviders(
    providerInfo!.provider_id,
  );
  const { maxWidth805 } = useBreakPoints();
  const { isAdmin } = useUser();

  const providers = isAdmin ? deactivated : active;

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
          <ContractInfo key={provider.provider_id} providerInfo={provider} />
        ))}
      </Stack>
    </Stack>
  );
}
